const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const braintree = require("braintree");
const fs = require('fs');
const dotenv = require('dotenv');
const Order = require('../models/order');

dotenv.config({ path: './config.env' });

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});

// thanks to closure
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.getAllTours = factory.getAll(Tour);
exports.createTour = factory.createOne(Tour);
//exports.createTour = factory.create();
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);


// router.route('/tours-within/:distance/center/:latlng/unit/:unit', getToursWithin);

// /tours-within?distance=233&center=-40,45&unit=mi(doesn't work)
// /tours-within/233/center/34.017763, -118.336262/unit/mi


// exports.create = catchAsync(async (req, res) => {
//   try {
//     console.log(req.files, req.fields);

//     // const { name, description, price, category, quantity, shipping } =
//     //   req.fields;
//     // const { photo } = req.files;

//     // // validation
//     // switch (true) {
//     //   case !name.trim():
//     //     return res.json({ error: "Name is required" });
//     //   case !description.trim():
//     //     return res.json({ error: "Description is required" });
//     //   case !price.trim():
//     //     return res.json({ error: "Price is required" });
//     //   case !category.trim():
//     //     return res.json({ error: "Category is required" });
//     //   case !quantity.trim():
//     //     return res.json({ error: "Quantity is required" });
//     //   case !shipping.trim():
//     //     return res.json({ error: "Shipping is required" });
//     //   case photo && photo.size > 1000000: //1Mbyte
//     //     return res.json({ error: "Image should be less than 1mb in size" });
//     // }

//     // // create product
//     // const product = new Product({ ...req.fields, slug: slugify(name) });

//     // if (photo) {
//     //   product.photo.data = fs.readFileSync(photo.path);
//     //   product.photo.contentType = photo.type;
//     // }

//     // await product.save();
//     // res.json(product);
//   } catch (err) {
//     console.log(err);
//     return res.status(400).json(err.message);
//   }
// });


exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(new AppError('Please provide latitude and lognitude in the format lat.lng', 400));
  }

  //console.log(distance, lat, lng, unit);

  const tours = await Tour.find(
    { startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } }
  );

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  // mi or km
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;


  if (!lat || !lng) {
    next(new AppError('Please provide latitude and lognitude in the format lat.lng', 400));
  }

  //console.log(distance, lat, lng, unit);

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]
  );

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});


////////////////////////////////////////////////////////////////


exports.create = catchAsync(async (req, res, next) => {
  //console.log("in tourController: " + req.files, req.fields);

  try {


    const { category, name, duration, maxGroupSize, description, difficulty, ratingsAverage, ratingsQuantity, price, priceDiscount, sold, summary } = req.fields;
    const { photo } = req.files;


    //validation
    switch (true) {
      case !name.trim():
        return res.json({ error: "Name is required" });
      case !duration.trim():
        return res.json({ error: "duration is required" });
      case !maxGroupSize.trim():
        return res.json({ error: "maxGroupSize is required" });
      case !description.trim():
        return res.json({ error: "Description is required" });
      case !difficulty.trim():
        return res.json({ error: "difficulty is required" });
      case !ratingsAverage.trim():
        return res.json({ error: "ratingsAverage is required" });
      case !ratingsQuantity.trim():
        return res.json({ error: "ratingsQuantity is required" });
      case !price.trim():
        return res.json({ error: "Price is required" });
      case !category.trim():
        return res.json({ error: "Category is required" });
      case !priceDiscount.trim():
        return res.json({ error: "priceDiscount is required" });
      case !sold.trim():
        return res.json({ error: "sold is required" });
      case !summary.trim():
        return res.json({ error: "summary is required" });
      //   case !shipping.trim():
      //     return res.json({ error: "Shipping is required" });
      case photo && photo.size > 1000000: //1Mbyte
        return res.json({ error: "Image should be less than 1mb in size" });
    }

    // create tour
    const tour = new Tour({ ...req.fields });

    if (photo) {
      tour.photo.data = fs.readFileSync(photo.path);
      tour.photo.contentType = photo.type;
    }

    await tour.save();
    res.json(tour);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
});


exports.update = catchAsync(async (req, res, next) => {
  //console.log("in tourController: " + req.files, req.fields);

  try {


    const { category, name, duration, maxGroupSize, description, difficulty, ratingsAverage, ratingsQuantity, price, priceDiscount, sold, summary } = req.fields;
    const { photo } = req.files;


    //validation
    switch (true) {
      case !name.trim():
        return res.json({ error: "Name is required" });
      case !duration.trim():
        return res.json({ error: "duration is required" });
      case !maxGroupSize.trim():
        return res.json({ error: "maxGroupSize is required" });
      case !description.trim():
        return res.json({ error: "Description is required" });
      case !difficulty.trim():
        return res.json({ error: "difficulty is required" });
      case !ratingsAverage.trim():
        return res.json({ error: "ratingsAverage is required" });
      case !ratingsQuantity.trim():
        return res.json({ error: "ratingsQuantity is required" });
      case !price.trim():
        return res.json({ error: "Price is required" });
      case !category.trim():
        return res.json({ error: "Category is required" });
      case !priceDiscount.trim():
        return res.json({ error: "priceDiscount is required" });
      case !sold.trim():
        return res.json({ error: "sold is required" });
      case !summary.trim():
        return res.json({ error: "summary is required" });
      //   case !shipping.trim():
      //     return res.json({ error: "Shipping is required" });
      case photo && photo.size > 1000000: //1Mbyte
        return res.json({ error: "Image should be less than 1mb in size" });
    }

    // create tour
    // const tour = new Tour({ ...req.fields });

    // update product
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      {
        ...req.fields
      },
      { new: true }
    );

    if (photo) {
      tour.photo.data = fs.readFileSync(photo.path);
      tour.photo.contentType = photo.type;
    }

    await tour.save();
    res.json(tour);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
});

exports.photo = catchAsync(async (req, res, next) => {
  try {
    //console.log("id in photo: ", req.params.photoId);
    const product = await Tour.findById(req.params.photoId).select(
      "photo"
    );
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.send(product.photo.data);
    }
  } catch (err) {
    console.log(err);
  }
});


