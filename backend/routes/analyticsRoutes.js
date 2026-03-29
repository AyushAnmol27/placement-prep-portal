const express = require('express');
const router = express.Router();
const { getDashboardAnalytics, getAdminAnalytics } = require('../controllers/analyticsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboardAnalytics);
router.get('/admin', protect, adminOnly, getAdminAnalytics);

module.exports = router;
