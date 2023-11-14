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












