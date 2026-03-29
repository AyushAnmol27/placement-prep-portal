const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, default: '' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }],
  category: {
    type: String,
    enum: ['DSA', 'System Design', 'Interview Experience', 'Tips & Tricks', 'Career Guidance', 'Study Roadmap', 'General'],
    default: 'General',
  },
  coverImage: { type: String, default: '' },
  published: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  readingTime: { type: Number, default: 1 }, // minutes
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
}, { timestamps: true });

blogSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
  }
  if (this.content) {
    this.readingTime = Math.max(1, Math.ceil(this.content.split(' ').length / 200));
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
