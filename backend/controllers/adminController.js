const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Problem = require('../models/Problem');
const Test = require('../models/Test');
const AptitudeQuestion = require('../models/AptitudeQuestion');
const Company = require('../models/Company');
const Blog = require('../models/Blog');

const getUsers = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
  const total = await User.countDocuments(filter);
  const users = await User.find(filter).select('-password').skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
  res.json({ users, total });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json(user);
});

const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'User deactivated' });
});

const getOverview = asyncHandler(async (req, res) => {
  const [users, problems, tests, aptitude, companies, blogs] = await Promise.all([
    User.countDocuments(),
    Problem.countDocuments({ isActive: true }),
    Test.countDocuments({ isActive: true }),
    AptitudeQuestion.countDocuments({ isActive: true }),
    Company.countDocuments({ isActive: true }),
    Blog.countDocuments({ published: true }),
  ]);
  const recentUsers = await User.find().select('name email role createdAt').sort({ createdAt: -1 }).limit(5);
  res.json({ users, problems, tests, aptitude, companies, blogs, recentUsers });
});

module.exports = { getUsers, updateUser, deleteUser, getOverview };
