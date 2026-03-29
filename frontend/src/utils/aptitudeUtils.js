export const APTITUDE_CATEGORIES = ['Quantitative', 'Logical Reasoning', 'Verbal', 'Data Interpretation'];

export const getCategoryIcon = (category) => {
  const icons = {
    'Quantitative': '🔢',
    'Logical Reasoning': '🧠',
    'Verbal': '📖',
    'Data Interpretation': '📊',
  };
  return icons[category] || '📝';
};

export const getScoreColor = (percentage) => {
  if (percentage >= 80) return 'var(--success)';
  if (percentage >= 60) return 'var(--warning)';
  return 'var(--danger)';
};

export const getScoreMessage = (percentage) => {
  if (percentage >= 80) return '🎉 Excellent!';
  if (percentage >= 60) return '👍 Good job!';
  return '📚 Keep practicing!';
};
