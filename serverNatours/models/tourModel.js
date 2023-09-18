import mongoose from 'mongoose';
import slugify from 'slugify';
import validator from 'validator';

// only in embedd object
// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10  // 4.666, 46.666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price (${VALUE}) should be below regular price'
      }
    },
    summary: {
      type: {},
      trim: true,
      required: [true, 'A tour must have a summary']
    },
    description: {
      type: {},
      trim: true
    },
    imageCover: {
      type: String,
      //required: [true, 'A tour must have a cover image']
    },
    images: [String],
    startDates: [Date],
    // secretTour: {
    //   type: Boolean,
    //   default: false
    // },
    // // embedded object
    // startLocation: {
    //   // GeoJSON
    //   type: {
    //     type: String,
    //     default: 'Point',
    //     enum: ['Point']
    //   },
    //   //longitude(경도), latitude(위도), (In googlemaps latitude, lognitude)
    //   coordinates: [Number],
    //   address: String,
    //   description: String
    // },
    // // new document embedded in Parent document
    // locations: [
    //   {
    //     // GeoJSON
    //     type: {
    //       type: String,
    //       default: 'Point',
    //       enum: ['Point']
    //     },
    //     //longitude(경도), latitude(위도), (In googlemaps latitude, lognitude)
    //     coordinates: [Number],
    //     address: String,
    //     day: Number
    //   }
    // ],
    // embedd case
    // guides: Array

    // reference  User Object case, only contains reference
    // Child referencing
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User"
      }
    ],
    // category is not array but object
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category"
    },
    // category: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "Category"
    //   },
    photo: {
      data: Buffer,
      contentType: String,
    },
    quantity: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate: connect two model(Tour, Review) together
// keeping the reference to all the child document(review) on the parent document(tour) without persisting to the database
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create() not for update()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create() not for update()
// embedding(not good) : overwrite simple array of ID with an array of user documents
// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);

//   next();
// });



// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// this points to current query
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

// populate step replace ids with the actual data, this will speed down performance
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v'
  });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE (only apply this for secretTour)
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
