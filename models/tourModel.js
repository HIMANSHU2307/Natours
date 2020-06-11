/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour name is must!'],
    unique: true,
    trim: true
  },
  slug: String,
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
  startDates: [Date]
}, { // OPTION TO SHOW OR NOT THE VIRTUAL PROPERTIES OF SCHEMA
    toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

tourSchema.virtual('duratioWeeks').get(function () {
  return this.duration / 7; // here this is pointing to current document
  // CAN'T USE VIRTUALPROPERTIES IN QUERY
});

// MIDDLEWARE DOCUMENT: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  // console.log(this); // this is the current document
  this.slug = slugify(this.name, { lower: true });
  next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;