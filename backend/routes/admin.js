const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User'); 
const { fetchadmin } = require('../middleware/fetchadmin'); 
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let admin = await Admin.findOne({ email });
        if (admin && password === admin.password) {
            const token = jwt.sign({ admin: { id: admin.id }}, 'admin_secret_mcube');
            res.json({ success: true, token });
        } else {
            res.status(401).json({ success: false, errors: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.get('/userdetails/:id', fetchadmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id, 'name email'); // Retrieve only name and email fields
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