exports.read = catchAsync(async (req, res, next) => {

  try {
    //console.log("params.slug=> ", req.params.slug);
    const tour = await Tour.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");

    res.json(tour);
  } catch (err) {
    console.log(err);
  }
});

exports.filteredTours = catchAsync(async (req, res) => {

  try {
    console.log("inside filteredTours");
    const { checked, radio } = req.body;


    let args = {}; // [20, 39] radio[0]=20, radio[1]=39
    if (checked.length > 0) args.category = checked; // add category property to the args object
    // if (checked.length > 0) args.category[0] = checked; // add category property to the args object
    if (radio.length > 0) args.price = { $gte: radio[0], $lte: radio[1] }; // add price property to the args object

    console.log("args => ", args);
    // console.log("args.category: => ", args.category);
    // console.log("args.price: => ", args.price);

    const tours = await Tour.find(args)
      .select("-photo")
      .populate("category");
    // const products = await Tour.find({
    //   category: ["64d792173d7b422db01fe7d2", "64d792203d7b422db01fe7d4"],
    //   price: { $gte: radio[0], $lt: radio[1] }
    // });
    // const tours = await Tour.find({
    //   category: ["64d792253d7b422db01fe7d5"],
    //   price: { $gte: radio[0], $lt: radio[1] }
    // });
    // const products = await Tour.find({
    //   category: ["64d792173d7b422db01fe7d2", "64d792203d7b422db01fe7d4"],
    //   price: { $gte: 10, $lt: 59 }
    // });


    console.log("tours found in filtered tours query => ", tours.length);
    res.json(tours);


  } catch (err) {
    console.log(err);
  }
});

exports.toursCount = catchAsync(async (req, res) => {
  try {

    const total = await Tour.find({}).estimatedDocumentCount();

    res.json(total);
  } catch (err) {
    console.log(err);
  }
});

exports.listTours = catchAsync(async (req, res) => {
  try {
    const perPage = process.env.PERPAGE * 1;
    console.log('perPage: ', perPage);
    const page = req.params.page ? req.params.page : 1;

    const tours = await Tour.find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.json(tours);
  } catch (err) {
    console.log(err);
  }
});

exports.toursSearch = catchAsync(async (req, res) => {
  try {
    const { keyword } = req.params;
    //console.log('keyword: ', keyword);
    // find the tours based on the keyword
    const results = await Tour.find({
      $or: [
        // i removes case cesnsitive
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { summary: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo");

    //console.log("results num =>", results.length);
    res.json(results);
  } catch (err) {
    console.log(err);
  }
});

exports.relatedTours = catchAsync(async (req, res) => {
  try {
    const { tourId, categoryId } = req.params;
    console.log(tourId, categoryId);
    const related = await Tour.find({
      category: categoryId,
      _id: { $ne: tourId },
    })
      .select("-photo")
      .populate("category")
      .limit(3);

    res.json(related);
  } catch (err) {
    console.log(err);
  }
});


// give token , response is a token
exports.getToken = catchAsync(async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (err) {
    console.log(err);
  }
});


// process payments
exports.processPayment = catchAsync(async (req, res) => {
  try {
    //console.log(req.body);

    // nonce is payment method
    // let nonce = req.body.nonce;

    const { nonce, cart } = req.body;

    let total = 0;

    cart.map((i) => {
      total += i.price;
    });

    //console.log("total => ", total);



    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,

        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          res.send(result);
          // create order and save it in database
          const order = new Order({
            products: cart, // only product._id saved
            payment: result,
            buyer: req.user._id
          }).save();
          // decrement quantity(stock) and increment sold
          //decrementQuantity(cart);
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
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


// this part is added for test Github
