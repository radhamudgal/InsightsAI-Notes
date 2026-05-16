const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { generateSummary, extractActionItems, suggestTitle } = require('../controllers/ai.controller');

const router = express.Router();

// All AI routes require login (keeps API key safe on server side)
router.use(protect);

router.post('/summary',      generateSummary);
router.post('/action-items', extractActionItems);
router.post('/title',        suggestTitle);

module.exports = router;
