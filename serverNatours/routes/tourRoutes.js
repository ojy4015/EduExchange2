const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');
const formidableMiddleware = require('express-formidable');

const router = express.Router();

// for public route
router.get('/test', (req, res)=> {
  res.json({name: "Hyung", favoriteFood: "Rice"})
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

router
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    formidableMiddleware(),
    tourController.create);

router
  .route('/:slug')
  .get(tourController.read);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour)
  .put(authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.update)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

router.use('/:tourId/reviews', reviewRouter);

module.exports = router;




/////////////////////////////////////////////////////////////////////////////////////////

// router
//   .route('/filteredTours')
//   .post(tourController.filteredTours);


//   exports.filteredTours = catchAsync(async (req, res) => {

//     try {
//       console.log("inside filteredTours");
//       const { checked, radio } = req.body;
  
  
//       let args = {}; // [20, 39] radio[0]=20, radio[1]=39
//       if (checked.length > 0) args.category = checked; // add category property to the args object
//       if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }; // add price property to the args object
  
//       console.log("args => ", args);
//       const tours = await Tour.find(args);
//       // const products = await Product.find({
//       //   category: ['flkjsdjs', 'skjfsljgs'],
//       //   price: { $gte: radio[0], $lt: radio[1] }
//       // });
  
  
//       console.log("tours found in filtered tours query => ", tours.length);
//       res.json(tours);
   
  
//     } catch (err) {
//       console.log(err);
//     }
//   });





// router.post('/filtered-tours', (req, res)=> {
//   res.json('post test res');
//  });
// router.post('/filtered-tours', async(req, res)=> {
//   try {
//     console.log('req    ',req.body);
//     const { checked, radio } = req.body;

//     console.log("inside filteredTours");

//     let args = {}; // [20, 39] radio[0]=20, radio[1]=39
//     if (checked.length > 0) args.category = checked; // add category property to the args object
//     if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }; // add price property to the args object

//     console.log("args => ", args);
//     const tours = await Tour.find(args);
//     // const products = await Product.find({
//     //   category: ['flkjsdjs', 'skjfsljgs'],
//     //   price: { $gte: radio[0], $lt: radio[1] }
//     // });


//     console.log("tours found in filtered tours query => ", tours.length);
//     res.json(tours);
//     next();

//   } catch (err) {
//     console.log(err);
//   }
//  });