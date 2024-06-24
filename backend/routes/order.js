//order route 

const mongoose = require('mongoose');
const express = require('express');
const Order = require('../models/Order');
const { fetchuser } = require('../middleware/fetchuser');
const User = require('../models/User');
const Product = require('../models/Product'); // Ensure you have the Product model imported
const jwt = require('jsonwebtoken');

const router = express.Router();



// Create a new order
router.post('/createorder', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const newOrder = new Order({
      userId: userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: req.body.payment,
    });
    await newOrder.save();
    await User.findOneAndUpdate({ _id: userId }, { cartData: {} });
    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error placing order" });
  }
});

// Get all orders for the logged-in user
router.get('/myorders', fetchuser, async (req, res) => {
  try {
      const userId = req.user.id;
      const orders = await Order.find({ userId: userId }).sort({ orderId: -1 });
      console.log(orders);
      res.json({ success: true, data: orders });
  } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Error retrieving orders" });
  }
});

router.get('/allorders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderId: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error retrieving all orders" });
  }
});

// Update order status
router.post('/status', async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.body.orderId, { status: req.body.status });

    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
});

module.exports = router;
