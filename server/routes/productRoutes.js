// server/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { protect, authorizeAdmin } = require('../middleware/auth');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only routes (protected)
router.post('/', protect, authorizeAdmin, createProduct);
router.put('/:id', protect, authorizeAdmin, updateProduct);
router.delete('/:id', protect, authorizeAdmin, deleteProduct);

module.exports = router;