const express = require('express');
const authRoutes = require('./auth');
const productRoutes = require('./product');
const userRoutes = require('./user');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/user', userRoutes);

module.exports = router;
