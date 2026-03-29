const mongoose = require('mongoose');

const interviewExpSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorName: { type: String },
  role: { type: String },
  experience: { type: String },
  rounds: { type: String },
  result: { type: String, enum: ['Selected', 'Rejected', 'Pending'], default: 'Pending' },
  year: { type: Number },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, unique: true },
  logo: { type: String, default: '' },
  description: { type: String, default: '' },
  industry: { type: String, default: '' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  tags: [{ type: String }],
  problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
  tests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }],
  interviewProcess: { type: String, default: '' },
  avgPackage: { type: String, default: '' },
  roles: [{ type: String }],
  website: { type: String, default: '' },
  employeeCount: { type: String, default: '' },
  interviewExperiences: [interviewExpSchema],
  previousYearQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AptitudeQuestion' }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

companySchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  next();
});

module.exports = mongoose.model('Company', companySchema);
