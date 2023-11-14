import mongoose from 'mongoose';
import slugify from 'slugify';
import validator from 'validator';

// only in embedd object
// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    /////////////////// for realist only /////////////////////
    photos: [{}],
    // objects address
    address: { type: String, maxLength: 255, required: true },
    bedrooms: Number,
    bathrooms: Number,
    landsize: String,
    carpark: Number,
    location: {
      // GeoJSON
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        //  longitude(경도)], [latitude(위도)
        default: [126.977966, 37.566536]
      }
    },

    postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },

    // sold for realist
    isSold: { type: Boolean, default: false },
    googleMap: {},
    // type: house, land
    type: {
      type: String,
      default: 'Other'
    },
    // action: Sell or Rent
    action: {
      type: String,
      default: 'Sell'
    },
    views: {
      type: Number,
      default: 0
    },

    ////////////// common for both  tours and realist ///////////////
    // title for realist
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters']
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    description: {
      type: {},
      trim: true
    },

    ///////////////////////////// for tours only///////////
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 // 4.666, 46.666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    // category is not array but object
    categoryIn: { type: mongoose.Schema.ObjectId, ref: 'Category' },
    quantity: {
      type: Number
    },
    sold: {
      type: Number,
      default: 0
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

// compound index => 1: ascending order , -1: descending order
tourSchema.index({ price: 1, ratingsAverage: -1 });

// unique index
tourSchema.index({ slug: 1 });
// tourSchema.index({ startLocation: '2dsphere' });
tourSchema.index({ location: '2dsphere' });

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
// tourSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   // slug: slugify(`${req.body.ad.type}-${req.body.ad.address}-${req.body.ad.price}-${nanoid(6)}`)
//   next();
// });

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

// allow to find places based on address by using $near
// tourSchema.index({ location: "2dshpere" });

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
