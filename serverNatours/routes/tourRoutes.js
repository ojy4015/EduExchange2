import express from 'express';
import * as tourController from './../controllers/tourController.js';
import * as authController from './../controllers/authController.js';
import * as reviewRouter from './../routes/reviewRoutes.js';
import formidableMiddleware from 'express-formidable';

const router = express.Router();

// for public route
router.get('/test', (req, res) => {
  res.json({ name: "Hyung", favoriteFood: "Rice" })
});

router
  .route('/photo/:photoId')
  .get(tourController.photo);

router
  .route('/filteredTours')
  .post(tourController.filteredTours);

router
  .route('/toursCount')
  .get(tourController.toursCount);

router
  .route('/list-tours/:page')
  .get(tourController.listTours);

router
  .route('/search/:keyword')
  .get(tourController.toursSearch);

router
  .route('/related-tours/:tourId/:categoryId')
  .get(tourController.relatedTours);

// generate braintree token
router.get("/braintree/token", tourController.getToken);
// finalize transaction
router.post("/braintree/payment", authController.protect, tourController.processPayment);

//////////////////////////////////////////////////////////

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(authController.protect,
  authController.restrictTo('admin', 'lead-guide', 'guide'),
  tourController.getMonthlyPlan);

router.route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi (doesn't work)
// /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit')
  .get(tourController.getDistances);
// /distances/-40,45/unit/mi

///////////////////////////////////////////////////////////////////
// router.use(formidableMiddleware());

// router.use('/:tourId/reviews', reviewRouter);

// to avoid conflict with /:id, add /slug
router
  .route('/slug/:slug')
  .get(tourController.read);
////////////////////////////////////////////////////

router
  .route('/')
  .get(tourController.getAllTours)
  // .get(tourController.getAllFeaturedTours)
  .post(authController.protect,
    authController.restrictTo('admin', 'guides'),
    formidableMiddleware(),
    tourController.create);


router
  .route('/:id')
  .get(tourController.getTour)
  .patch(authController.protect,
    authController.restrictTo('admin', 'guides'),
    tourController.updateTour)
  .put(authController.protect,
    authController.restrictTo('admin', 'guides'),
    formidableMiddleware(),
    tourController.update)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'guides'),
    tourController.deleteTour
  );

// router.use('/:tourId/reviews', reviewRouter);

router
  .route("/order-status/:orderId")
  .put(authController.protect, authController.restrictTo('admin'), tourController.orderStatus);

export default router;