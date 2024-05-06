const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connected successfull'));

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});
