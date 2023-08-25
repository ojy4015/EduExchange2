const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

// middleware running before createReview
exports.setTourUserIds = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if(!req.body.tour) req.body.tour = req.params.tourId;
  // req.user.id comes from protect middleware
  if(!req.body.user) req.body.user = req.user.id;
  next();
});

// thanks to closure
exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
