const Food = require('./models/food.model');
const Order = require('./models/order.model');
const helpers = require('./helpers');

exports.getFoods = async (socket) => {
  const foods = await Food.find();
  foods.forEach((food) =>
    socket.emit('response', {
      body: `Name: ${food.name}\nPrice: ${food.price}\n Reply with ${food.number} to order.`,
      sender: 'server',
    })
  );
};

exports.orderFoodByNumber = async (socket, number, deviceId) => {
  const food = await Food.findOne({ number });

  if (!food)
    return socket.emit('response', {
      body: `No food with that number\n${helpers.commandPrompt}`,
      sender: 'server',
    });

  await Order.findOneAndUpdate(
    { completed: false, deviceId },
    {
      $push: { foods: food.id },
      $inc: { total: food.price },
    },
    {
      new: true,
      upsert: true,
    }
  );

  socket.emit('response', {
    body: `${food.name} has been added to your cart, select 99 to complete order.`,
    sender: 'server',
  });
};

exports.getCurrentOrder = async (socket, deviceId) => {
  const cart = await Order.findOne({ completed: false, deviceId });

  if (!cart || cart.foods.length < 1)
    return socket.emit('response', {
      body: 'Your cart is empty.',
      sender: 'server',
    });

  const foods = await helpers.getFoodForIds(cart.foods);
  let responseText = foods.map((food) => food.name).join('\n');

  socket.emit('response', {
    body: responseText.concat(
      `\nCart total: ${cart.total}\nSelect 99 to checkout\nSelect 0 to clear cart`
    ),
    sender: 'server',
  });
};

exports.clearCart = async (socket, deviceId) => {
  await Order.findOneAndUpdate(
    { completed: false, deviceId },
    {
      $set: { foods: [], total: 0 },
    },
    {
      new: true,
      upsert: true,
    }
  );

  socket.emit('response', {
    body: 'Cart cleared',
    sender: 'server',
  });
};

exports.checkout = async (socket, deviceId, email) => {
  const cart = await Order.findOne({ completed: false, deviceId });

  if (!cart || cart.total < 0)
    return socket.emit('response', {
      body: 'Nothing to checkout',
      sender: 'server',
    });

  socket.emit('checkout', { email, total: cart.total, orderId: cart._id });
};

exports.completeOrder = async (socket, orderId) => {
  if (!orderId) return;
  await Order.findByIdAndUpdate(orderId, {
    $set: { completed: true, completedAt: Date.now() },
  });
  socket.emit('response', {
    body: "Order completed successfully, we'll deliver your order soon",
    sender: 'server',
  });
};

exports.orderHistory = async (socket, deviceId) => {
  const orders = await Order.find({
    completed: true,
    deviceId,
    completedAt: {
      $gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
    },
  }).sort({ completedAt: -1 });

  orders.forEach(async (order) => {
    const foods = await helpers.getFoodForIds(order.foods);
    let responseText = foods
      .map((food) => food.name)
      .join('\n')
      .concat(
        `\nOrder total: ${order.total}\nDate ordered: ${order.completedAt}`
      );
    socket.emit('response', {
      body: responseText,
      sender: 'server',
    });
  });
};
