// Order.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    order_id: {
        type: String,
        required: true,
        unique: true
    },
    product_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }],
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { collection: 'orders' });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
