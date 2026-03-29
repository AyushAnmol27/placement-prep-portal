const calculateStreak = (lastActiveDate, currentStreak) => {
  if (!lastActiveDate) return 1;

  const today = new Date();
  const last = new Date(lastActiveDate);
  today.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return currentStreak;
  if (diffDays === 1) return currentStreak + 1;
  return 1;
};

module.exports = calculateStreak;
