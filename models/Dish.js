// Mongoose schema for the Dish collection
const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add an ingredient name'],
        trim: true,
    },
    quantity: {
        type: String,
        required: [true, 'Please add a quantity'],
        trim: true,
    },
});

const DishSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    tags: {
        type: [String],
        required: true,
        // Example tags: 'Indian', 'Spicy', 'Veg', 'Baked'
    },
    photos: {
        type: [String], // Array of image URLs
        required: false
    },
    videos: {
        type: [String], // Array of video URLs
        required: false
    },
    ingredients: {
        type: [IngredientSchema],
        required: true,
    },
    approves: {
        type: Number,
        default: 0,
    },
    disapproves: {
        type: Number,
        default: 0,
    },
    // In a real app, you would link this to a User model
    // user: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'User',
    //   required: true
    // },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Dish', DishSchema);

