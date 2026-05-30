// server/routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configure storage for multer
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/'); // Images will be saved in the 'uploads' folder
    },
    filename(req, file, cb) {
        // CORRECTED: Ensure filename is generated using plain JavaScript
        // without any HTML/Markdown artifacts.
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

// File filter to allow only images
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

// Initialize multer upload middleware
const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private/Admin (you might want to add protect & authorizeAdmin middleware here)
router.post('/', upload.single('image'), (req, res) => {
    if (req.file) {
        // Return the path where the image can be accessed publicly
        // For local development, it will be something like /uploads/image-12345.jpg
        res.send(`/${req.file.path.replace(/\\/g, '/')}`); // Replace backslashes for URL compatibility
    } else {
        res.status(400).json({ message: 'No image file uploaded' });
    }
});

module.exports = router;
