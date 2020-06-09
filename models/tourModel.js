/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour name is must!'],
    unique: true,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'A tour duration is must!'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour Group Size is must!'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour difficulty is must!'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A price is must'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    required: [true, 'A tour must have a summary'],
    trim: true // will remove spaces
  },
  description: {
    type: String,
    trim: true // will remove spaces
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String],
  createAt: {
    type: Date,
    default: Date.now()
  },
  startDate: [Date]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;