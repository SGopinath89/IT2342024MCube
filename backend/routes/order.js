const mongoose = require('mongoose');
const express = require('express');
const Order = require('../models/Order');
const { fetchuser } = require('../middleware/fetchuser');
const User = require('../models/User');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Create a new order
router.post('/createorder', fetchuser, async (req, res) => {
  try {
    const { items, amount, address, payment } = req.body;

    // Ensure items are stored in the desired format
    const formattedItems = Object.entries(items).map(([productId, quantity]) => {
      return { [productId]: quantity };
    });

    const newOrder = new Order({
      userId: req.user.id,
      items: formattedItems,
      amount,
      address,
      status: 'Order Pending',
      payment,
      date: new Date()
    });

    await newOrder.save();

    
    const user = await User.findById(req.user.id);
    user.cartData = {}; 
    await user.save();

    res.status(201).json({ success: true, message: 'Order created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating order' });
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
    const { orderId, status } = req.body;

    await Order.findByIdAndUpdate(orderId, { status });

    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating order status" });
  }
});

// Cancel an order
router.delete('/cancelorder/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    await Order.findByIdAndUpdate(orderId, { status: 'Cancelled' });

    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ success: false, message: "Failed to cancel order. Please try again later." });
  }
});

module.exports = router;
