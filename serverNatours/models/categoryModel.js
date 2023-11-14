import mongoose from 'mongoose';
import slugify from 'slugify';
import validator from 'validator';
// only in embedd object
// const User = require('./userModel');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A category must have a name'],
      unique: true,
      trim: true,
      maxlength: [32, 'A category name must have less or equal then 32 characters'],
      minlength: [2, 'A category name must have more or equal then 2 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

categorySchema.index({ price: 1, ratingsAverage: -1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ startLocation: '2dsphere' });

// categorySchema.virtual('durationWeeks').get(function() {
//   return this.duration / 7;
// });

// Virtual populate: connect two model(Tour, Review) together
categorySchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'category',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create() not for update()
categorySchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});


// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
categorySchema.pre(/^find/, function (next) {
  this.find({ secretcategory: { $ne: true } });

  this.start = Date.now();
  next();
});

// populate step replace ids with the actual data
categorySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});

categorySchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});


const Category = mongoose.model('Category', categorySchema);

export default Category;



