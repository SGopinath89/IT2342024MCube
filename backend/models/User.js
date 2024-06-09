const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cartData: Object,
    date: { type: Date, default: Date.now },
});

// Function to initialize cartData
UserSchema.statics.initializeCartData = function() {
    return {};
};

module.exports = mongoose.model('User', UserSchema);
