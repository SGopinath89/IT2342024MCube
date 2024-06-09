const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { fetchuser } = require('../middleware/fetchuser');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, errors: "Invalid email format" });
    }

    if (!nameRegex.test(name)) {
        return res.status(400).json({ success: false, errors: "Invalid name format" });
    }

    try {
        let check = await User.findOne({ email });
        if (check) {
            return res.status(400).json({ success: false, errors: "Existing user found" });
        }

        const cartData = {};
        for (let i = 1; i <= 300; i++) {
            cartData[i] = 0;
        }

        const newUser = new User({ name, email, password, cartData });
        await newUser.save();
        const token = jwt.sign({ user: { id: newUser.id }}, 'secret_mcube');
        res.json({ success: true, token });
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).json({ success: false, errors: "Internal server error" });
    }
});


// User login
router.post('/login', async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user && req.body.password === user.password) {
            const token = jwt.sign({ user: { id: user.id }}, 'secret_mcube');
            res.json({ success: true, token });
        } else {
            res.json({ success: false, errors: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Change password
router.post('/changepassword', fetchuser, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findOne({ _id: req.user.id });

        if (user.password !== oldPassword) {
            return res.status(400).json({ success: false, message: 'Old password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
