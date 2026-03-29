const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  topic: { type: String, default: '' },
  isMarkdown: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: false },
  fileUrl: { type: String, default: '' },
  filePublicId: { type: String, default: '' },
  tags: [{ type: String }],
  isPinned: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
