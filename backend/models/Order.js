//order model

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, default: "Order Pending" },
    payment: { type: Boolean, default: true }
});

orderSchema.pre('save', async function(next) {
    if (this.isNew) {
        const lastOrder = await Order.findOne().sort({ orderId: -1 });
        this.orderId = lastOrder ? lastOrder.orderId + 1 : 1;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;