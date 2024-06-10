const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User'); // Assuming you have user management functionality
const { fetchadmin } = require('../middleware/fetchadmin');

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let admin = await Admin.findOne({ email });
        if (admin && password === admin.password) { // Ensure to hash passwords in production
            const token = jwt.sign({ admin: { id: admin.id }}, 'admin_secret_mcube');
            res.json({ success: true, token });
        } else {
            res.status(401).json({ success: false, errors: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Fetch all users (Protected route)
router.get('/users', fetchadmin, async (req, res) => {
    try {
        const users = await User.find({});
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;
