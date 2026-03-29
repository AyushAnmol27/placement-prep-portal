require('dotenv').config({ path: '../backend/.env' });
const mongoose = require('mongoose');
const AptitudeQuestion = require('../backend/models/AptitudeQuestion');

const questions = [
  {
    question: 'A train travels 60 km in 1 hour. How long will it take to travel 180 km?',
    options: ['2 hours', '3 hours', '4 hours', '5 hours'],
    correctAnswer: 1,
    explanation: 'Speed = 60 km/h. Time = 180/60 = 3 hours.',
    category: 'Quantitative',
    difficulty: 'Easy',
    tags: ['speed', 'time', 'distance'],
  },
  {
    question: 'If 5 workers can complete a job in 10 days, how many days will 10 workers take?',
    options: ['3 days', '4 days', '5 days', '6 days'],
    correctAnswer: 2,
    explanation: 'Work = 5 × 10 = 50 worker-days. 10 workers → 50/10 = 5 days.',
    category: 'Quantitative',
    difficulty: 'Easy',
    tags: ['work', 'time'],
  },
  {
    question: 'All roses are flowers. Some flowers fade quickly. Therefore:',
    options: [
      'All roses fade quickly',
      'Some roses may fade quickly',
      'No roses fade quickly',
      'All flowers are roses',
    ],
    correctAnswer: 1,
    explanation: 'Since only some flowers fade quickly, some roses may or may not fade quickly.',
    category: 'Logical Reasoning',
    difficulty: 'Medium',
    tags: ['syllogism'],
  },
  {
    question: 'Choose the word most similar in meaning to "BENEVOLENT":',
    options: ['Cruel', 'Kind', 'Angry', 'Lazy'],
    correctAnswer: 1,
    explanation: 'Benevolent means well-meaning and kindly.',
    category: 'Verbal',
    difficulty: 'Easy',
    tags: ['vocabulary', 'synonyms'],
  },
  {
    question: 'A pie chart shows sales: Electronics 40%, Clothing 30%, Food 20%, Others 10%. If total sales = $500,000, what are Electronics sales?',
    options: ['$150,000', '$175,000', '$200,000', '$250,000'],
    correctAnswer: 2,
    explanation: '40% of $500,000 = $200,000.',
    category: 'Data Interpretation',
    difficulty: 'Easy',
    tags: ['pie chart', 'percentage'],
  },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await AptitudeQuestion.deleteMany({});
  await AptitudeQuestion.insertMany(questions);
  console.log(`Seeded ${questions.length} aptitude questions`);
  await mongoose.disconnect();
};

seed().catch(console.error);
