
// review / rating /createdAt /ref to tour / ref to user

import mongoose from 'mongoose';
import Tour from './tourModel.js';

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
      trim: true
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now(),
    //   select: false
    // },

    // tour => products(orderModel.js), user => buyers(orderModel.js)
    // Parent Referencing
    // reference  Tour Object case, only contains reference
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, 'Review must belong to a tour.']
    },
    // reference  User Object case, only contains reference
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, 'Review must belong to a user.']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

// each combination of tour and user always unique
// this doesn't work, need to fix
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// QUERY MIDDLEWARE
// this points to current query
// populate step replace ids with the actual data, this will speed down performance 
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name'
  // });
  this.populate({
    path: 'user',
    select: 'name'
  });
  next();
});

// static method
// Model.calcAverageRatings
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  console.log("tourId = ", tourId);
  // this points to model and need to call aggregate on the model(Review.aggregate)
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  //console.log("stats: ", stats);

  if (stats.length > 0) {
    // update finally(lastly)
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });

  } else {
    // in case of no review
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

// middleware function for create review
reviewSchema.post('save', function () {
  // this points to current review document that is currently being saved
  // this.constructor points to the model, this.constructor = Review(Model)
  this.constructor.calcAverageRatings(this.tour);
});

// do the query before calcAverageRatings method
// findByIdAndUpdate, findByIdAndDelete do not have document middleware but have  query middleware which don't have direct access document
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // Goal is get to the current Review document
  // this is a current query
  // execute this returns a document (r = Review document)
  // const r = await this.findOne()
  // console.log("r : ",r);
  this.r = await this.findOne();
  // this.r => document
  console.log("this.r : ", this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function (next) {
  // await this.findOne(); does not work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
