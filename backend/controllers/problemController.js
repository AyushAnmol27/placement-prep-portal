const asyncHandler = require('express-async-handler');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const User = require('../models/User');
const { markProblemSolved } = require('../services/problemService');
const { submitCode } = require('../config/judge0');

const getProblems = asyncHandler(async (req, res) => {
  const { difficulty, tag, company, search, page = 1, limit = 20, status } = req.query;
  const filter = { isActive: true };
  if (difficulty) filter.difficulty = difficulty;
  if (tag) filter.tags = tag;
  if (company) filter.companies = company;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const total = await Problem.countDocuments(filter);
  const problems = await Problem.find(filter)
    .select('-testCases -editorial -starterCode')
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  // Attach solved status for current user
  let solvedSet = new Set();
  let bookmarkedSet = new Set();
  if (req.user) {
    const user = await User.findById(req.user._id).select('solvedProblems bookmarkedProblems');
    solvedSet = new Set(user.solvedProblems.map(id => id.toString()));
    bookmarkedSet = new Set(user.bookmarkedProblems.map(id => id.toString()));
  }

  const enriched = problems.map(p => ({
    ...p.toObject(),
    isSolved: solvedSet.has(p._id.toString()),
    isBookmarked: bookmarkedSet.has(p._id.toString()),
    acceptanceRate: p.totalSubmissions ? Math.round((p.acceptedSubmissions / p.totalSubmissions) * 100) : 0,
  }));

  res.json({ problems: enriched, total, page: Number(page), pages: Math.ceil(total / limit) });
});

const getProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }], isActive: true });
  if (!problem) { res.status(404); throw new Error('Problem not found'); }
  // Hide hidden test cases
  const p = problem.toObject();
  p.testCases = p.testCases.filter(tc => !tc.isHidden);
  res.json(p);
});

const createProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(problem);
});

const updateProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!problem) { res.status(404); throw new Error('Problem not found'); }
  res.json(problem);
});

const deleteProblem = asyncHandler(async (req, res) => {
  await Problem.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'Problem removed' });
});

const solveProblem = asyncHandler(async (req, res) => {
  const result = await markProblemSolved(req.user._id, req.params.id);
  res.json(result);
});

const toggleBookmark = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const pid = req.params.id;
  const idx = user.bookmarkedProblems.indexOf(pid);
  if (idx === -1) user.bookmarkedProblems.push(pid);
  else user.bookmarkedProblems.splice(idx, 1);
  await user.save();
  res.json({ bookmarked: idx === -1 });
});

const runCode = asyncHandler(async (req, res) => {
  const { source_code, language, stdin } = req.body;
  if (!source_code || !language) { res.status(400); throw new Error('source_code and language are required'); }
  const result = await submitCode(source_code, language, stdin);
  res.json(result);
});

const submitSolution = asyncHandler(async (req, res) => {
  const { source_code, language } = req.body;
  const problem = await Problem.findById(req.params.id);
  if (!problem) { res.status(404); throw new Error('Problem not found'); }

  problem.totalSubmissions += 1;

  let passed = 0;
  const visibleCases = problem.testCases.slice(0, 3);

  for (const tc of visibleCases) {
    const result = await submitCode(source_code, language, tc.input);
    const actual = (result.stdout || '').trim();
    const expected = tc.expectedOutput.trim();
    if (actual === expected) passed++;
  }

  const allPassed = passed === visibleCases.length;
  const status = allPassed ? 'Accepted' : 'Wrong Answer';

  if (allPassed) {
    problem.acceptedSubmissions += 1;
    await markProblemSolved(req.user._id, req.params.id);
  }
  await problem.save();

  const submission = await Submission.create({
    user: req.user._id,
    problem: problem._id,
    language,
    code: source_code,
    status,
    testCasesPassed: passed,
    totalTestCases: visibleCases.length,
  });

  res.json({ status, testCasesPassed: passed, totalTestCases: visibleCases.length, submissionId: submission._id });
});

const getSubmissions = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };
  if (req.params.id) filter.problem = req.params.id;
  const submissions = await Submission.find(filter)
    .populate('problem', 'title difficulty')
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(submissions);
});

module.exports = { getProblems, getProblem, createProblem, updateProblem, deleteProblem, solveProblem, toggleBookmark, runCode, submitSolution, getSubmissions };
