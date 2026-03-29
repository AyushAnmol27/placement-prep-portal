const asyncHandler = require('express-async-handler');
const Roadmap = require('../models/Roadmap');

const ROADMAP_TEMPLATES = {
  Beginner: [
    { week: 1, title: 'Foundations', topics: ['Arrays', 'Strings', 'Basic Math'], resources: ['GeeksForGeeks Arrays', 'LeetCode Easy Problems'], problems: ['Two Sum', 'Reverse String', 'FizzBuzz'] },
    { week: 2, title: 'Data Structures I', topics: ['Linked Lists', 'Stacks', 'Queues'], resources: ['Visualgo.net', 'CS50 Data Structures'], problems: ['Reverse Linked List', 'Valid Parentheses', 'Implement Queue'] },
    { week: 3, title: 'Aptitude Basics', topics: ['Percentages', 'Ratios', 'Time & Work'], resources: ['IndiaBix Quantitative', 'PrepInsta Aptitude'], problems: ['Percentage Problems', 'Ratio Problems'] },
    { week: 4, title: 'Sorting & Searching', topics: ['Binary Search', 'Merge Sort', 'Quick Sort'], resources: ['Sorting Visualizer', 'CLRS Chapter 2'], problems: ['Binary Search', 'Search in Rotated Array'] },
    { week: 5, title: 'Logical Reasoning', topics: ['Blood Relations', 'Seating Arrangement', 'Syllogisms'], resources: ['RS Aggarwal Logical', 'IndiaBix Reasoning'], problems: ['Blood Relation Problems', 'Seating Arrangement'] },
    { week: 6, title: 'Mock Test Week', topics: ['Full Length Test', 'Review Weak Areas'], resources: ['Previous Year Papers'], problems: ['Company Mock Test'] },
  ],
  Intermediate: [
    { week: 1, title: 'Advanced DSA', topics: ['Trees', 'Graphs', 'Heaps'], resources: ['NeetCode.io', 'Striver A-Z DSA'], problems: ['Binary Tree Level Order', 'Number of Islands'] },
    { week: 2, title: 'Dynamic Programming', topics: ['Memoization', 'Tabulation', 'Classic DP'], resources: ['DP Patterns', 'Aditya Verma DP Playlist'], problems: ['Climbing Stairs', 'Longest Common Subsequence'] },
    { week: 3, title: 'System Design Basics', topics: ['Scalability', 'Databases', 'Caching'], resources: ['System Design Primer', 'Grokking System Design'], problems: ['Design URL Shortener', 'Design LRU Cache'] },
    { week: 4, title: 'CS Fundamentals', topics: ['OS', 'DBMS', 'Networks', 'OOP'], resources: ['Gate Smashers', 'Neso Academy'], problems: ['OS Interview Questions', 'SQL Queries'] },
    { week: 5, title: 'Company Prep', topics: ['Company Patterns', 'HR Questions', 'Resume'], resources: ['Glassdoor Reviews', 'AmbitionBox'], problems: ['Company Specific Problems'] },
    { week: 6, title: 'Mock Tests & Review', topics: ['Full Mock Tests', 'Weak Area Focus'], resources: ['Previous Year Papers'], problems: ['Full Length Mock Test'] },
  ],
  Advanced: [
    { week: 1, title: 'Hard DSA Problems', topics: ['Advanced Graphs', 'Segment Trees', 'Tries'], resources: ['Codeforces', 'AtCoder'], problems: ['Hard LeetCode Problems'] },
    { week: 2, title: 'System Design Deep Dive', topics: ['Distributed Systems', 'Microservices', 'CAP Theorem'], resources: ['DDIA Book', 'Martin Fowler Blog'], problems: ['Design Twitter', 'Design Netflix'] },
    { week: 3, title: 'Competitive Programming', topics: ['Graph Algorithms', 'Number Theory', 'Bit Manipulation'], resources: ['CP-Algorithms', 'USACO Guide'], problems: ['Codeforces Div 2 Problems'] },
    { week: 4, title: 'Behavioral & Leadership', topics: ['STAR Method', 'Leadership Principles', 'Case Studies'], resources: ['Amazon LP Guide', 'Cracking PM Interview'], problems: ['Mock Behavioral Interviews'] },
    { week: 5, title: 'Final Company Prep', topics: ['Target Company Deep Dive', 'Mock Interviews'], resources: ['Interviewing.io', 'Pramp'], problems: ['Company Specific Hard Problems'] },
    { week: 6, title: 'Interview Simulation', topics: ['Full Mock Interviews', 'Feedback & Iteration'], resources: ['Peer Mock Interviews'], problems: ['Random Hard Problems'] },
  ],
};

const generateRoadmap = asyncHandler(async (req, res) => {
  const { targetCompany, targetRole, targetDate, currentLevel } = req.body;
  const level = currentLevel || 'Beginner';
  const template = ROADMAP_TEMPLATES[level] || ROADMAP_TEMPLATES.Beginner;

  const existing = await Roadmap.findOne({ user: req.user._id, isActive: true });
  if (existing) { existing.isActive = false; await existing.save(); }

  const roadmap = await Roadmap.create({
    user: req.user._id,
    title: `${level} Roadmap${targetCompany ? ` for ${targetCompany}` : ''}`,
    targetCompany,
    targetRole,
    targetDate,
    currentLevel: level,
    weeks: template,
  });

  res.status(201).json(roadmap);
});

const getRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findOne({ user: req.user._id, isActive: true });
  if (!roadmap) { res.status(404); throw new Error('No active roadmap found'); }
  res.json(roadmap);
});

const updateWeek = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findOne({ user: req.user._id, isActive: true });
  if (!roadmap) { res.status(404); throw new Error('Roadmap not found'); }
  const week = roadmap.weeks.find(w => w.week === Number(req.params.week));
  if (!week) { res.status(404); throw new Error('Week not found'); }
  week.completed = req.body.completed;
  roadmap.progress = Math.round((roadmap.weeks.filter(w => w.completed).length / roadmap.weeks.length) * 100);
  await roadmap.save();
  res.json(roadmap);
});

module.exports = { generateRoadmap, getRoadmap, updateWeek };
