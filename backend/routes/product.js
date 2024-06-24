const express = require('express');
const multer = require("multer");
const path = require("path");
const Product = require('../models/Product');

const router = express.Router();
const port = 4000; // Ensure the port is defined

// Image storage configuration
const storage = multer.diskStorage({
    destination: './upload/images', // Corrected directory path
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

// Upload image
router.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// Add product
router.post('/addproduct', async (req, res) => {
    try {
        let products = await Product.find({});
        let id = products.length ? products[products.length - 1].id + 1 : 1;

        const product = new Product({
            id,
            ...req.body
        });

        await product.save();
        res.json({ success: true, name: req.body.name });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Delete product
router.post('/removeproduct', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        res.json({ success: true, name: req.body.name });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Get all products
router.get('/allproducts', async (req, res) => {
    try {
        let products = await Product.find({});
        res.send(products);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Get products by category
router.get('/products/:category', async (req, res) => {
    const category = req.params.category;
    try {
        let products = await Product.find({ category: category });
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Update product
router.post('/updateproduct', async (req, res) => {
    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { id: req.body.id },
            { ...req.body },
            { new: true }
        );
        res.json({ success: true, product: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Get new collections
router.get('/newcollections', async (req, res) => {
    try {
        let products = await Product.find({}).sort({ date: -1 }).limit(8);
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.get('/allproducts/:id', async (req, res) => {

    const id = req.params.id

    try {
        let products = await Product.find({id});
        res.send(products);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
