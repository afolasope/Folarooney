const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Food = require('../models/food.model');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD);

const foodList = [
  {
    number: '100',
    name: 'Medium jollof rice with asun and dodo',
    price: 1800,
  },
  {
    number: '105',
    name: 'Large jollof rice with asun and dodo',
    price: 2400,
  },
  {
    number: '110',
    name: 'Medium fried rice with asun and dodo',
    price: 1800,
  },
  {
    number: '115',
    name: 'Large jollof rice with asun and dodo',
    price: 2400,
  },
  {
    number: '120',
    name: 'Medium spaghetti with chicken and dodo',
    price: 1800,
  },
  {
    number: '125',
    name: 'Large spaghetti with chicken and dodo',
    price: 2400,
  },
];

mongoose.connect(DB).then(async () => {
  console.log('DB connection successful');
  await Food.insertMany(foodList);
  console.log('Foods added to DB.');
  process.exit();
});
