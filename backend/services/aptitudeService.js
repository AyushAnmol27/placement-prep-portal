const AptitudeQuestion = require('../models/AptitudeQuestion');

const getAptitudeStats = async (userId) => {
  const total = await AptitudeQuestion.countDocuments();
  const solved = await AptitudeQuestion.countDocuments({ solvedBy: userId });

  const byCategory = await AptitudeQuestion.aggregate([
    { $group: { _id: '$category', total: { $sum: 1 } } },
  ]);

  const solvedByCategory = await AptitudeQuestion.aggregate([
    { $match: { solvedBy: userId } },
    { $group: { _id: '$category', solved: { $sum: 1 } } },
  ]);

  const categoryMap = {};
  byCategory.forEach(c => { categoryMap[c._id] = { total: c.total, solved: 0 }; });
  solvedByCategory.forEach(c => { if (categoryMap[c._id]) categoryMap[c._id].solved = c.solved; });

  return { total, solved, categories: categoryMap };
};

module.exports = { getAptitudeStats };
