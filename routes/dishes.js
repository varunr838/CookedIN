// Defines the API endpoints for dishes
const express = require('express');
const {
    getDishes,
    getDish,
    createDish,
    approveDish,
    disapproveDish,
    deleteDish
} = require('../controllers/dishController');

const router = express.Router();

// Route for getting all dishes and creating a new dish
router.route('/')
    .get(getDishes)
    .post(createDish);

// Route for getting a single dish and deleting it
router.route('/:id')
    .get(getDish)
    .delete(deleteDish);

// Route for approving a dish
router.route('/:id/approve')
    .put(approveDish);

// Route for disapproving a dish
router.route('/:id/disapprove')
    .put(disapproveDish);

module.exports = router;
