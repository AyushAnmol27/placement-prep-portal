require('dotenv').config({ path: '../backend/.env' });
const mongoose = require('mongoose');
const Company = require('../backend/models/Company');

const companies = [
  {
    name: 'Google',
    description: 'Google LLC is an American multinational technology company focusing on search engine technology, online advertising, and cloud computing.',
    industry: 'Technology',
    difficulty: 'Hard',
    tags: ['FAANG', 'product', 'tech'],
    interviewProcess: '4-5 rounds: Phone screen → Technical rounds (DSA, System Design) → Behavioral round → Team match',
    avgPackage: '$180,000+',
    roles: ['Software Engineer', 'SRE', 'Data Engineer', 'ML Engineer'],
  },
  {
    name: 'Amazon',
    description: 'Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, and AI.',
    industry: 'Technology / E-commerce',
    difficulty: 'Hard',
    tags: ['FAANG', 'product', 'cloud'],
    interviewProcess: '4-6 rounds: Online Assessment → Phone screen → Virtual onsite (LP + DSA + System Design)',
    avgPackage: '$160,000+',
    roles: ['SDE', 'SDE II', 'Cloud Support Engineer', 'Data Scientist'],
  },
  {
    name: 'Microsoft',
    description: 'Microsoft Corporation is an American multinational technology corporation producing computer software, consumer electronics, and cloud services.',
    industry: 'Technology',
    difficulty: 'Medium',
    tags: ['FAANG', 'product', 'cloud'],
    interviewProcess: '4-5 rounds: Recruiter screen → Technical phone screen → Onsite (DSA + Design + Behavioral)',
    avgPackage: '$150,000+',
    roles: ['SWE', 'PM', 'Data Scientist', 'Cloud Engineer'],
  },
  {
    name: 'Infosys',
    description: 'Infosys Limited is an Indian multinational information technology company that provides business consulting, IT and outsourcing services.',
    industry: 'IT Services',
    difficulty: 'Easy',
    tags: ['service', 'india', 'entry-level'],
    interviewProcess: '3 rounds: Online test (Aptitude + Coding) → Technical interview → HR interview',
    avgPackage: '₹3.6 - 8 LPA',
    roles: ['Systems Engineer', 'Technology Analyst', 'Associate Consultant'],
  },
  {
    name: 'Flipkart',
    description: 'Flipkart is an Indian e-commerce company headquartered in Bangalore, Karnataka, India.',
    industry: 'E-commerce',
    difficulty: 'Medium',
    tags: ['product', 'india', 'e-commerce'],
    interviewProcess: '4-5 rounds: Online coding test → Technical rounds (DSA + System Design) → Hiring Manager round',
    avgPackage: '₹20 - 40 LPA',
    roles: ['SDE', 'SDE II', 'Data Engineer', 'ML Engineer'],
  },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Company.deleteMany({});
  await Company.insertMany(companies);
  console.log(`Seeded ${companies.length} companies`);
  await mongoose.disconnect();
};

seed().catch(console.error);
