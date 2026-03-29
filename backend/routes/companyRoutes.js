const express = require('express');
const router = express.Router();
const { getCompanies, getCompany, createCompany, updateCompany, addInterviewExperience, likeExperience } = require('../controllers/companyController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getCompanies);
router.get('/:id', protect, getCompany);
router.post('/', protect, adminOnly, createCompany);
router.put('/:id', protect, adminOnly, updateCompany);
router.post('/:id/experiences', protect, addInterviewExperience);
router.post('/:id/experiences/:expId/like', protect, likeExperience);

module.exports = router;
