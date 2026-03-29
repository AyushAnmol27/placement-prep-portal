const express = require('express');
const router = express.Router();
const { generateRoadmap, getRoadmap, updateWeek } = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateRoadmap);
router.get('/', protect, getRoadmap);
router.patch('/week/:week', protect, updateWeek);

module.exports = router;
