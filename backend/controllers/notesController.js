const asyncHandler = require('express-async-handler');
const Note = require('../models/Note');
const { cloudinary } = require('../config/cloudinary');

const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json(notes);
});

const createNote = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;
  const note = await Note.create({
    user: req.user._id,
    title,
    content,
    tags: tags ? JSON.parse(tags) : [],
    fileUrl: req.file?.path || '',
    filePublicId: req.file?.filename || '',
  });
  res.status(201).json(note);
});

const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) { res.status(404); throw new Error('Note not found'); }
  Object.assign(note, req.body);
  if (req.file) {
    if (note.filePublicId) await cloudinary.uploader.destroy(note.filePublicId);
    note.fileUrl = req.file.path;
    note.filePublicId = req.file.filename;
  }
  await note.save();
  res.json(note);
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!note) { res.status(404); throw new Error('Note not found'); }
  if (note.filePublicId) await cloudinary.uploader.destroy(note.filePublicId);
  res.json({ message: 'Note deleted' });
});

module.exports = { getNotes, createNote, updateNote, deleteNote };
