const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const routes = require('./routes/app');
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin'); 

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://mcube:mcube123@cluster0.ojhuygi.mongodb.net/mcube?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use('/images', express.static(path.join(__dirname, 'upload/images')));
app.use('/', routes);
app.use('/product', productRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

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
