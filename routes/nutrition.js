// routes/nutrition.js

const express = require('express');
const { analyzeRecipe } = require('../controllers/nutritionController');

const router = express.Router();

// A POST request to /api/nutrition/analyze will trigger the analyzeRecipe function
router.route('/analyze').post(analyzeRecipe);

module.exports = router;