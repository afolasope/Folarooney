const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  foods: [String],
  deviceId: {
    type: String,
    required: [true, 'An order must have a device id.'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  total: {
    type: Number,
    default: 0,
  },
  completedAt: Date,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
