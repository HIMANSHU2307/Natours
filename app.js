/* eslint-disable prettier/prettier */
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes');
//Node. js includes fs module to access physical file system. The fs module is responsible for all the asynchronous or synchronous file I/O operations.

const app = express();
// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') { 
    // enable logger in development env only
    app.use(morgan('dev'));// for morgan checkout google/ is a logger
    // to get the incoming data fom client to the server a middlewear is required
}


app.use(express.json());
// express.json is the middlewear here, req goes through this middlewear

app.use(express.static(`${__dirname}/public`));
// for html public file

// 3) ROUTES

app.use('/api/v1/tours', tourRouter); // Router middleware
app.use('/api/v1/users', userRouter);    

module.exports = app;
