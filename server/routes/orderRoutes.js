// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    getOrders,
    getMyOrders, // Import the new function
    updateOrderStatus,
    deleteOrder
} = require('../controllers/orderController');
const { protect, authorizeAdmin } = require('../middleware/auth');

// User routes (protected)
router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders); // New route for user's own orders
router.get('/:id', protect, getOrderById);

// Admin routes (protected)
router.get('/', protect, authorizeAdmin, getOrders); // Get all orders (admin)
router.put('/:id/status', protect, authorizeAdmin, updateOrderStatus); // Update order status (admin)
router.delete('/:id', protect, authorizeAdmin, deleteOrder); // Delete order (admin)

module.exports = router;