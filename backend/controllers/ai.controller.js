const ai = require('../services/ai.service');
const Note = require('../models/Note.model');

// POST /api/ai/summary
const generateSummary = async (req, res) => {
  try {
    const { content, noteId } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });

    const summary = await ai.generateSummary(content);

    // persist the result so the shared note page can display it without re-calling AI
    if (noteId) {
      await Note.findOneAndUpdate({ _id: noteId, user: req.user._id }, { aiSummary: summary });
    }

    res.json({ summary });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/ai/action-items
const extractActionItems = async (req, res) => {
  try {
    const { content, noteId } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });

    const actionItems = await ai.extractActionItems(content);

    if (noteId) {
      await Note.findOneAndUpdate({ _id: noteId, user: req.user._id }, { aiActionItems: actionItems });
    }

    res.json({ actionItems });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/ai/title
const suggestTitle = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });

    const title = await ai.suggestTitle(content);
    res.json({ title });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { generateSummary, extractActionItems, suggestTitle };
