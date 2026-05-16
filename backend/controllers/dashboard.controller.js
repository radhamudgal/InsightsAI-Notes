const Note = require('../models/Note.model');

// GET /api/dashboard/stats
// uses MongoDB aggregation pipelines to compute analytics server-side
const getStats = async (req, res) => {
  try {
    const uid = req.user._id;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // run all queries in parallel for better performance
    const [totalNotes, archivedNotes, pinnedNotes, publicNotes] = await Promise.all([
      Note.countDocuments({ user: uid, isArchived: false }),
      Note.countDocuments({ user: uid, isArchived: true }),
      Note.countDocuments({ user: uid, isPinned: true }),
      Note.countDocuments({ user: uid, isPublic: true }),
    ]);

    const [activityData, tagData, categoryData, wordResult, recentNotes] = await Promise.all([
      // notes created per day over the last 7 days — used for the bar chart
      Note.aggregate([
        { $match: { user: uid, createdAt: { $gte: sevenDaysAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),

      // top 10 tags — $unwind flattens the tags array so we can group by individual tag
      Note.aggregate([
        { $match: { user: uid, isArchived: false } },
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      // notes per category — used for the pie chart
      Note.aggregate([
        { $match: { user: uid, isArchived: false } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),

      // total words written across all active notes
      Note.aggregate([
        { $match: { user: uid, isArchived: false } },
        { $group: { _id: null, total: { $sum: '$wordCount' } } },
      ]),

      Note.find({ user: uid, isArchived: false })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select('title updatedAt wordCount tags'),
    ]);

    res.json({
      stats: {
        totalNotes, archivedNotes, pinnedNotes, publicNotes,
        totalWords: wordResult[0]?.total || 0,
      },
      activityData,
      tagData,
      categoryData,
      recentNotes,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getStats };
