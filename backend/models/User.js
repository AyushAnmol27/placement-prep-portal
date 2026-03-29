const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please use a valid email address'] 
  },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  college: { type: String, default: '' },
  graduationYear: { type: Number },
  skills: [{ type: String }],

  // Streak
  streak: { type: Number, default: 0 },
  maxStreak: { type: Number, default: 0 },
  lastActiveDate: { type: Date },

  // Progress
  solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
  bookmarkedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
  aptitudeSolved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AptitudeQuestion' }],

  // XP & Gamification
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [{ name: String, icon: String, earnedAt: Date }],

  // Test history
  testAttempts: [{
    test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
    score: Number,
    total: Number,
    percentage: Number,
    rank: Number,
    completedAt: { type: Date, default: Date.now },
  }],

  // Daily activity heatmap
  activityLog: [{
    date: { type: String }, // YYYY-MM-DD
    count: { type: Number, default: 0 },
  }],

  isActive: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

// Auto-compute level from XP
userSchema.methods.computeLevel = function () {
  this.level = Math.floor(this.xp / 500) + 1;
};

module.exports = mongoose.model('User', userSchema);
