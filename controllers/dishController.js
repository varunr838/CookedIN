// Contains the logic for handling requests to the dish routes
const Dish = require('../models/Dish');

// @desc    Get all dishes
// @route   GET /api/dishes
// @access  Public
exports.getDishes = async (req, res, next) => {
    try {
        const dishes = await Dish.find().sort({ createdAt: -1 }); // Show newest first
        res.status(200).json({ success: true, count: dishes.length, data: dishes });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get single dish
// @route   GET /api/dishes/:id
// @access  Public
exports.getDish = async (req, res, next) => {
    try {
        const dish = await Dish.findById(req.params.id);

        if (!dish) {
            return res.status(404).json({ success: false, error: 'Dish not found' });
        }

        res.status(200).json({ success: true, data: dish });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create a dish
// @route   POST /api/dishes
// @access  Public (in a real app, this would be private)
exports.createDish = async (req, res, next) => {
    try {
        const dish = await Dish.create(req.body);
        res.status(201).json({ success: true, data: dish });
    } catch (err) {
        // Handle validation errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        } else {
            res.status(500).json({ success: false, error: 'Server Error' });
        }
    }
};

// @desc    Approve a dish (like)
// @route   PUT /api/dishes/:id/approve
// @access  Public
exports.approveDish = async (req, res, next) => {
    try {
        const dish = await Dish.findByIdAndUpdate(
            req.params.id,
            { $inc: { approves: 1 } }, // Increment the approves count by 1
            { new: true, runValidators: true } // Return the updated document
        );

        if (!dish) {
            return res.status(404).json({ success: false, error: 'Dish not found' });
        }

        res.status(200).json({ success: true, data: dish });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Disapprove a dish (dislike)
// @route   PUT /api/dishes/:id/disapprove
// @access  Public
exports.disapproveDish = async (req, res, next) => {
    try {
        const dish = await Dish.findByIdAndUpdate(
            req.params.id,
            { $inc: { disapproves: 1 } }, // Increment the disapproves count by 1
            { new: true, runValidators: true }
        );

        if (!dish) {
            return res.status(404).json({ success: false, error: 'Dish not found' });
        }

        res.status(200).json({ success: true, data: dish });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete a dish
// @route   DELETE /api/dishes/:id
// @access  Public (in a real app, private)
exports.deleteDish = async (req, res, next) => {
    try {
        const dish = await Dish.findById(req.params.id);

        if (!dish) {
            return res.status(404).json({ success: false, error: 'Dish not found' });
        }

        await dish.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
