const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const AptitudeQuestion = require('../models/AptitudeQuestion');
const Test = require('../models/Test');

const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('solvedProblems', 'difficulty tags')
    .populate('aptitudeSolved', 'category topic difficulty');

  const solved = user.solvedProblems || [];
  const aptSolved = user.aptitudeSolved || [];

  // Problems by difficulty
  const byDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
  const tagFreq = {};
  solved.forEach(p => {
    if (byDifficulty[p.difficulty] !== undefined) byDifficulty[p.difficulty]++;
    p.tags?.forEach(t => { tagFreq[t] = (tagFreq[t] || 0) + 1; });
  });

  // Top tags
  const topTags = Object.entries(tagFreq).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([tag, count]) => ({ tag, count }));

  // Aptitude by category
  const aptByCategory = {};
  aptSolved.forEach(q => { aptByCategory[q.category] = (aptByCategory[q.category] || 0) + 1; });

  // Weak topics (categories with < 30% solved)
  const allTopicStats = await AptitudeQuestion.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', total: { $sum: 1 } } },
  ]);
  const weakTopics = allTopicStats
    .map(s => ({ category: s._id, total: s.total, solved: aptByCategory[s._id] || 0 }))
    .filter(s => (s.solved / s.total) < 0.3)
    .map(s => ({ ...s, percentage: Math.round((s.solved / s.total) * 100) }));

  // Recent submissions
  const recentSubmissions = await Submission.find({ user: req.user._id })
    .populate('problem', 'title difficulty')
    .sort({ createdAt: -1 })
    .limit(10);

  // Test performance
  const testScores = user.testAttempts.slice(-10).map(a => ({
    score: a.percentage,
    date: a.completedAt,
  }));

  // Activity log (last 30 days)
  const activityLog = user.activityLog.slice(-30);

  // Total stats
  const totalProblems = await Problem.countDocuments({ isActive: true });
  const totalAptitude = await AptitudeQuestion.countDocuments({ isActive: true });

  res.json({
    streak: user.streak,
    maxStreak: user.maxStreak,
    xp: user.xp,
    level: user.level,
    badges: user.badges,
    totalSolved: solved.length,
    totalProblems,
    totalAptitudeSolved: aptSolved.length,
    totalAptitude,
    byDifficulty,
    topTags,
    aptByCategory,
    weakTopics,
    recentSubmissions,
    testScores,
    activityLog,
  });
});

const getAdminAnalytics = asyncHandler(async (req, res) => {
  const [totalUsers, totalProblems, totalTests, totalBlogs, totalAptitude] = await Promise.all([
    User.countDocuments(),
    Problem.countDocuments({ isActive: true }),
    Test.countDocuments({ isActive: true }),
    require('../models/Blog').countDocuments({ published: true }),
    AptitudeQuestion.countDocuments({ isActive: true }),
  ]);

  const recentUsers = await User.find().select('name email createdAt').sort({ createdAt: -1 }).limit(10);
  const topUsers = await User.find().select('name xp level solvedProblems').sort({ xp: -1 }).limit(10);

  res.json({ totalUsers, totalProblems, totalTests, totalBlogs, totalAptitude, recentUsers, topUsers });
});

module.exports = { getDashboardAnalytics, getAdminAnalytics };
