
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

// Get all orders
router.get('/orders', protect, adminOnly, async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'email');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Update order status
router.patch('/orders/:id', protect, adminOnly, async (req, res) => {
    const { status } = req.body;
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update order' });
    }
});

module.exports = router;
