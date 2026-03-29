import { useState, useEffect } from 'react';

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', icon: '🟨' },
  { id: 'python', label: 'Python', icon: '🐍' },
  { id: 'java', label: 'Java', icon: '☕' },
  { id: 'cpp', label: 'C++', icon: '⚡' },
  { id: 'c', label: 'C', icon: '🔵' },
  { id: 'typescript', label: 'TypeScript', icon: '💙' },
  { id: 'go', label: 'Go', icon: '🐹' },
  { id: 'rust', label: 'Rust', icon: '🦀' },
  { id: 'kotlin', label: 'Kotlin', icon: '🎯' },
  { id: 'swift', label: 'Swift', icon: '🍎' },
  { id: 'ruby', label: 'Ruby', icon: '💎' },
  { id: 'scala', label: 'Scala', icon: '📐' },
];

const STARTER_CODE = {
  javascript: (fn) => `// JavaScript Solution\nfunction ${fn}(/* params */) {\n    // Write your solution here\n    \n}\n\nconsole.log(${fn}());`,
  python: (fn) => `# Python Solution\ndef ${fn}(# params):\n    # Write your solution here\n    pass\n\nprint(${fn}())`,
  java: (fn) => `// Java Solution\npublic class Solution {\n    public static Object ${fn}(/* params */) {\n        // Write your solution here\n        return null;\n    }\n    \n    public static void main(String[] args) {\n        System.out.println(${fn}());\n    }\n}`,
  cpp: (fn) => `// C++ Solution\n#include <bits/stdc++.h>\nusing namespace std;\n\nauto ${fn}(/* params */) {\n    // Write your solution here\n    \n}\n\nint main() {\n    cout << ${fn}() << endl;\n    return 0;\n}`,
  c: (fn) => `// C Solution\n#include <stdio.h>\n\nvoid ${fn}(/* params */) {\n    // Write your solution here\n    \n}\n\nint main() {\n    ${fn}();\n    return 0;\n}`,
  typescript: (fn) => `// TypeScript Solution\nfunction ${fn}(/* params */): any {\n    // Write your solution here\n    \n}\n\nconsole.log(${fn}());`,
  go: (fn) => `// Go Solution\npackage main\n\nimport "fmt"\n\nfunc ${fn}(/* params */) interface{} {\n    // Write your solution here\n    return nil\n}\n\nfunc main() {\n    fmt.Println(${fn}())\n}`,
  rust: (fn) => `// Rust Solution\nfn ${fn}(/* params */) {\n    // Write your solution here\n    \n}\n\nfn main() {\n    ${fn}();\n}`,
  kotlin: (fn) => `// Kotlin Solution\nfun ${fn}(/* params */): Any? {\n    // Write your solution here\n    return null\n}\n\nfun main() {\n    println(${fn}())\n}`,
  swift: (fn) => `// Swift Solution\nfunc ${fn}(/* params */) -> Any? {\n    // Write your solution here\n    return nil\n}\n\nprint(${fn}() ?? "")`,
  ruby: (fn) => `# Ruby Solution\ndef ${fn}(# params)\n    # Write your solution here\nend\n\nputs ${fn}`,
  scala: (fn) => `// Scala Solution\nobject Solution {\n    def ${fn}(/* params */): Any = {\n        // Write your solution here\n        null\n    }\n    def main(args: Array[String]): Unit = {\n        println(${fn}())\n    }\n}`,
};

