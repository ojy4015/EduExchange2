// const Category = require('./../models/categoryModel');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
// const factory = require('./handlerFactory');

// exports.aliasTopCategorys = (req, res, next) => {
//   req.query.limit = '5';
//   req.query.sort = '-ratingsAverage,price';
//   req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
//   next();
// };

// exports.getCategoryStats = catchAsync(async (req, res, next) => {
//   const stats = await Category.aggregate([
//     {
//       $match: { ratingsAverage: { $gte: 4.5 } }
//     },
//     {
//       $group: {
//         _id: { $toUpper: '$difficulty' },
//         numcategorys: { $sum: 1 },
//         numRatings: { $sum: '$ratingsQuantity' },
//         avgRating: { $avg: '$ratingsAverage' },
//         avgPrice: { $avg: '$price' },
//         minPrice: { $min: '$price' },
//         maxPrice: { $max: '$price' }
//       }
//     },
//     {
//       $sort: { avgPrice: 1 }
//     }
//     // {
//     //   $match: { _id: { $ne: 'EASY' } }
//     // }
//   ]);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       stats
//     }
//   });
// });

// exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
//   const year = req.params.year * 1; // 2021

//   const plan = await Category.aggregate([
//     {
//       $unwind: '$startDates'
//     },
//     {
//       $match: {
//         startDates: {
//           $gte: new Date(`${year}-01-01`),
//           $lte: new Date(`${year}-12-31`)
//         }
//       }
//     },
//     {
//       $group: {
//         _id: { $month: '$startDates' },
//         numCategoryStarts: { $sum: 1 },
//         categorys: { $push: '$name' }
//       }
//     },
//     {
//       $addFields: { month: '$_id' }
//     },
//     {
//       $project: {
//         _id: 0
//       }
//     },
//     {
//       $sort: { numCategoryStarts: -1 }
//     },
//     {
//       $limit: 12
//     }
//   ]);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       plan
//     }
//   });tour
// });

// // thanks to closure
// exports.getCategory = factory.getOne(Category, {path: 'reviews'});
// exports.getAllCategorys = factory.getAll(Category);
// exports.createCategory = factory.createOne(Category);
// exports.updateCategory = factory.updateOne(Category);
// exports.deleteCategory = factory.deleteOne(Category);


// // router.route('/tours-within/:distance/center/:latlng/unit/:unit', getToursWithin);

// // /tours-within?distance=233&center=-40,45&unit=mi(doesn't work)
// // /tours-within/233/center/34.017763, -118.336262/unit/mi


// exports.getCategorysWithin = catchAsync(async(req, res, next) => {
//   const {distance, latlng, unit} = req.params;
//   const [lat, lng] = latlng.split(',');

//   const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

//   if(!lat || !lng) {
//     next(new AppError('Please provide latitude and lognitude in the format lat.lng', 400));
//   }

//   //console.log(distance, lat, lng, unit);

//   const categorys = await Category.find(
//     { startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius]}}}
//   );

//   res.status(200).json({
//     status: 'success',
//     results: categorys.length,
//     data: {
//       data: categorys
//     }
//   });
// });

// exports.getDistances = catchAsync(async(req, res, next) => {
//   const {latlng, unit} = req.params;
//   const [lat, lng] = latlng.split(',');

//   // mi or km
//   const multiplier = unit === 'mi' ? 0.000621371 : 0.001;


//   if(!lat || !lng) {
//     next(new AppError('Please provide latitude and lognitude in the format lat.lng', 400));
//   }

//   //console.log(distance, lat, lng, unit);

//   const distances = await Category.aggregate([
//       {
//         $geoNear: {
//           near: {
//             type: 'Point',
//             coordinates: [lng * 1, lat * 1]
//           },
//           distanceField: 'distance',
//           distanceMultiplier: multiplier
//         }
//       },
//       {
//         $project: {
//           distance: 1,
//           name: 1
//         }
//       }
//     ]
//   );

//   res.status(200).json({
//     status: 'success',
//     data: {
//       data: distances
//     }
//   });
// });

// // // this part is added for test Github

////////////////////////////////////////////////////////////////////

const Category = require('./../models/categoryModel');
const Tour = require('./../models/tourModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');


// thanks to closure
exports.getCategory = factory.getOne(Category, { path: 'reviews' });
//exports.getAllCategorys = factory.getAll(Category);
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);


exports.getAllCategorys = async (req, res) => {
  try {
    const all = await Category.find({});
    res.json(all);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

exports.toursByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    const tours = await Tour.find({ category }).populate('category');

    res.json({
      category,
      tours
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};




