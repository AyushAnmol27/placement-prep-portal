export const getStreakMessage = (streak) => {
  if (streak >= 30) return '🔥 Legendary streak!';
  if (streak >= 14) return '⚡ On fire!';
  if (streak >= 7) return '💪 Great momentum!';
  if (streak >= 3) return '🌱 Building habit!';
  return '🚀 Keep going!';
};
