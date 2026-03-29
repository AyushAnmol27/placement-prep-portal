const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('./generateToken' in require.cache ? '../generateToken' : '../generateToken');

const _generateToken = require('../generateToken');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, college, graduationYear } = req.body;
  if (await User.findOne({ email })) { res.status(400); throw new Error('User already exists'); }
  const user = await User.create({ name, email, password, college, graduationYear });
  res.status(201).json(buildUserResponse(user));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) { res.status(401); throw new Error('Invalid email or password'); }
  res.json(buildUserResponse(user));
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('solvedProblems', 'title difficulty tags')
    .populate('bookmarkedProblems', 'title difficulty');
  res.json(user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, bio, college, graduationYear, skills, password } = req.body;
  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (college !== undefined) user.college = college;
  if (graduationYear !== undefined) user.graduationYear = graduationYear;
  if (skills !== undefined) user.skills = skills;
  if (password) user.password = password;
  const updated = await user.save();
  res.json(buildUserResponse(updated));
});

const getLeaderboard = asyncHandler(async (req, res) => {
  const users = await User.find({ isActive: true })
    .select('name avatar xp level streak solvedProblems college')
    .sort({ xp: -1 })
    .limit(50);
  const board = users.map((u, i) => ({
    rank: i + 1,
    _id: u._id,
    name: u.name,
    avatar: u.avatar,
    xp: u.xp,
    level: u.level,
    streak: u.streak,
    solved: u.solvedProblems.length,
    college: u.college,
  }));
  res.json(board);
});

function buildUserResponse(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    bio: user.bio,
    college: user.college,
    streak: user.streak,
    maxStreak: user.maxStreak,
    xp: user.xp,
    level: user.level,
    badges: user.badges,
    token: _generateToken(user._id),
  };
}

module.exports = { register, login, getProfile, updateProfile, getLeaderboard };
