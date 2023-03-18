const mongoose = require('mongoose');

const foodShema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A food must have a name'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'A food must have a price.'],
  },
  number: {
    type: Number,
    min: 100,
    required: [true, 'A food must have a number.'],
    unique: true,
  },
});

const Food = mongoose.model('Food', foodShema);

module.exports = Food;
