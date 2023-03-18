const Food = require('./models/food.model');

exports.commandPrompt =
  'Select 1 to Place an order\nSelect 99 to checkout order\nSelect 98 to see order history\nSelect 97 to see current order\nSelect 0 to cancel order';

exports.getFoodForIds = async (idList) => {
  const foods = await Promise.all(
    idList.map(async (foodId) => {
      const food = await Food.findById(foodId);
      return food;
    })
  );

  return foods;
};
