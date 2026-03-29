const User = require('../models/User');
const Problem = require('../models/Problem');
const Test = require('../models/Test');
const AptitudeQuestion = require('../models/AptitudeQuestion');

const getUserAnalytics = async (userId) => {
  const user = await User.findById(userId).populate('solvedProblems', 'difficulty tags');

  const solved = user.solvedProblems || [];
  const byDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
  const tagFreq = {};

  solved.forEach(p => {
    if (byDifficulty[p.difficulty] !== undefined) byDifficulty[p.difficulty]++;
    p.tags?.forEach(t => { tagFreq[t] = (tagFreq[t] || 0) + 1; });
  });

  const topTags = Object.entries(tagFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }));

  const testAttempts = await Test.find({ 'attempts.user': userId });
  const scores = testAttempts.flatMap(t =>
    t.attempts.filter(a => a.user.toString() === userId.toString())
      .map(a => ({ title: t.title, score: a.score, total: a.total, date: a.completedAt }))
  );

  const aptitudeSolved = await AptitudeQuestion.countDocuments({ solvedBy: userId });

  return {
    streak: user.streak,
    totalSolved: solved.length,
    byDifficulty,
    topTags,
    testScores: scores.slice(-10),
    aptitudeSolved,
  };
};

module.exports = { getUserAnalytics };
