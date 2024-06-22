const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { fetchuser } = require('../middleware/fetchuser');

const router = express.Router();

// Get user data
router.get('/getuser', fetchuser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Add to cart
router.post('/addtocart', fetchuser, async (req, res) => {
    try {
        let userData = await User.findOne({ _id: req.user.id });
        userData.cartData[req.body.itemId] = (userData.cartData[req.body.itemId] || 0) + 1;
        await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        
        // Send a JSON response indicating success
        res.json({ success: true, message: 'Item added to cart successfully' });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Remove from cart
router.post('/removefromcart', fetchuser, async (req, res) => {
    try {
        let userData = await User.findOne({ _id: req.user.id });
        if (userData.cartData[req.body.itemId] > 0) {
            userData.cartData[req.body.itemId] -= 1;
            await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
            res.json({ success: true, message: 'Item removed from cart' });
        } else {
            res.json({ success: false, message: 'Item quantity is already zero' });
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Get cart data
router.post('/getcart', fetchuser, async (req, res) => {
    try {
        let userData = await User.findOne({ _id: req.user.id });
        res.json(userData.cartData);
    } catch (error) {
        console.error('Error fetching cart data:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


module.exports = router;
