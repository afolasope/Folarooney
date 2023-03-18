const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: [
    {
      origin: 'http://localhost:5173',
    },
    {
      origin: 'http://127.0.0.1:5173/',
    },
  ],
});
const controller = require('./controller');
const helpers = require('./helpers');
const commandNumbers = ['0', '1', '96', '97', '98', '99'];

app.use(express.static(`${__dirname}/templates`));

io.on('connection', (socket) => {
  socket.emit('response', {
    body: `Hello, I'm Fola of Folarooney 😉\n${helpers.commandPrompt}`,
    sender: 'server',
  });
  socket.on('command', ({ number, deviceId, email, orderId }) => {
    try {
      if (commandNumbers.includes(number)) {
        switch (number) {
          case '1':
            controller.getFoods(socket);
            break;
          case '97':
            controller.getCurrentOrder(socket, deviceId);
            break;
          case '0':
            controller.clearCart(socket, deviceId);
            break;
          case '99':
            controller.checkout(socket, deviceId, email);
            break;
          case '96':
            controller.completeOrder(socket, orderId);
            break;
          case '98':
            controller.orderHistory(socket, deviceId);
            break;
          default:
            socket.emit('response', {
              body: 'Invalid selection',
              sender: 'server',
            });
            break;
        }
      } else {
        controller.orderFoodByNumber(socket, number, deviceId);
      }
    } catch (error) {
      socket.emit('response', {
        body: error.message,
        sender: 'server',
      });
    }
  });
});

module.exports = server;
