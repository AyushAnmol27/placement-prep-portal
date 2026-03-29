const calculateScore = (answers, questions) => {
  let score = 0;
  const results = questions.map((q, i) => {
    const correct = answers[i] === q.correctAnswer;
    if (correct) score++;
    return {
      question: q.question,
      selected: answers[i],
      correct,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    };
  });
  return { score, total: questions.length, percentage: Math.round((score / questions.length) * 100), results };
};

module.exports = calculateScore;
