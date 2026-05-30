// server/controllers/orderController.js

const Order = require('../models/Order');
const Product = require('../models/Product'); // To check product existence and update stock

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, taxPrice, shippingPrice, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        try {
            // Verify products and calculate total price on backend to prevent tampering
            const itemsFromDb = await Product.find({
                _id: {
                    $in: orderItems.map((x) => x.product),
                },
            });

            const dbOrderItems = orderItems.map((item) => {
                const matchingItem = itemsFromDb.find((p) => p._id.toString() === item.product.toString());
                if (!matchingItem) {
                    throw new Error(`Product not found: ${item.name}`);
                }
                return {
                    ...item,
                    product: item.product, // Keep original product ID
                    price: matchingItem.price, // Use price from DB
                    imageUrl: matchingItem.imageUrl, // Use image from DB
                    name: matchingItem.name, // Use name from DB
                };
            });

            // Recalculate total price on the backend for security
            const calculatedTotalPrice = dbOrderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

            const order = new Order({
                user: req.user._id, // User ID from authenticated request
                orderItems: dbOrderItems,
                shippingAddress,
                paymentMethod,
                taxPrice: taxPrice || 0, // Ensure default if not provided
                shippingPrice: shippingPrice || 0, // Ensure default if not provided
                totalPrice: calculatedTotalPrice + (taxPrice || 0) + (shippingPrice || 0), // Use calculated total including taxes/shipping
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message || 'Server error creating order' });
        }
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'username email');

        if (order) {
            // Only allow user to view their own order, or if user is admin
            if (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
                res.json(order);
            } else {
                res.status(403).json({ message: 'Not authorized to view this order' });
            }
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching order' });
    }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id username email');
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching orders' });
    }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        // req.user._id is set by the protect middleware
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }); // Sort by newest first
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching user orders' });
    }
};


// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status || order.status;
            // Optionally update deliveredAt if status becomes 'Delivered'
            if (status === 'Delivered' && !order.isDelivered) {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating order status' });
    }
};

// @desc    Delete order (Admin only)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            await order.deleteOne(); // Use deleteOne() for Mongoose 6+
            res.json({ message: 'Order removed' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting order' });
    }
};


module.exports = {
    addOrderItems,
    getOrderById,
    getOrders,
    getMyOrders, // Export the new function
    updateOrderStatus,
    deleteOrder,
};