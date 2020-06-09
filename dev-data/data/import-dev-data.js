/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
// Server Properties
const fs = require('fs');

const mongoose = require('mongoose');

const dotenv = require('dotenv');

const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// this will return a promise which have a connect object
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(con => {
  console.log('Connected to DB');
});

// Read JSON File
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// Import Data INto DB
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data Successfully Loaded')
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

// Delete all data from collection
const deleteData = async () => {
    try {
        
        await Tour.deleteMany();
        console.log('Data Deleted');
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    console.log('in d');
    deleteData();
}

// console.log(process.argv);