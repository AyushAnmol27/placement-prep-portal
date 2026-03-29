const express = require('express');
const router = express.Router();
const { getProblems, getProblem, createProblem, updateProblem, deleteProblem, solveProblem, toggleBookmark, runCode, submitSolution, getSubmissions } = require('../controllers/problemController');
const { protect, optionalAuth, adminOnly } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, getProblems);
router.get('/submissions', protect, getSubmissions);
router.post('/run', protect, runCode);
router.get('/:id', optionalAuth, getProblem);
router.post('/', protect, adminOnly, createProblem);
router.put('/:id', protect, adminOnly, updateProblem);
router.delete('/:id', protect, adminOnly, deleteProblem);
router.post('/:id/solve', protect, solveProblem);
router.post('/:id/bookmark', protect, toggleBookmark);
router.post('/:id/submit', protect, submitSolution);
router.get('/:id/submissions', protect, getSubmissions);

module.exports = router;
