const port = 4000;
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://mcube:mcube123@cluster0.ojhuygi.mongodb.net/mcube?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Image storage
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Serve static files
app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

const Product = mongoose.model("Product", {
    id: Number,
    name: String,
    image: String,
    category: String,
    description: String,
    new_price: Number,
    old_price: Number,
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
});

app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id = products.length ? products[products.length - 1].id + 1 : 1;

    const product = new Product({
        id,
        ...req.body
    });

    await product.save();
    res.json({ success: true, name: req.body.name });
});

// Delete Products
app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({ success: true, name: req.body.name });
});

// Get ALL products
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    res.send(products);
});

// Get products by category
app.get('/products/:category', async (req, res) => {
    const category = req.params.category;
    try {
        let products = await Product.find({ category: category });
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});




// User Model
const Users = mongoose.model('Users', {
    name: String,
    email: String,
    password: String,
    cartData: Object,
    date: { type: Date, default: Date.now },
});

// Register the user
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Check if the email already exists
    let check = await Users.findOne({ email });
    if (check) {
        return res.status(400).json({ success: false, errors: "Existing user found" });
    }

    // Create a new user with username, email, and password
    const newUser = new Users({ name, email, password });
    
    try {
        await newUser.save();
        const token = jwt.sign({ user: { id: newUser.id }}, 'secret_mcube');
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, errors: "Internal server error" });
    }
});

// User login
app.post('/login', async (req, res) => {
    try {
        let user = await Users.findOne({ email: req.body.email });
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

// New Collections
app.get('/newcollections', async (req, res) => {
    try {
        let products = await Product.find({}).sort({ date: -1 }).limit(8);
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Middleware to fetch user
const fetchuser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ errors: "Please authenticate using a valid token" });
    }

    try {
        const data = jwt.verify(token, 'secret_mcube');
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
};

app.get('/getuser', fetchuser, async (req, res) => {
    try {
        const user = await Users.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Add to cart route
app.post('/addtocart', fetchuser, async (req, res) => {
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Added");
});

// Remove from cart
app.post('/removefromcart', fetchuser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        if (userData.cartData[req.body.itemId] > 0) {
            userData.cartData[req.body.itemId] -= 1;
            await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
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
app.post('/getcart', fetchuser, async (req, res) => {
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
});

// Route to change password
app.post('/changepassword', fetchuser, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await Users.findOne({ _id: req.user.id });

        // Check if the old password matches
        if (user.password !== oldPassword) {
            return res.status(400).json({ success: false, message: 'Old password is incorrect' });
        }

        // Update to new password
        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.listen(port, (error) => {
    if (!error) {
        console.log("Server is running on port " + port);
    } else {
        console.log("Error: " + error);
    }
});

app.get("/", (req, res) => {
    res.send("Express app is running");
});
