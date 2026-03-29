const Company = require('../models/Company');
const Problem = require('../models/Problem');

const getCompanyStats = async () => {
  const total = await Company.countDocuments();
  const byDifficulty = await Company.aggregate([
    { $group: { _id: '$difficulty', count: { $sum: 1 } } },
  ]);
  return { total, byDifficulty };
};

const linkProblemToCompany = async (companyId, problemId) => {
  const company = await Company.findById(companyId);
  if (!company) throw new Error('Company not found');
  if (!company.problems.includes(problemId)) {
    company.problems.push(problemId);
    await company.save();
  }
  return company;
};

module.exports = { getCompanyStats, linkProblemToCompany };
