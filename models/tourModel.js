/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour name is must!'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
      validate: [validator.isAlpha, 'Tour name must only contain characters']
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty can be only easy, medium or difficult'
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0' ],
      max: [5, 'Rating must be above 5.0' ]
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
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
          // this refers to the current document on NEW document
        },
        message: 'Discount price ({VALUE}) should be below the regular price'
      }
    },
    summary: {
      type: String,
      required: [true, 'A tour must have a summary'],
      trim: true, // will remove spaces
    },
    description: {
      type: String,
      trim: true, // will remove spaces
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    // OPTION TO SHOW OR NOT THE VIRTUAL PROPERTIES OF SCHEMA
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

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

// tourSchema.post('save', function (doc, next) {
//   // runs after the save, this do not exist
//   console.log(doc);
//   next();
// })

// QUERY MIDLEWARE: 
// tourSchema.pre('find', function (next) {
//   this.find({ secretTour: { $ne: true }}); // this points to query obj
//   next();
// });

// /^find/ means any query start with find
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } }); // this points to query obj

  this.start = Date.now();
  next();
});

// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds`);
//   next();
// });


// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift(
    {
      $match: { secretTour: { $ne: true } }
    }
  ); // unshift to add at beginning of the array
  console.log(this.pipeline());

  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;