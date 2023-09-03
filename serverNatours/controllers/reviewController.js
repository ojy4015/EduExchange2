import Review from './../models/reviewModel.js';
import catchAsync from './../utils/catchAsync.js';
import * as factory from './handlerFactory.js';

// middleware running before createReview
const setTourUserIds = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if(!req.body.tour) req.body.tour = req.params.tourId;
  // req.user.id comes from protect middleware
  if(!req.body.user) req.body.user = req.user.id;
  next();
});

// thanks to closure
const getAllReviews = factory.getAll(Review);
const createReview = factory.createOne(Review);
const getReview = factory.getOne(Review);
const updateReview = factory.updateOne(Review);
const deleteReview = factory.deleteOne(Review);

export {getAllReviews, createReview, getReview,updateReview, deleteReview}