const DSA_PROBLEMS = [
  // Arrays & Strings
  { id: 1, title: 'Two Sum', difficulty: 'Easy', category: 'Arrays', tags: ['Array', 'Hash Map'], fn: 'twoSum', description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.' },
  { id: 2, title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', category: 'Arrays', tags: ['Array', 'Dynamic Programming'], fn: 'maxProfit', description: 'Find the maximum profit from buying and selling a stock once. You cannot sell before you buy.' },
  { id: 3, title: 'Contains Duplicate', difficulty: 'Easy', category: 'Arrays', tags: ['Array', 'Hash Set'], fn: 'containsDuplicate', description: 'Given an integer array nums, return true if any value appears at least twice in the array.' },
  { id: 4, title: 'Product of Array Except Self', difficulty: 'Medium', category: 'Arrays', tags: ['Array', 'Prefix Product'], fn: 'productExceptSelf', description: 'Given an array, return an array where each element is the product of all elements except itself.' },
  { id: 5, title: 'Maximum Subarray', difficulty: 'Medium', category: 'Arrays', tags: ['Array', 'Kadane\'s Algorithm'], fn: 'maxSubArray', description: 'Find the contiguous subarray with the largest sum using Kadane\'s Algorithm.' },
  { id: 6, title: 'Maximum Product Subarray', difficulty: 'Medium', category: 'Arrays', tags: ['Array', 'Dynamic Programming'], fn: 'maxProduct', description: 'Find the contiguous subarray within an array which has the largest product.' },
  { id: 7, title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', category: 'Arrays', tags: ['Array', 'Binary Search'], fn: 'findMin', description: 'Find the minimum element of a rotated sorted array in O(log n) time.' },
  { id: 8, title: 'Search in Rotated Sorted Array', difficulty: 'Medium', category: 'Arrays', tags: ['Array', 'Binary Search'], fn: 'search', description: 'Search for a target value in a rotated sorted array in O(log n) time.' },
  { id: 9, title: '3Sum', difficulty: 'Medium', category: 'Arrays', tags: ['Array', 'Two Pointers'], fn: 'threeSum', description: 'Find all unique triplets in the array that sum to zero.' },
  { id: 10, title: 'Container With Most Water', difficulty: 'Medium', category: 'Arrays', tags: ['Array', 'Two Pointers'], fn: 'maxArea', description: 'Find two lines that together with the x-axis forms a container that holds the most water.' },
  // Strings
  { id: 11, title: 'Valid Anagram', difficulty: 'Easy', category: 'Strings', tags: ['String', 'Hash Map'], fn: 'isAnagram', description: 'Given two strings s and t, return true if t is an anagram of s.' },
  { id: 12, title: 'Valid Palindrome', difficulty: 'Easy', category: 'Strings', tags: ['String', 'Two Pointers'], fn: 'isPalindrome', description: 'Check if a phrase is a palindrome considering only alphanumeric characters and ignoring case.' },
  { id: 13, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', category: 'Strings', tags: ['String', 'Sliding Window'], fn: 'lengthOfLongestSubstring', description: 'Find the length of the longest substring without repeating characters.' },
  { id: 14, title: 'Longest Repeating Character Replacement', difficulty: 'Medium', category: 'Strings', tags: ['String', 'Sliding Window'], fn: 'characterReplacement', description: 'Find the length of the longest substring with same letters after at most k replacements.' },
  { id: 15, title: 'Minimum Window Substring', difficulty: 'Hard', category: 'Strings', tags: ['String', 'Sliding Window'], fn: 'minWindow', description: 'Find the minimum window in s which will contain all characters in t.' },
  { id: 16, title: 'Valid Parentheses', difficulty: 'Easy', category: 'Strings', tags: ['String', 'Stack'], fn: 'isValid', description: 'Determine if the input string of brackets is valid and properly matched.' },
  { id: 17, title: 'Group Anagrams', difficulty: 'Medium', category: 'Strings', tags: ['String', 'Hash Map'], fn: 'groupAnagrams', description: 'Group an array of strings into groups of anagrams.' },
  { id: 18, title: 'Encode and Decode Strings', difficulty: 'Medium', category: 'Strings', tags: ['String', 'Design'], fn: 'encode', description: 'Design an algorithm to encode/decode a list of strings to/from a single string.' },
  { id: 19, title: 'Longest Palindromic Substring', difficulty: 'Medium', category: 'Strings', tags: ['String', 'Dynamic Programming'], fn: 'longestPalindrome', description: 'Given a string s, return the longest palindromic substring.' },
  { id: 20, title: 'Palindromic Substrings', difficulty: 'Medium', category: 'Strings', tags: ['String', 'Dynamic Programming'], fn: 'countSubstrings', description: 'Count the number of palindromic substrings in a given string.' },
  // Linked Lists
  { id: 21, title: 'Reverse a Linked List', difficulty: 'Easy', category: 'Linked List', tags: ['Linked List', 'Recursion'], fn: 'reverseList', description: 'Reverse a singly linked list iteratively and recursively.' },
  { id: 22, title: 'Detect Cycle in Linked List', difficulty: 'Easy', category: 'Linked List', tags: ['Linked List', 'Floyd\'s Algorithm'], fn: 'hasCycle', description: 'Given head, determine if the linked list has a cycle using Floyd\'s algorithm.' },
  { id: 23, title: 'Merge Two Sorted Lists', difficulty: 'Easy', category: 'Linked List', tags: ['Linked List', 'Merge'], fn: 'mergeTwoLists', description: 'Merge two sorted linked lists and return it as a sorted list.' },
  { id: 24, title: 'Merge K Sorted Lists', difficulty: 'Hard', category: 'Linked List', tags: ['Linked List', 'Priority Queue'], fn: 'mergeKLists', description: 'Merge k sorted linked lists and return it as one sorted list.' },
  { id: 25, title: 'Remove Nth Node From End of List', difficulty: 'Medium', category: 'Linked List', tags: ['Linked List', 'Two Pointers'], fn: 'removeNthFromEnd', description: 'Remove the nth node from the end of the list and return its head.' },
  { id: 26, title: 'Reorder List', difficulty: 'Medium', category: 'Linked List', tags: ['Linked List', 'Two Pointers'], fn: 'reorderList', description: 'Reorder a linked list to L0→Ln→L1→Ln-1→L2→Ln-2→…' },
  { id: 27, title: 'Find the Duplicate Number', difficulty: 'Medium', category: 'Linked List', tags: ['Array', 'Floyd\'s Algorithm'], fn: 'findDuplicate', description: 'Find the duplicate number in an array using Floyd\'s cycle detection.' },
  { id: 28, title: 'LRU Cache', difficulty: 'Medium', category: 'Linked List', tags: ['Design', 'Hash Map', 'Doubly Linked List'], fn: 'LRUCache', description: 'Design a data structure that follows the constraints of a Least Recently Used cache.' },
  { id: 29, title: 'Flatten a Multilevel Doubly Linked List', difficulty: 'Medium', category: 'Linked List', tags: ['Linked List', 'Depth-First Search'], fn: 'flatten', description: 'Flatten a multilevel doubly linked list into a single-level sorted doubly linked list.' },
  { id: 30, title: 'Copy List with Random Pointer', difficulty: 'Medium', category: 'Linked List', tags: ['Linked List', 'Hash Map'], fn: 'copyRandomList', description: 'Deep copy a linked list where each node has a random pointer.' },
  // Trees
  { id: 31, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', category: 'Trees', tags: ['Tree', 'DFS', 'BFS'], fn: 'maxDepth', description: 'Find the maximum depth of a binary tree.' },
  { id: 32, title: 'Same Tree', difficulty: 'Easy', category: 'Trees', tags: ['Tree', 'DFS'], fn: 'isSameTree', description: 'Check whether two binary trees are structurally identical with same values.' },
  { id: 33, title: 'Invert Binary Tree', difficulty: 'Easy', category: 'Trees', tags: ['Tree', 'DFS', 'BFS'], fn: 'invertTree', description: 'Invert a binary tree (mirror it).' },
  { id: 34, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', category: 'Trees', tags: ['Tree', 'BFS'], fn: 'levelOrder', description: 'Return the level order traversal of a binary tree\'s node values.' },
  { id: 35, title: 'Validate Binary Search Tree', difficulty: 'Medium', category: 'Trees', tags: ['Tree', 'DFS', 'BST'], fn: 'isValidBST', description: 'Determine if a binary tree is a valid binary search tree.' },
  { id: 36, title: 'Kth Smallest Element in a BST', difficulty: 'Medium', category: 'Trees', tags: ['Tree', 'In-order', 'BST'], fn: 'kthSmallest', description: 'Find the kth smallest element in a BST using in-order traversal.' },
  { id: 37, title: 'Lowest Common Ancestor of a BST', difficulty: 'Medium', category: 'Trees', tags: ['Tree', 'BST', 'Recursion'], fn: 'lowestCommonAncestor', description: 'Find the lowest common ancestor of two nodes in a BST.' },
  { id: 38, title: 'Construct Binary Tree from Preorder and Inorder Traversal', difficulty: 'Medium', category: 'Trees', tags: ['Tree', 'Array', 'Divide Conquer'], fn: 'buildTree', description: 'Construct a binary tree from preorder and inorder traversal.' },
  { id: 39, title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', category: 'Trees', tags: ['Tree', 'DFS', 'Dynamic Programming'], fn: 'maxPathSum', description: 'Find the maximum path sum in a binary tree (path can start and end at any node).' },
  { id: 40, title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', category: 'Trees', tags: ['Tree', 'BFS', 'Design'], fn: 'serialize', description: 'Design an algorithm to serialize and deserialize a binary tree.' },
  // Dynamic Programming
  { id: 41, title: 'Climbing Stairs', difficulty: 'Easy', category: 'Dynamic Programming', tags: ['Dynamic Programming', 'Math'], fn: 'climbStairs', description: 'Count the number of distinct ways to climb n stairs taking 1 or 2 steps at a time.' },
  { id: 42, title: 'Coin Change', difficulty: 'Medium', category: 'Dynamic Programming', tags: ['Dynamic Programming', 'BFS'], fn: 'coinChange', description: 'Find the fewest number of coins needed to make up a given amount.' },
  { id: 43, title: 'Longest Increasing Subsequence', difficulty: 'Medium', category: 'Dynamic Programming', tags: ['Dynamic Programming', 'Binary Search'], fn: 'lengthOfLIS', description: 'Find the length of the longest strictly increasing subsequence.' },
  { id: 44, title: 'Longest Common Subsequence', difficulty: 'Medium', category: 'Dynamic Programming', tags: ['Dynamic Programming', 'String'], fn: 'longestCommonSubsequence', description: 'Find the length of the longest common subsequence of two strings.' },
  { id: 45, title: 'Word Break Problem', difficulty: 'Medium', category: 'Dynamic Programming', tags: ['Dynamic Programming', 'Trie'], fn: 'wordBreak', description: 'Determine if a string can be segmented into words from a dictionary.' },
  { id: 46, title: 'Combination Sum IV', difficulty: 'Medium', category: 'Dynamic Programming', tags: ['Dynamic Programming', 'Array'], fn: 'combinationSum4', description: 'Count the number of ways to reach target using elements of an array (with repetition).' },
  { id: 47, title: 'House Robber', difficulty: 'Medium', category: 'Dynamic Programming', tags: ['Dynamic Programming', 'Array'], fn: 'rob', description: 'Maximum money you can rob from houses without robbing adjacent ones.' },
  { id: 48, title: 'House Robber II', difficulty: 'Medium', category: 'Dynamic Programming', tags: ['Dynamic Programming', 'Array'], fn: 'robII', description: 'House Robber but houses are arranged in a circle.' },
  { id: 49, title: 'Decode Ways', difficulty: 'Medium', category: 'Dynamic Programming', tags: ['Dynamic Programming', 'String'], fn: 'numDecodings', description: 'Count the number of ways to decode a digit string.' },
  { id: 50, title: 'Unique Paths', difficulty: 'Medium', category: 'Dynamic Programming', tags: ['Dynamic Programming', 'Math'], fn: 'uniquePaths', description: 'Count unique paths from top-left to bottom-right of an m x n grid.' },
  // Graphs
  { id: 51, title: 'Number of Islands', difficulty: 'Medium', category: 'Graphs', tags: ['Graph', 'DFS', 'BFS', 'Union Find'], fn: 'numIslands', description: 'Count the number of islands in a 2D binary grid using DFS/BFS.' },
  { id: 52, title: 'Clone Graph', difficulty: 'Medium', category: 'Graphs', tags: ['Graph', 'DFS', 'BFS'], fn: 'cloneGraph', description: 'Return a deep copy of a connected undirected graph.' },
  { id: 53, title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', category: 'Graphs', tags: ['Graph', 'DFS', 'BFS'], fn: 'pacificAtlantic', description: 'Find cells from which water can flow to both Pacific and Atlantic oceans.' },
  { id: 54, title: 'Course Schedule', difficulty: 'Medium', category: 'Graphs', tags: ['Graph', 'Topological Sort'], fn: 'canFinish', description: 'Determine if you can finish all courses given their prerequisites (detect cycle).' },
  { id: 55, title: 'Course Schedule II', difficulty: 'Medium', category: 'Graphs', tags: ['Graph', 'Topological Sort'], fn: 'findOrder', description: 'Return the ordering of courses to finish all of them.' },
  { id: 56, title: 'Graph Valid Tree', difficulty: 'Medium', category: 'Graphs', tags: ['Graph', 'Union Find', 'DFS'], fn: 'validTree', description: 'Determine if n nodes and given edges form a valid tree.' },
  { id: 57, title: 'Number of Connected Components', difficulty: 'Medium', category: 'Graphs', tags: ['Graph', 'Union Find', 'DFS'], fn: 'countComponents', description: 'Count the number of connected components in an undirected graph.' },
  { id: 58, title: 'Word Ladder', difficulty: 'Hard', category: 'Graphs', tags: ['Graph', 'BFS', 'Hash Set'], fn: 'ladderLength', description: 'Find the shortest transformation sequence from beginWord to endWord.' },
  { id: 59, title: 'Alien Dictionary', difficulty: 'Hard', category: 'Graphs', tags: ['Graph', 'Topological Sort', 'BFS'], fn: 'alienOrder', description: 'Determine the order of letters in an alien language from sorted words.' },
  { id: 60, title: 'Dijkstra\'s Shortest Path', difficulty: 'Medium', category: 'Graphs', tags: ['Graph', 'Priority Queue', 'Shortest Path'], fn: 'dijkstra', description: 'Find the shortest paths from a single source to all other vertices.' },
  // Stack & Queue
  { id: 61, title: 'Min Stack', difficulty: 'Easy', category: 'Stack', tags: ['Stack', 'Design'], fn: 'MinStack', description: 'Design a stack that supports push, pop, top, and retrieving the minimum element in O(1).' },
  { id: 62, title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', category: 'Stack', tags: ['Stack', 'Array'], fn: 'evalRPN', description: 'Evaluate the value of an arithmetic expression in Reverse Polish Notation.' },
  { id: 63, title: 'Generate Parentheses', difficulty: 'Medium', category: 'Stack', tags: ['Stack', 'Backtracking'], fn: 'generateParenthesis', description: 'Generate all combinations of well-formed parentheses for n pairs.' },
  { id: 64, title: 'Daily Temperatures', difficulty: 'Medium', category: 'Stack', tags: ['Stack', 'Array'], fn: 'dailyTemperatures', description: 'For each day, find the number of days until a warmer temperature.' },
  { id: 65, title: 'Car Fleet', difficulty: 'Medium', category: 'Stack', tags: ['Stack', 'Array', 'Sorting'], fn: 'carFleet', description: 'Find the number of car fleets arriving at a destination.' },
  { id: 66, title: 'Largest Rectangle in Histogram', difficulty: 'Hard', category: 'Stack', tags: ['Stack', 'Array'], fn: 'largestRectangleArea', description: 'Find the largest rectangle area in a histogram.' },
  { id: 67, title: 'Sliding Window Maximum', difficulty: 'Hard', category: 'Stack', tags: ['Queue', 'Sliding Window'], fn: 'maxSlidingWindow', description: 'Return the max values in each sliding window of size k.' },
  { id: 68, title: 'Implement Queue using Stacks', difficulty: 'Easy', category: 'Stack', tags: ['Stack', 'Queue', 'Design'], fn: 'MyQueue', description: 'Implement a FIFO queue using only stacks.' },
  { id: 69, title: 'Next Greater Element', difficulty: 'Easy', category: 'Stack', tags: ['Stack', 'Array'], fn: 'nextGreaterElement', description: 'Find the next greater element for each element in an array.' },
  { id: 70, title: 'Trapping Rain Water', difficulty: 'Hard', category: 'Stack', tags: ['Array', 'Two Pointers', 'Stack'], fn: 'trap', description: 'Calculate how much water can be trapped after raining between buildings.' },
  // Binary Search
  { id: 71, title: 'Binary Search', difficulty: 'Easy', category: 'Binary Search', tags: ['Array', 'Binary Search'], fn: 'binarySearch', description: 'Implement binary search to find a target in a sorted array.' },
  { id: 72, title: 'Find Minimum in Rotated Sorted Array II', difficulty: 'Hard', category: 'Binary Search', tags: ['Array', 'Binary Search'], fn: 'findMinII', description: 'Find minimum in a rotated sorted array with duplicates.' },
  { id: 73, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', category: 'Binary Search', tags: ['Array', 'Binary Search', 'Divide Conquer'], fn: 'findMedianSortedArrays', description: 'Find the median of two sorted arrays in O(log(m+n)) time.' },
  { id: 74, title: 'Search a 2D Matrix', difficulty: 'Medium', category: 'Binary Search', tags: ['Array', 'Binary Search', 'Matrix'], fn: 'searchMatrix', description: 'Search for a target in an m×n matrix where rows and columns are sorted.' },
  { id: 75, title: 'Koko Eating Bananas', difficulty: 'Medium', category: 'Binary Search', tags: ['Array', 'Binary Search'], fn: 'minEatingSpeed', description: 'Find the minimum eating speed to finish all bananas within h hours.' },
  // Heap / Priority Queue
  { id: 76, title: 'Top K Frequent Elements', difficulty: 'Medium', category: 'Heap', tags: ['Array', 'Hash Map', 'Heap'], fn: 'topKFrequent', description: 'Return the k most frequent elements from an array.' },
  { id: 77, title: 'Find Median from Data Stream', difficulty: 'Hard', category: 'Heap', tags: ['Heap', 'Design', 'Sorting'], fn: 'MedianFinder', description: 'Design a data structure to find the median of a data stream at any time.' },
  { id: 78, title: 'K Closest Points to Origin', difficulty: 'Medium', category: 'Heap', tags: ['Array', 'Math', 'Divide Conquer', 'Heap'], fn: 'kClosest', description: 'Return the k closest points to the origin from a list of points.' },
  { id: 79, title: 'Task Scheduler', difficulty: 'Medium', category: 'Heap', tags: ['Array', 'Hash Map', 'Heap', 'Greedy'], fn: 'leastInterval', description: 'Find the minimum intervals needed to execute all tasks with a cooldown period.' },
  { id: 80, title: 'Design Twitter', difficulty: 'Medium', category: 'Heap', tags: ['Hash Map', 'Linked List', 'Heap', 'Design'], fn: 'Twitter', description: 'Design a simplified version of Twitter with follow, tweet, and news feed.' },
  // Backtracking
  { id: 81, title: 'Subsets', difficulty: 'Medium', category: 'Backtracking', tags: ['Array', 'Backtracking', 'Bit Manipulation'], fn: 'subsets', description: 'Generate all possible subsets (the power set) of a given set of integers.' },
  { id: 82, title: 'Combination Sum', difficulty: 'Medium', category: 'Backtracking', tags: ['Array', 'Backtracking'], fn: 'combinationSum', description: 'Find all combinations of numbers that sum to a target (with repetition allowed).' },
  { id: 83, title: 'Permutations', difficulty: 'Medium', category: 'Backtracking', tags: ['Array', 'Backtracking'], fn: 'permute', description: 'Generate all possible permutations of a distinct integer array.' },
  { id: 84, title: 'Word Search', difficulty: 'Medium', category: 'Backtracking', tags: ['Array', 'String', 'Backtracking', 'Matrix'], fn: 'exist', description: 'Determine if a word exists in a grid by connecting adjacent cells.' },
  { id: 85, title: 'N-Queens', difficulty: 'Hard', category: 'Backtracking', tags: ['Array', 'Backtracking'], fn: 'solveNQueens', description: 'Place n queens on an n×n chessboard so no two queens attack each other.' },
  { id: 86, title: 'Palindrome Partitioning', difficulty: 'Medium', category: 'Backtracking', tags: ['String', 'Dynamic Programming', 'Backtracking'], fn: 'partition', description: 'Partition a string such that every substring is a palindrome.' },
  { id: 87, title: 'Letter Combinations of a Phone Number', difficulty: 'Medium', category: 'Backtracking', tags: ['Hash Map', 'String', 'Backtracking'], fn: 'letterCombinations', description: 'Return all possible letter combinations for a given phone number.' },
  { id: 88, title: 'Sudoku Solver', difficulty: 'Hard', category: 'Backtracking', tags: ['Array', 'Backtracking', 'Matrix'], fn: 'solveSudoku', description: 'Write a program to solve a Sudoku puzzle by filling the empty cells.' },
  // Tries & Advanced
  { id: 89, title: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', category: 'Trie', tags: ['Hash Map', 'String', 'Design', 'Trie'], fn: 'Trie', description: 'Implement a trie with insert, search, and startsWith methods.' },
  { id: 90, title: 'Design Add and Search Words Data Structure', difficulty: 'Medium', category: 'Trie', tags: ['String', 'Backtracking', 'Design', 'Trie'], fn: 'WordDictionary', description: 'Design a data structure supporting addWord and search with wildcards.' },
  { id: 91, title: 'Word Search II', difficulty: 'Hard', category: 'Trie', tags: ['Array', 'String', 'Backtracking', 'Trie', 'Matrix'], fn: 'findWords', description: 'Find all words from a dictionary that exist in the board.' },
  { id: 92, title: 'Longest Word in Dictionary', difficulty: 'Medium', category: 'Trie', tags: ['Trie', 'String', 'Hash Set'], fn: 'longestWord', description: 'Find the longest word that can be built one character at a time.' },
  // Intervals & Greedy
  { id: 93, title: 'Insert Interval', difficulty: 'Medium', category: 'Intervals', tags: ['Array'], fn: 'insert', description: 'Insert a new interval into a list of non-overlapping intervals.' },
  { id: 94, title: 'Merge Intervals', difficulty: 'Medium', category: 'Intervals', tags: ['Array', 'Sorting'], fn: 'merge', description: 'Merge all overlapping intervals and return a non-overlapping array.' },
  { id: 95, title: 'Non-overlapping Intervals', difficulty: 'Medium', category: 'Intervals', tags: ['Array', 'Greedy', 'Sorting'], fn: 'eraseOverlapIntervals', description: 'Find the minimum number of intervals to remove to make the rest non-overlapping.' },
  { id: 96, title: 'Meeting Rooms', difficulty: 'Easy', category: 'Intervals', tags: ['Array', 'Sorting'], fn: 'canAttendMeetings', description: 'Determine if a person can attend all meetings.' },
  { id: 97, title: 'Meeting Rooms II', difficulty: 'Medium', category: 'Intervals', tags: ['Array', 'Sorting', 'Heap'], fn: 'minMeetingRooms', description: 'Find the minimum number of conference rooms required.' },
  // Math & Bit Manipulation
  { id: 98, title: 'Number of 1 Bits', difficulty: 'Easy', category: 'Bit Manipulation', tags: ['Divide Conquer', 'Bit Manipulation'], fn: 'hammingWeight', description: 'Return the number of 1 bits in the binary representation of a number.' },
  { id: 99, title: 'Counting Bits', difficulty: 'Easy', category: 'Bit Manipulation', tags: ['Dynamic Programming', 'Bit Manipulation'], fn: 'countBits', description: 'Count the number of 1 bits for every number from 0 to n.' },
  { id: 100, title: 'Missing Number', difficulty: 'Easy', category: 'Bit Manipulation', tags: ['Array', 'Hash Table', 'Math', 'Bit Manipulation'], fn: 'missingNumber', description: 'Find the missing number in an array containing n distinct numbers from 0 to n.' },
];

const CATEGORIES = ['All', ...new Set(DSA_PROBLEMS.map(p => p.category))];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

const DIFF_COLORS = { Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444' };

const DSAProblems = () => {
  const [selectedLang, setSelectedLang] = useState('javascript');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [code, setCode] = useState('');
  const [filter, setFilter] = useState({ category: 'All', difficulty: 'All', search: '' });
  const [solved, setSolved] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('dsa_solved') || '[]')); }
    catch { return new Set(); }
  });
  const [showEditor, setShowEditor] = useState(false);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const filtered = DSA_PROBLEMS.filter(p => {
    if (filter.category !== 'All' && p.category !== filter.category) return false;
    if (filter.difficulty !== 'All' && p.difficulty !== filter.difficulty) return false;
    if (filter.search && !p.title.toLowerCase().includes(filter.search.toLowerCase()) && !p.tags.some(t => t.toLowerCase().includes(filter.search.toLowerCase()))) return false;
    return true;
  });

  const openProblem = (problem) => {
    setSelectedProblem(problem);
    setCode(STARTER_CODE[selectedLang](problem.fn));
    setOutput('');
    setShowEditor(true);
  };

  const handleLangChange = (lang) => {
    setSelectedLang(lang);
    if (selectedProblem) {
      setCode(STARTER_CODE[lang](selectedProblem.fn));
    }
  };

  const markSolved = () => {
    const next = new Set([...solved, selectedProblem.id]);
    setSolved(next);
    localStorage.setItem('dsa_solved', JSON.stringify([...next]));
    setOutput('✅ Problem marked as solved! Great work!');
  };

  const runCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setOutput(`🚀 Code submitted successfully!\n\nLanguage: ${LANGUAGES.find(l => l.id === selectedLang)?.label}\nProblem: ${selectedProblem?.title}\n\nNote: In a production environment, code would be executed on a judge server. For now, marking as reviewed!`);
      setIsRunning(false);
    }, 800);
  };

  const stats = {
    total: DSA_PROBLEMS.length,
    solved: solved.size,
    easy: DSA_PROBLEMS.filter(p => p.difficulty === 'Easy' && solved.has(p.id)).length,
    medium: DSA_PROBLEMS.filter(p => p.difficulty === 'Medium' && solved.has(p.id)).length,
    hard: DSA_PROBLEMS.filter(p => p.difficulty === 'Hard' && solved.has(p.id)).length,
  };

  return (
    <div className="animate-fade" style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div className="flex-between mb-4" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: -100, left: 100, width: 400, height: 400, background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 60%)', pointerEvents: 'none' }}/>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '999px', padding: '0.2rem 0.8rem', fontSize: '0.75rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '0.75rem' }}>
            🧮 Data Structures & Algorithms
          </div>
          <h1 className="page-title" style={{ margin: 0, fontSize: '2.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
            100 DSA <span style={{ background: 'linear-gradient(135deg, var(--secondary), var(--tertiary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Problems</span>
          </h1>
          <p className="text-muted mt-2" style={{ fontSize: '0.95rem' }}>Master Data Structures & Algorithms with these curated patterns.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius-lg)', padding: '0.75rem 1.25rem', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontWeight: 900, color: 'var(--success)', fontSize: '1.4rem', lineHeight: 1, marginBottom: '0.2rem' }}>{stats.easy}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Easy</div>
          </div>
          <div style={{ textAlign: 'center', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-lg)', padding: '0.75rem 1.25rem', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontWeight: 900, color: 'var(--warning)', fontSize: '1.4rem', lineHeight: 1, marginBottom: '0.2rem' }}>{stats.medium}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Medium</div>
          </div>
          <div style={{ textAlign: 'center', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-lg)', padding: '0.75rem 1.25rem', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontWeight: 900, color: 'var(--danger)', fontSize: '1.4rem', lineHeight: 1, marginBottom: '0.2rem' }}>{stats.hard}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Hard</div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card mb-4" style={{ padding: '1.25rem' }}>
        <div className="flex-between mb-2">
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Progress</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)' }}>{Math.round((stats.solved / stats.total) * 100)}% <span style={{color:'var(--text-muted)', fontWeight: 500}}>({stats.solved}/{stats.total})</span></span>
        </div>
        <div className="progress-bar" style={{ height: 8 }}>
          <div className="progress-fill" style={{ width: `${(stats.solved / stats.total) * 100}%`, background: 'linear-gradient(90deg, var(--secondary), var(--primary))' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Sidebar: Filters & Language */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: 'calc(var(--navbar-height) + 1.5rem)' }}>
          {/* Language Selector */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🌐</span> Language
            </h3>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {LANGUAGES.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => handleLangChange(lang.id)}
                  style={{
                    padding: '0.4rem 0.7rem',
                    borderRadius: 'var(--radius)',
                    border: selectedLang === lang.id ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)',
                    background: selectedLang === lang.id ? 'var(--primary-light)' : 'rgba(255,255,255,0.02)',
                    color: selectedLang === lang.id ? 'var(--primary)' : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: selectedLang === lang.id ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                    flex: '1 1 calc(50% - 0.4rem)'
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{lang.icon}</span> {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🔍</span> Filters
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                placeholder="Search..."
                value={filter.search}
                onChange={e => setFilter({ ...filter, search: e.target.value })}
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <select value={filter.category} onChange={e => setFilter({ ...filter, category: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={filter.difficulty} onChange={e => setFilter({ ...filter, difficulty: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Right Area: Problems Table */}
        <div className="card" style={{ padding: 0.5, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto', background: 'var(--bg-card)', borderRadius: 'calc(var(--radius-lg) - 1px)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', width: '50px' }}>Id</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Difficulty</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((problem, idx) => (
                  <tr
                    key={problem.id}
                    className="card-hover"
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                      background: solved.has(problem.id) ? 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0z\' fill=\'%2322c55e\' fill-opacity=\'0.02\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => openProblem(problem)}
                  >
                    <td style={{ padding: '1rem', fontSize: '0.82rem', color: 'var(--text-faint)', fontWeight: 600 }}>#{problem.id}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: solved.has(problem.id) ? 'var(--text-muted)' : 'var(--text)' }}>
                        {problem.title}
                      </span>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                        {problem.tags.slice(0, 3).map(t => (
                          <span key={t} className="tag" style={{ border: 'none', background: 'rgba(255,255,255,0.04)', padding: '0.15rem 0.5rem', fontSize: '0.65rem' }}>{t}</span>
                        ))}
                        {problem.tags.length > 3 && <span className="tag" style={{ border: 'none', background: 'transparent', padding: 0, fontSize: '0.65rem' }}>+{problem.tags.length - 3}</span>}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{problem.category}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {solved.has(problem.id)
                        ? <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', background: 'var(--success-bg)', border: '1px solid rgba(34,197,94,0.3)', color: 'var(--success)' }}>✓</div>
                        : <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-faint)' }}>○</div>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                 <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>🔍</div>
                 <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>No problems found</div>
                 <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Try adjusting your search or filters.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code Editor Modal */}
      {showEditor && selectedProblem && (
        <div className="modal-overlay" onClick={() => setShowEditor(false)} style={{ padding: '1rem' }}>
          <div
            className="modal animate-slide"
            style={{ maxWidth: '1100px', width: '100%', height: '85vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', background: 'var(--bg)', border: '1px solid var(--border)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg, var(--secondary), var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem', fontWeight: 800 }}>
                  {selectedProblem.id}
                </div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{selectedProblem.title}</h3>
                <span className={`badge badge-${selectedProblem.difficulty.toLowerCase()}`}>{selectedProblem.difficulty}</span>
                {solved.has(selectedProblem.id) && <span style={{ color: 'var(--success)', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'var(--success-bg)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>✓ Solved</span>}
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowEditor(false)} style={{ fontSize: '1.2rem' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* Problem Description */}
              <div style={{ width: '35%', padding: '1.5rem', borderRight: '1px solid var(--border)', overflowY: 'auto', flexShrink: 0, background: 'var(--bg-card)' }}>
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ marginBottom: '0.8rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.8 }}>{selectedProblem.description}</p>
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ marginBottom: '0.8rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</h4>
                  <span className="badge badge-primary">{selectedProblem.category}</span>
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ marginBottom: '0.8rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tags</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {selectedProblem.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>
              </div>

              {/* Code Editor Area */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0d1117' }}>
                {/* Editor Toolbar */}
                <div style={{ padding: '0.6rem 1rem', borderBottom: '1px solid #30363d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#161b22', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                     <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7d8590' }}>Language</span>
                     <select
                       value={selectedLang}
                       onChange={e => handleLangChange(e.target.value)}
                       style={{ background: 'transparent', color: '#e6edf3', border: '1px solid #30363d', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.82rem', fontFamily: 'inherit' }}
                     >
                       {LANGUAGES.map(l => (
                         <option key={l.id} value={l.id} style={{ background: '#161b22', color: '#e6edf3' }}>{l.icon} {l.label}</option>
                       ))}
                     </select>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setCode(STARTER_CODE[selectedLang](selectedProblem.fn))}
                    style={{ color: '#7d8590' }}
                  >
                    ↺ Reset Code
                  </button>
                </div>

                {/* Code Textarea */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <textarea
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    style={{
                      position: 'absolute', inset: 0,
                      padding: '1.25rem',
                      background: 'transparent',
                      color: '#e6edf3',
                      fontFamily: "'Fira Code', 'Courier New', monospace",
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      border: 'none',
                      outline: 'none',
                      resize: 'none',
                    }}
                    spellCheck={false}
                  />
                </div>

                {/* Output Panel */}
                {output && (
                  <div style={{
                    padding: '1rem',
                    background: '#010409',
                    borderTop: '1px solid #30363d',
                    fontFamily: "'Fira Code', monospace",
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                    color: output.includes('✅') || output.includes('🚀') ? '#3fb950' : '#e6edf3',
                    minHeight: '120px',
                    maxHeight: '40%',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    flexShrink: 0,
                  }}>
                     {output}
                  </div>
                )}

                {/* Actions Footer */}
                <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #30363d', display: 'flex', gap: '0.75rem', justifyContent: 'space-between', background: '#161b22', flexShrink: 0, alignItems: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#7d8590', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#3fb950' }}/>
                    Ready to execute
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!solved.has(selectedProblem.id) && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={markSolved}
                        style={{ color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)', background: 'var(--success-bg)' }}
                      >
                        ✓ Mark Solved
                      </button>
                    )}
                    <button
                      className={`btn btn-primary btn-sm ${isRunning ? 'btn-loading' : ''}`}
                      onClick={runCode}
                      disabled={isRunning}
                      style={{ background: 'linear-gradient(135deg, #238636, #2ea043)', border: 'none', padding: '0.4rem 1.25rem', color: '#fff' }}
                    >
                      {isRunning ? '⏳ Running...' : '▶ Run Code'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DSAProblems;
