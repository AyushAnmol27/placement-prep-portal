const asyncHandler = require('express-async-handler');
const Company = require('../models/Company');

const getCompanies = asyncHandler(async (req, res) => {
  const { search, difficulty, tag } = req.query;
  const filter = { isActive: true };
  if (difficulty) filter.difficulty = difficulty;
  if (tag) filter.tags = tag;
  if (search) filter.name = { $regex: search, $options: 'i' };
  const companies = await Company.find(filter).select('-interviewExperiences').sort({ name: 1 });
  res.json(companies);
});

const getCompany = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }], isActive: true })
    .populate('problems', 'title difficulty tags link platform')
    .populate('tests', 'title category duration');
  if (!company) { res.status(404); throw new Error('Company not found'); }
  res.json(company);
});

const createCompany = asyncHandler(async (req, res) => {
  const company = await Company.create(req.body);
  res.status(201).json(company);
});

const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!company) { res.status(404); throw new Error('Company not found'); }
  res.json(company);
});

const addInterviewExperience = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) { res.status(404); throw new Error('Company not found'); }
  company.interviewExperiences.push({ ...req.body, author: req.user._id, authorName: req.user.name });
  await company.save();
  res.status(201).json(company.interviewExperiences.slice(-1)[0]);
});

const likeExperience = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  const exp = company.interviewExperiences.id(req.params.expId);
  if (!exp) { res.status(404); throw new Error('Experience not found'); }
  const idx = exp.likes.indexOf(req.user._id);
  if (idx === -1) exp.likes.push(req.user._id);
  else exp.likes.splice(idx, 1);
  await company.save();
  res.json({ likes: exp.likes.length });
});

module.exports = { getCompanies, getCompany, createCompany, updateCompany, addInterviewExperience, likeExperience };
