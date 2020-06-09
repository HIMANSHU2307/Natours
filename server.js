/* eslint-disable prettier/prettier */
// Server Properties
const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// this will return a promise which have a connect object
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con => {
  console.log('Connected to DB');
});


// console.log(process.env);
// 4) START SERVER
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});
