import Review from './../models/reviewModel.js';
import catchAsync from './../utils/catchAsync.js';
import * as factory from './handlerFactory.js';

// middleware running before createReview
const setTourUserIds = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  // req.user.id comes from protect middleware
  if (!req.body.user) req.body.user = req.user.id;
  next();
});

// get all reviews for all products
// export const getAllReviews = catchAsync(async (req, res, next) => {
//   const allReviews = await Review.find();

//   res.json({
//     results: allReviews.length,
//     allReviews
//   });
// });

// get all reviews for one product of all users
export const getAllReviews = catchAsync(async (req, res, next) => {

  const allReviews = await Review.find({
    tour: req.params.id
  });

  res.json(allReviews);
});

// get all reviews for one product per one user
export const getReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.findById(req.params.slug);

  // const reviewsOfTour = await Tour

  res.json({
    results: reviews.length,
    reviews
  });
});


export const getReviews = catchAsync(async (req, res) => {

  const orders = await Review.find({ tour: req.tour._id })
    .populate(
      "tour",
      "-photo"
    )
    .populate("user", "name");

  res.json(orders);
});

// create one review for one product per one user
export const createReview = catchAsync(async (req, res, next) => {
  const tourId = req.params.id;
  const userId = req.user.id;

  console.log('tourId : ', tourId);
  console.log('userId : ', userId);
  console.log('review : ', req.body.review);
  console.log('rating : ', req.body.rating);

  const newReview = await Review.create({
    review: req.body.review,
    rating: req.body.rating,
    tour: tourId,
    user: userId
  });

  res.status(201).json({
    status: 'success',
    review: newReview
  });
});



// thanks to closure
// const getAllReviews = factory.getAll(Review);
// const createReview = factory.createOne(Review);
//  const getReview = factory.getOne(Review);
// const updateReview = factory.updateOne(Review);
// const deleteReview = factory.deleteOne(Review);

// export {getAllReviews, createReview, getReview,updateReview, deleteReview}
