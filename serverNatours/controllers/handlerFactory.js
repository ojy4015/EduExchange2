// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
// const APIFeatures = require('./../utils/apiFeatures');

// // works for every model
// exports.deleteOne = Model => catchAsync(async (req, res, next) => {
//   const doc = await Model.findByIdAndDelete(req.params.id);

//   if (!doc) {
//     return next(new AppError('No document found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
// });

// // update
// exports.updateOne = Model => catchAsync(async (req, res, next) => {
//   // in findByIdAndUpdate, all the save middlewares do not run.
//   const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true
//   });

//   if (!doc) {
//     return next(new AppError('No document found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       data: doc
//     }
//   });
// });

// exports.createOne = Model => catchAsync(async (req, res, next) => {
//   const doc = await Model.create(req.body);

// res.status(201).json({
//   status: 'success',
//   data: {
//     data: doc
//   }
// });

// });

// exports.getOne = (Model, popOptions)  => catchAsync(async (req, res, next) => {
//   let query = Model.findById(req.params.id);
//   // populate step replace ids with the actual data
//   if(popOptions) query = query.populate(popOptions);
//   const doc = await query;

//   // const doc = await Model.findById(req.params.id).populate('reviews');
//   // Tour.findOne({ _id: req.params.id })

//   // In case of tour returns null
//   if (!doc) {
//     return next(new AppError('No docuement found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       data: doc
//     }
//   });
// });

// exports.getAll = Model => catchAsync(async (req, res, next) => {
//   // To allow for nested GET reviews on tour(hack)
//   let filter = {};
//   if (req.params.categoryId) filter = {category: req.params.categoryId};

//   const features = new APIFeatures(Model.find(filter), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const doc = await features.query;

//   // SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     results: doc.length,
//     data: {
//       data: doc
//     }
//   });
// });

////////////////////////////////////////////////////////////////////////

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
// const APIFeatures = require('./../utils/apiFeatures');
const slugify = require('slugify')

// works for every model
exports.deleteOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  // res.status(204).json({
  //   status: 'success',
  //   data: null
  // });

  res.json(doc);
});

// update
exports.updateOne = Model => catchAsync(async (req, res, next) => {
  // in findByIdAndUpdate, all the save middlewares do not run.
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  // for the slug to change
  doc.save();

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     data: doc
  //   }
  // });
  res.json(doc);
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
  //console.log("in handler createOne: " + req.files, req.fields);
  const doc = await Model.create(req.body);

  // res.status(201).json({
  //   status: 'success',
  //   data: {
  //     data: doc
  //   }
  // });
  res.json(doc);
});

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
  //console.log("id in photo in getOne: ", req.params.photoId);
  let query = Model.findById(req.params.id);
  // populate step replace ids with the actual data
  if (popOptions) query = query.populate(popOptions);
  const doc = await query;

  // const doc = await Model.findById(req.params.id).populate('reviews');
  // Tour.findOne({ _id: req.params.id })

  // In case of tour returns null
  if (!doc) {
    return next(new AppError('No docuement found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

// exports.getAll = Model => catchAsync(async (req, res, next) => {
//   //console.log("req in getAll: "+req);
//   // To allow for nested GET reviews on tour(hack)
//   console.log("inside getAll");

//   let filter = {};
//   if (req.params.categoryId) filter = { category: req.params.categoryId };

//   const features = new APIFeatures(Model.find(filter), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const doc = await features.query;

//   // SEND RESPONSE
//   // res.status(200).json({
//   //   status: 'success',
//   //   results: doc.length,
//   //   data: {
//   //     data: doc
//   //   }
//   // });
//   res.json(doc);
// });

exports.getAll = Model => catchAsync(async (req, res) => {
  //console.log("req in getAll: "+req);
  // To allow for nested GET reviews on tour(hack)
  try {
    const tours = await Model.find({})
      .populate("category")
      .select("-photo")
      .sort({ createdAt: -1 });

    res.json(tours);
  } catch (err) {
    console.log(err);
  }
  res.json(doc);
});

// exports.list = catchAsync(async (req, res) => {
//   console.log("in tourController list: " + req);
//   try {
//     const tours = await Tour.find({})
//       .populate("category")
//       .select("-photo")
//       .limit(5)
//       .sort({ createdAt: -1 });

//     res.json(tours);
//   } catch (err) {
//     console.log(err);
//   }
// });

