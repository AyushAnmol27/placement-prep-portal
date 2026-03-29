require('dotenv').config({ path: '../backend/.env' });
const mongoose = require('mongoose');
const Problem = require('../backend/models/Problem');

const problems = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'Easy',
    tags: ['array', 'hash-table'],
    link: 'https://leetcode.com/problems/two-sum/',
    platform: 'LeetCode',
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    difficulty: 'Medium',
    tags: ['string', 'sliding-window', 'hash-table'],
    link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    platform: 'LeetCode',
  },
  {
    title: 'Median of Two Sorted Arrays',
    description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
    difficulty: 'Hard',
    tags: ['array', 'binary-search', 'divide-and-conquer'],
    link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
    platform: 'LeetCode',
  },
  {
    title: 'Valid Parentheses',
    description: 'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.',
    difficulty: 'Easy',
    tags: ['string', 'stack'],
    link: 'https://leetcode.com/problems/valid-parentheses/',
    platform: 'LeetCode',
  },
  {
    title: 'Merge Intervals',
    description: 'Given an array of intervals, merge all overlapping intervals and return an array of the non-overlapping intervals.',
    difficulty: 'Medium',
    tags: ['array', 'sorting'],
    link: 'https://leetcode.com/problems/merge-intervals/',
    platform: 'LeetCode',
  },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Problem.deleteMany({});
  await Problem.insertMany(problems);
  console.log(`Seeded ${problems.length} problems`);
  await mongoose.disconnect();
};

seed().catch(console.error);
