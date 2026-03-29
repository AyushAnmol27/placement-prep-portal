const asyncHandler = require('express-async-handler');
const Test = require('../models/Test');
const User = require('../models/User');

const getTests = asyncHandler(async (req, res) => {
  const { category, company } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (company) filter.company = company;
  const tests = await Test.find(filter)
    .select('-questions.correctAnswer -questions.explanation -attempts')
    .sort({ createdAt: -1 });
  res.json(tests);
});

const getTest = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id).select('-questions.correctAnswer');
  if (!test) { res.status(404); throw new Error('Test not found'); }
  res.json(test);
});

const submitTest = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);
  if (!test) { res.status(404); throw new Error('Test not found'); }

  const { answers, timeTaken } = req.body;
  let score = 0;
  let totalMarks = 0;

  const results = test.questions.map((q, i) => {
    const marks = q.marks || 1;
    const neg = q.negativeMarks || 0;
    totalMarks += marks;
    const correct = answers[i] === q.correctAnswer;
    const skipped = answers[i] === -1 || answers[i] === undefined;
    if (correct) score += marks;
    else if (!skipped) score -= neg;
    return { question: q.question, selected: answers[i] ?? -1, correct, correctAnswer: q.correctAnswer, explanation: q.explanation, section: q.section };
  });

  const percentage = Math.round((score / totalMarks) * 100);

  // Compute rank among all attempts
  const allAttempts = test.attempts.map(a => a.percentage);
  allAttempts.push(percentage);
  allAttempts.sort((a, b) => b - a);
  const rank = allAttempts.indexOf(percentage) + 1;
  const percentile = Math.round(((allAttempts.length - rank) / allAttempts.length) * 100);

  test.attempts.push({ user: req.user._id, score, total: totalMarks, percentage, rank, timeTaken, answers: answers.map((a, i) => ({ questionIndex: i, selected: a })) });
  await test.save();

  // Update user test history & XP
  const user = await User.findById(req.user._id);
  user.testAttempts.push({ test: test._id, score, total: totalMarks, percentage, rank });
  user.xp += Math.floor(percentage / 10) * 5;
  user.computeLevel();
  await user.save();

  // Section-wise breakdown
  const sections = {};
  results.forEach(r => {
    if (!sections[r.section]) sections[r.section] = { correct: 0, total: 0 };
    sections[r.section].total++;
    if (r.correct) sections[r.section].correct++;
  });

  res.json({ score, total: totalMarks, percentage, rank, percentile, timeTaken, results, sections });
});

const createTest = asyncHandler(async (req, res) => {
  const test = await Test.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(test);
});

const updateTest = asyncHandler(async (req, res) => {
  const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!test) { res.status(404); throw new Error('Test not found'); }
  res.json(test);
});

const deleteTest = asyncHandler(async (req, res) => {
  await Test.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'Test removed' });
});

const getTestLeaderboard = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id)
    .populate('attempts.user', 'name avatar college');
  if (!test) { res.status(404); throw new Error('Test not found'); }
  const board = test.attempts
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 20)
    .map((a, i) => ({ rank: i + 1, user: a.user, score: a.score, total: a.total, percentage: a.percentage, timeTaken: a.timeTaken, completedAt: a.completedAt }));
  res.json(board);
});

module.exports = { getTests, getTest, submitTest, createTest, updateTest, deleteTest, getTestLeaderboard };
