
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register new user
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: 'User already exists' });

        user = new User({ email, password });
        await user.save();

        const token = user.getSignedJwtToken();
        res.status(201).json({ token, user: { id: user._id, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = user.getSignedJwtToken();
        res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
