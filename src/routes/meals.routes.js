const express = require('express');
const router = express.Router();
const mealsController = require('../controllers/meals.controller');
const auth = require('../middleware/auth.middleware');

router.get('/recommendations', auth, mealsController.getRecommendations);
router.post('/', mealsController.createMeal); // Public for now to seed data

module.exports = router;
