const mongoose = require('mongoose');

const aptitudeQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, default: '' },
  category: {
    type: String,
    enum: ['Quantitative', 'Logical Reasoning', 'Verbal', 'Data Interpretation'],
    required: true,
  },
  topic: { type: String, default: '' },       // e.g. "Percentages", "Blood Relations"
  subtopic: { type: String, default: '' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  tags: [{ type: String }],
  companies: [{ type: String }],
  timeLimit: { type: Number, default: 60 },   // seconds per question
  solvedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('AptitudeQuestion', aptitudeQuestionSchema);
