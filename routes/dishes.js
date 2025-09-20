// Defines the API endpoints for dishes
const express = require('express');
const multer = require('multer');
const path = require('path');
const {
    getDishes,
    getDish,
    createDish,
    approveDish,
    disapproveDish,
    deleteDish
} = require('../controllers/dishController');

const router = express.Router();


// --- Multer Configuration for File Uploads ---

// Set up storage for uploaded files
const storage = multer.diskStorage({
  // FIX: Use an absolute path to ensure files are always saved in the correct directory
  destination: path.resolve(__dirname, '../uploads'),
  filename: function (req, file, cb) {
    // Create a unique filename to avoid overwrites
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Create a file filter to allow only specific image and video types
const fileFilter = (req, file, cb) => {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi|webm/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: You can only upload images and videos!'), false);
    }
};

// Initialize multer with storage, limits, and file filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 50000000 }, // 50MB file size limit
  fileFilter: fileFilter
});
// --- End Multer Configuration ---


// Update the POST route to handle multiple file fields
router.route('/')
    .get(getDishes)
    .post(upload.fields([
        { name: 'photos', maxCount: 5 }, 
        { name: 'videos', maxCount: 2 }
    ]), createDish);

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


