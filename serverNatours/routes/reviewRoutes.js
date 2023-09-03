////////////////////////////////////////////////////////////////////
// import express from 'express';
// import * as reviewController from './../controllers/reviewController.js';
// import * as authController from './../controllers/authController.js';

// const router = express.Router({mergeParams: true});

// // no one can access below routes without being authentcated
// router.use(authController.protect);

// router
//   .route('/')
//   .get(reviewController.getAllReviews)
//   .post(
//     authController.restrictTo('user'),
//     reviewController.setTourUserIds,
//     reviewController.createReview);

// router
//   .route('/:id')
//   .get(reviewController.getReview)
//   .patch(authController.restrictTo('user', 'admin'), reviewController.updateReview)
//   .delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview);

// export default router;
