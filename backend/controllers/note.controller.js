const Note = require('../models/Note.model');

// GET /api/notes — supports ?search, ?tag, ?category, ?archived
const getNotes = async (req, res) => {
  try {
    const { search, tag, category, archived } = req.query;

    // always scope to the logged-in user
    const filter = { user: req.user._id, isArchived: archived === 'true' };

    // search across title, content, and tags using case-insensitive regex
    if (search) {
      filter.$or = [
        { title:   { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags:    { $regex: search, $options: 'i' } },
      ];
    }
    if (tag)      filter.tags     = tag;
    if (category) filter.category = category;

    // pinned notes always appear first
    const notes = await Note.find(filter).sort({ isPinned: -1, updatedAt: -1 });
    res.json({ notes });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/notes/:id
const getNoteById = async (req, res) => {
  try {
    // include user in query so users can't access each other's notes
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ note });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/notes
const createNote = async (req, res) => {
  try {
    const note = await Note.create({ ...req.body, user: req.user._id });
    res.status(201).json({ note });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/notes/:id
const updateNote = async (req, res) => {
  try {
    // { new: true } returns the updated document instead of the old one
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ note });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// reusable toggle factory — flips a boolean field and saves
// used for archive, pin, and share so we don't repeat the same try/catch three times
const toggle = (field) => async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    note[field] = !note[field];
    await note.save(); // triggers pre-save hook (e.g. generates shareId when isPublic = true)
    res.json({ note });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const toggleArchive = toggle('isArchived');
const togglePin     = toggle('isPinned');
const toggleShare   = toggle('isPublic');

module.exports = {
  getNotes, getNoteById, createNote, updateNote,
  deleteNote, toggleArchive, togglePin, toggleShare,
};
