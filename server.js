// Main entry point for the application
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Enable CORS
app.use(cors());

// Body parser middleware to accept JSON data
app.use(express.json());

// Define routes
app.get('/', (req, res) => {
    res.send('Healthy Dishes API is running...');
});

// Mount routers
app.use('/api/dishes', require('./routes/dishes'));

// ADD THIS LINE TO PLUG IN YOUR NUTRITION ROUTE
app.use('/api/nutrition', require('./routes/nutrition'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
