const express = require('express');
const router = express.Router();
const { getTests, getTest, submitTest, createTest, updateTest, deleteTest, getTestLeaderboard } = require('../controllers/testController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getTests);
router.get('/:id', protect, getTest);
router.get('/:id/leaderboard', protect, getTestLeaderboard);
router.post('/', protect, adminOnly, createTest);
router.put('/:id', protect, adminOnly, updateTest);
router.delete('/:id', protect, adminOnly, deleteTest);
router.post('/:id/submit', protect, submitTest);

module.exports = router;
