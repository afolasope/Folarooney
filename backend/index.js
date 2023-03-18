const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './.env' });

const app = require('./app');

const PORT = process.env.PORT || 8000;
const DB = process.env.DATABASE(process.env.DB_PASSWORD);

mongoose.connect(DB).then(() => {
  console.log('DB connection successful');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});
