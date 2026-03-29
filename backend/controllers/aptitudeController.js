const asyncHandler = require('express-async-handler');
const AptitudeQuestion = require('../models/AptitudeQuestion');
const User = require('../models/User');

const getQuestions = asyncHandler(async (req, res) => {
  const { category, topic, difficulty, company, page = 1, limit = 20 } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (topic) filter.topic = topic;
  if (difficulty) filter.difficulty = difficulty;
  if (company) filter.companies = company;

  const total = await AptitudeQuestion.countDocuments(filter);
  const questions = await AptitudeQuestion.find(filter)
    .select('-correctAnswer -explanation')
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  let solvedSet = new Set();
  if (req.user) {
    const user = await User.findById(req.user._id).select('aptitudeSolved');
    solvedSet = new Set(user.aptitudeSolved.map(id => id.toString()));
  }

  const enriched = questions.map(q => ({ ...q.toObject(), isSolved: solvedSet.has(q._id.toString()) }));
  res.json({ questions: enriched, total, page: Number(page), pages: Math.ceil(total / limit) });
});

const getTopics = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  const topics = await AptitudeQuestion.distinct('topic', filter);
  res.json(topics.filter(Boolean));
});

const getQuestion = asyncHandler(async (req, res) => {
  const question = await AptitudeQuestion.findById(req.params.id).select('-correctAnswer');
  if (!question) { res.status(404); throw new Error('Question not found'); }
  res.json(question);
});

const submitAnswer = asyncHandler(async (req, res) => {
  const question = await AptitudeQuestion.findById(req.params.id);
  if (!question) { res.status(404); throw new Error('Question not found'); }

  const { answer } = req.body;
  const correct = answer === question.correctAnswer;

  if (correct) {
    const user = await User.findById(req.user._id);
    if (!user.aptitudeSolved.includes(question._id)) {
      user.aptitudeSolved.push(question._id);
      user.xp += 10;
      user.computeLevel();
      await user.save();
    }
    if (!question.solvedBy.includes(req.user._id)) {
      question.solvedBy.push(req.user._id);
      await question.save();
    }
  }

  res.json({ correct, correctAnswer: question.correctAnswer, explanation: question.explanation });
});

const createQuestion = asyncHandler(async (req, res) => {
  const question = await AptitudeQuestion.create(req.body);
  res.status(201).json(question);
});

const updateQuestion = asyncHandler(async (req, res) => {
  const question = await AptitudeQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!question) { res.status(404); throw new Error('Question not found'); }
  res.json(question);
});

const deleteQuestion = asyncHandler(async (req, res) => {
  await AptitudeQuestion.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'Question removed' });
});

const getTopicStats = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('aptitudeSolved');
  const solvedIds = user.aptitudeSolved.map(id => id.toString());

  const stats = await AptitudeQuestion.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: { category: '$category', topic: '$topic' }, total: { $sum: 1 }, ids: { $push: '$_id' } } },
  ]);

  const result = stats.map(s => ({
    category: s._id.category,
    topic: s._id.topic,
    total: s.total,
    solved: s.ids.filter(id => solvedIds.includes(id.toString())).length,
  }));

  res.json(result);
});

module.exports = { getQuestions, getTopics, getQuestion, submitAnswer, createQuestion, updateQuestion, deleteQuestion, getTopicStats };
