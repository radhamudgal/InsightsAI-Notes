const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getNotes, getNoteById, createNote, updateNote,
  deleteNote, toggleArchive, togglePin, toggleShare,
} = require('../controllers/note.controller');

const router = express.Router();

// All note routes require login
router.use(protect);

router.get('/',          getNotes);
router.post('/',         createNote);
router.get('/:id',       getNoteById);
router.put('/:id',       updateNote);
router.delete('/:id',    deleteNote);
router.patch('/:id/archive', toggleArchive);
router.patch('/:id/pin',     togglePin);
router.patch('/:id/share',   toggleShare);

module.exports = router;
