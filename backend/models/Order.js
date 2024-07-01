const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: String, required: true },
  status: { type: String, default: 'Order Pending' },
  payment: { type: Object, required: true },
  date: { type: Date, default: Date.now }
});

orderSchema.pre('save', async function(next) {
    if (this.isNew) {
        const lastOrder = await mongoose.model('Order').findOne().sort({ _id: -1 });
        this.orderId = lastOrder ? lastOrder.orderId + 1 : 1;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
