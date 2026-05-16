const express = require('express');
const Note = require('../models/Note.model');

const router = express.Router();

// GET /api/share/:shareId — public route, no login needed
router.get('/:shareId', async (req, res) => {
  try {
    const note = await Note.findOne({ shareId: req.params.shareId, isPublic: true })
      .populate('user', 'name'); // only include author's name
    if (!note) return res.status(404).json({ message: 'Note not found or not public' });
    res.json({ note });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
