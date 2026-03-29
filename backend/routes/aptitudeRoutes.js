const express = require('express');
const router = express.Router();
const { getQuestions, getTopics, getQuestion, submitAnswer, createQuestion, updateQuestion, deleteQuestion, getTopicStats } = require('../controllers/aptitudeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getQuestions);
router.get('/topics', protect, getTopics);
router.get('/stats', protect, getTopicStats);
router.get('/:id', protect, getQuestion);
router.post('/', protect, adminOnly, createQuestion);
router.put('/:id', protect, adminOnly, updateQuestion);
router.delete('/:id', protect, adminOnly, deleteQuestion);
router.post('/:id/submit', protect, submitAnswer);

module.exports = router;
