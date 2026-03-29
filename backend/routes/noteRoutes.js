const express = require('express');
const router = express.Router();
const { getNotes, createNote, updateNote, deleteNote } = require('../controllers/notesController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', protect, getNotes);
router.post('/', protect, upload.single('file'), createNote);
router.put('/:id', protect, upload.single('file'), updateNote);
router.delete('/:id', protect, deleteNote);

module.exports = router;
