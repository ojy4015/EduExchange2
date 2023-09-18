import Tour from './../models/tourModel.js';
import catchAsync from './../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import * as factory from './handlerFactory.js';
import braintree from "braintree";
import fs from 'fs';
import dotenv from 'dotenv';
import Order from '../models/orderModel.js';
import * as config from "../config.js";
import { emailTemplate } from "../helpers/email.js";

dotenv.config({ path: './config.env' });

export const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

export const getTourStats = catchAsync(async (req, res, next) => {
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

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
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
// export const getTour = factory.getOne(Tour, { path: 'reviews' });



// export const getAllTours = factory.getAll(Tour);
const createTour = factory.createOne(Tour);
//exports.createTour = factory.create();
export const updateTour = factory.updateOne(Tour);
export const deleteTour = factory.deleteOne(Tour);


export const getToursWithin = catchAsync(async (req, res, next) => {
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

export const getDistances = catchAsync(async (req, res, next) => {
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


// export const create = async (req, res, next) => {
//   //console.log("in tourController: " + req.files, req.fields);

//   try {
//     const { category, name, duration, maxGroupSize, description, difficulty, ratingsAverage, ratingsQuantity, price, priceDiscount, quantity, sold, summary } = req.fields;
//     const { photo } = req.files;

//     //validation
//     switch (true) {
//       case !name.trim():
//         return res.json({ error: "Name is required" });
//       case !duration.trim():
//         return res.json({ error: "duration is required" });
//       case !maxGroupSize.trim():
//         return res.json({ error: "maxGroupSize is required" });
//       case !description.trim():
//         return res.json({ error: "Description is required" });
//       case !difficulty.trim():
//         return res.json({ error: "difficulty is required" });
//       case !ratingsAverage.trim():
//         return res.json({ error: "ratingsAverage is required" });
//       case !ratingsQuantity.trim():
//         return res.json({ error: "ratingsQuantity is required" });
//       case !price.trim():
//         return res.json({ error: "Price is required" });
//       case !category.trim():
//         return res.json({ error: "Category is required" });
//       case !priceDiscount.trim():
//         return res.json({ error: "priceDiscount is required" });
//       case !quantity.trim():
//         return res.json({ error: "quantity is required" });
//       case !sold.trim():
//         return res.json({ error: "sold is required" });
//       case !summary.trim():
//         return res.json({ error: "summary is required" });
//       //   case !shipping.trim():
//       //     return res.json({ error: "Shipping is required" });
//       case photo && photo.size > 1000000: //1Mbyte
//         return res.json({ error: "Image should be less than 1mb in size" });
//     }

export const create = async (req, res, next) => {
  //console.log("in tourController: " + req.files, req.fields);

  try {
    // const { name, duration, maxGroupSize, description, difficulty, ratingsAverage, ratingsQuantity, price, priceDiscount, quantity, sold, summary } = req.body;

    //validation
    // switch (true) {
    //   case !name.trim():
    //     return res.json({ error: "Name is required" });
    //   case !duration.trim():
    //     return res.json({ error: "duration is required" });
    //   case !maxGroupSize.trim():
    //     return res.json({ error: "maxGroupSize is required" });
    //   case !description.trim():
    //     return res.json({ error: "Description is required" });
    //   case !difficulty.trim():
    //     return res.json({ error: "difficulty is required" });
    //   case !ratingsAverage.trim():
    //     return res.json({ error: "ratingsAverage is required" });
    //   case !ratingsQuantity.trim():
    //     return res.json({ error: "ratingsQuantity is required" });
    //   case !price.trim():
    //     return res.json({ error: "Price is required" });
    //   case !category.trim():
    //     return res.json({ error: "Category is required" });
    //   case !priceDiscount.trim():
    //     return res.json({ error: "priceDiscount is required" });
    //   case !quantity.trim():
    //     return res.json({ error: "quantity is required" });
    //   case !sold.trim():
    //     return res.json({ error: "sold is required" });
    //   case !summary.trim():
    //     return res.json({ error: "summary is required" });
    //   //   case !shipping.trim():
    //   //     return res.json({ error: "Shipping is required" });
    //   case photo && photo.size > 1000000: //1Mbyte
    //     return res.json({ error: "Image should be less than 1mb in size" });
    // }

    // create tour
    const tour = new Tour({ ...req.body });

    // if (photo) {
    //   tour.photo.data = fs.readFileSync(photo.path);
    //   tour.photo.contentType = photo.type;
    // }

    await tour.save();
    res.json(tour);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};


export const update = async (req, res, next) => {

  try {
    const { category, name, duration, maxGroupSize, description, difficulty, ratingsAverage, ratingsQuantity, price, priceDiscount, quantity, sold, summary } = req.fields;

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
      case !quantity.trim():
        return res.json({ error: "quantity is required" });
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
};

export const photo = catchAsync(async (req, res, next) => {
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

// export const select = catchAsync(async (req, res, next) => {

//   try {
// console.log("Object.keys(req.params)[0] : ",Object.keys(req.params)[0]);
//     switch(Object.keys(req.params)[0]) {
//       case slug:
//           read();
//           return;
//       case id:
//           getTour();
//           return;
//       }
//       next();
//   } catch (err) {
//     console.log(err);
//   }
// });

export const read = catchAsync(async (req, res) => {

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

export const getTour = catchAsync(async (req, res) => {

  // get info about guides only in the query, but no writing in the database
  // const tour = await Tour.findById(req.params.id).populate('guides');

  try {
    // virtual populate(tour being populated with reviews)
    const tour = await Tour.findById(req.params.id)
      .select("-photo")
      .populate('reviews');

    res.json(tour);
  } catch (err) {
    console.log(err);
  }
});

export const getAllTours = catchAsync(async (req, res) => {

  // get info about guides only in the query, but no writing in the database
  // const tour = await Tour.findById(req.params.id).populate('guides');

  try {
    const tours = await Tour.find({})
      .select("-photo")
      // .populate({
      //   path: "guides",
      //   select: '-__v'
      // })
      .sort({ createdAt: -1 });

    res.json(tours);
  } catch (err) {
    console.log(err);
  }
});

export const filteredTours = catchAsync(async (req, res) => {

  try {
    // console.log("inside filteredTours");
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


    console.log("tours found in filtered tours query => ", tours.length);
    res.json(tours);


  } catch (err) {
    console.log(err);
  }
});

export const toursCount = catchAsync(async (req, res) => {
  try {

    const total = await Tour.find({}).estimatedDocumentCount();

    res.json(total);
  } catch (err) {
    console.log(err);
  }
});

export const listTours = catchAsync(async (req, res) => {
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

export const toursSearch = catchAsync(async (req, res) => {
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

export const relatedTours = catchAsync(async (req, res) => {
  try {
    const { tourId, categoryId } = req.params;
    // console.log(tourId, categoryId);
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
export const getToken = catchAsync(async (req, res) => {
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
export const processPayment = catchAsync(async (req, res) => {
  try {
    //console.log(req.body);

    // nonce is payment method
    // let nonce = req.body.nonce;

    const { nonce, cart } = req.body;

    let total = 0;

    cart.map((i) => {
      total += i.price;
    });

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
          decrementQuantity(cart);
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

const decrementQuantity = async (cart) => {
  try {
    console.log("cart : ", cart);
    //build mongodb query
    const bulkOps = cart.map((item) => {
      return {
        updateOne: {
          filter: { _id: item._id },
          update: { $inc: { quantity: -0, sold: +1 } },
        },
      };
    });

    const updated = await Tour.bulkWrite(bulkOps, {});
    console.log("bulk updated", updated);
  } catch (err) {
    console.log(err);
  }
};

export const orderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("buyer", "email name");

    // prepare email


    // send email
    config.AWSSES.sendEmail(

      emailTemplate(order.buyer.email, `     
      <h1>Hi ${order.buyer.name}, Your order's status is: <span style="color:red;">${order.status}</span></h1>
      <p>Visit <a href="${process.env.CLIENT_URL}/login">your Orders Page</a> for more details</p>
    `,
        config.REPLY_TO, "Order Status"),
      (err, data) => {
        if (err) {
          console.log(err);
          return res.json({ ok: false });
        } else {
          console.log(data);
          return res.json({ ok: true });
        }
      });

    // res.json(order);
  } catch (err) {
    console.log(err);
  }
};