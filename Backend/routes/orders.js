
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// Place a new order
router.post('/', protect, async (req, res) => {
    const { plan } = req.body;
    try {
        const order = new Order({
            userId: req.user._id,
            plan
        });
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: 'Failed to place order' });
    }
});

// Get current user's orders
router.get('/my', protect, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

module.exports = router;
