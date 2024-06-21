const mongoose = require('mongoose');
const express = require('express');
const Order = require('../models/Order');
const { fetchuser } = require('../middleware/fetchuser');
const User = require('../models/User');

const router = express.Router();

// Create a new order
router.post('/createorder', fetchuser, async (req, res) => {
    try {
        const { order_id, product_ids } = req.body;

        const orderedProductIds = product_ids.map(id => new mongoose.Types.ObjectId(id));

        const newOrder = new Order({
            order_id,
            product_ids: orderedProductIds,
            user_id: req.user.id,
            date: Date.now()
        });

        await newOrder.save();

        // Add order reference to the user's orders array
        await User.findByIdAndUpdate(req.user.id, { $push: { orders: newOrder._id }, $set: { cartData: {} } });

        res.json({ success: true, message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Get all orders for the logged-in user
router.get('/userorders', fetchuser, async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.user.id }).populate({
            path: 'product_ids',
            populate: {
                path: 'productId',
                model: 'Product'
            }
        });

        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// GET order details including products and user info
router.get('/order/:orderId', async (req, res) => {
    try {
      const orderId = req.params.orderId;
  
      const order = await Order.findById(orderId).populate('product_ids');
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      const productIds = order.product_ids.map((prod) => prod.productId);
  
      const products = await Product.find({ _id: { $in: productIds } });
  
      if (!products) {
        return res.status(404).json({ message: 'Products not found' });
      }
  
      const user = await User.findById(order.user_id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const orderDetails = {
        orderId: order._id,
        products: products.map((product) => ({
          productId: product._id,
          productName: product.name,
          quantity: order.product_ids.find((p) => p.productId.equals(product._id)).quantity,
          price: product.new_price,
        })),
        user: {
          userId: user._id,
          name: user.name,
          email: user.email,
        },
      };
  
      res.json(orderDetails);
    } catch (err) {
      console.error('Error fetching order details:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  })

module.exports = router;
