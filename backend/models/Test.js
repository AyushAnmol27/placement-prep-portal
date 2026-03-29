const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, default: '' },
  marks: { type: Number, default: 1 },
  negativeMarks: { type: Number, default: 0 },
  section: { type: String, default: 'General' },
});

const attemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: Number,
  total: Number,
  percentage: Number,
  rank: Number,
  timeTaken: Number, // seconds
  answers: [{ questionIndex: Number, selected: Number }],
  completedAt: { type: Date, default: Date.now },
});

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: {
    type: String,
    enum: ['DSA', 'Aptitude', 'CS Fundamentals', 'System Design', 'Full Length', 'Company Specific'],
    required: true,
  },
  company: { type: String, default: '' },     // for company-specific tests
  sections: [{ type: String }],               // e.g. ['Quantitative', 'Verbal', 'Coding']
  duration: { type: Number, required: true }, // minutes
  totalMarks: { type: Number, default: 0 },
  passingMarks: { type: Number, default: 0 },
  questions: [questionSchema],
  attempts: [attemptSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  isPremium: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
