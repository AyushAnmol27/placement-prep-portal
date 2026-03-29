const Problem = require('../models/Problem');
const User = require('../models/User');
const calculateStreak = require('../utils/streakCalculator');

const XP_MAP = { Easy: 20, Medium: 50, Hard: 100 };

const markProblemSolved = async (userId, problemId) => {
  const [user, problem] = await Promise.all([User.findById(userId), Problem.findById(problemId)]);
  if (!problem) throw new Error('Problem not found');

  const alreadySolved = user.solvedProblems.map(id => id.toString()).includes(problemId.toString());
  if (!alreadySolved) {
    user.solvedProblems.push(problemId);
    user.streak = calculateStreak(user.lastActiveDate, user.streak);
    if (user.streak > user.maxStreak) user.maxStreak = user.streak;
    user.lastActiveDate = new Date();
    user.xp += XP_MAP[problem.difficulty] || 20;
    user.computeLevel();

    // Update activity log
    const today = new Date().toISOString().split('T')[0];
    const log = user.activityLog.find(l => l.date === today);
    if (log) log.count++;
    else user.activityLog.push({ date: today, count: 1 });

    // Award badges
    const solved = user.solvedProblems.length;
    const badges = [
      { count: 1, name: 'First Blood', icon: '🩸' },
      { count: 10, name: 'Problem Solver', icon: '💡' },
      { count: 50, name: 'Code Warrior', icon: '⚔️' },
      { count: 100, name: 'Century Club', icon: '💯' },
    ];
    for (const b of badges) {
      if (solved === b.count && !user.badges.find(ub => ub.name === b.name)) {
        user.badges.push({ name: b.name, icon: b.icon, earnedAt: new Date() });
      }
    }

    await user.save();

    if (!problem.solvedBy.includes(userId)) {
      problem.solvedBy.push(userId);
      await problem.save();
    }
  }

  return { streak: user.streak, totalSolved: user.solvedProblems.length, xp: user.xp, level: user.level };
};

module.exports = { markProblemSolved };
