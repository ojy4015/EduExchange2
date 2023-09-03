// const express = require('express');

// const categoryController = require('./../controllers/categoryController');
// const authController = require('./../controllers/authController');
// const reviewRouter = require('./../routes/reviewRoutes');

// const router = express.Router();

// router.use('/:categoryId/reviews', reviewRouter);

// router
//   .route('/top-5-cheap')
//   .get(categoryController.aliasTopCategorys, categoryController.getAllCategorys);

// router.route('/category-stats').get(categoryController.getCategoryStats);
// router.route('/monthly-plan/:year').get(authController.protect,
//   authController.restrictTo('admin', 'lead-guide', 'guide'),
//   categoryController.getMonthlyPlan);

//   router.route('/categorys-within/:distance/center/:latlng/unit/:unit')
//   .get(categoryController.getCategorysWithin);
// // /tours-within?distance=233&center=-40,45&unit=mi (doesn't work)
// // /tours-within/233/center/-40,45/unit/mi

// router.route('/distances/:latlng/unit/:unit')
//   .get(categoryController.getDistances);
//   // /distances/-40,45/unit/mi


// router
//   .route('/')
//   .get(categoryController.getAllCategorys)
//   .post(authController.protect,
//     authController.restrictTo('admin', 'lead-guide'),
//     categoryController.createCategory);

// router
//   .route('/:id')
//   .get(categoryController.getCategory)
//   .patch(authController.protect,
//     authController.restrictTo('admin', 'lead-guide'),
//     categoryController.updateCategory)
//   .delete(
//     authController.protect,
//     authController.restrictTo('admin', 'lead-guide'),
//     categoryController.deleteCategory
//   );

// module.exports = router;


////////////////////////////////////////////////////////////////////////


import express from 'express';

import * as categoryController from './../controllers/categoryController.js';
import * as authController from './../controllers/authController.js';
import * as reviewRouter from './../routes/reviewRoutes.js';

const router = express.Router();

router
  .route('/tours-by-category/:slug')
  .get(categoryController.toursByCategory)

router
  .route('/')
  .get(categoryController.getAllCategorys)
  .post(authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    categoryController.createCategory);

router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    categoryController.updateCategory)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    categoryController.deleteCategory
  );

export default router;












