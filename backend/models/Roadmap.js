const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  targetCompany: { type: String, default: '' },
  targetRole: { type: String, default: '' },
  targetDate: { type: Date },
  currentLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  weeks: [{
    week: Number,
    title: String,
    topics: [String],
    resources: [String],
    problems: [String],
    completed: { type: Boolean, default: false },
  }],
  progress: { type: Number, default: 0 }, // percentage
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', roadmapSchema);
