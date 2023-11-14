import Tour from './../models/tourModel.js';
import User from './../models/userModel.js';
import Category from './../models/categoryModel.js';

import catchAsync from './../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import * as factory from './handlerFactory.js';
import braintree from "braintree";
import fs from 'fs';
import dotenv from 'dotenv';
import Order from '../models/orderModel.js';
import * as config from "../config.js";
import { emailTemplate } from "../helpers/email.js";
import slugify from 'slugify';


import { nanoid } from 'nanoid';

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

export const createforTour = async (req, res, next) => {


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
};


// export const update = async (req, res, next) => {

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

//     // create tour
//     // const tour = new Tour({ ...req.fields });

//     // update product
//     const tour = await Tour.findByIdAndUpdate(
//       req.params.id,
//       {
//         ...req.fields
//       },
//       { new: true }
//     );

//     if (photo) {
//       tour.photo.data = fs.readFileSync(photo.path);
//       tour.photo.contentType = photo.type;
//     }

//     await tour.save();
//     res.json(tour);
//   } catch (err) {
//     console.log(err);
//     return res.status(400).json(err.message);
//   }
// };

export const update = async (req, res) => {
  try {
    const { photos, price, type, address, description, title } = req.body;

    console.log("title : ", title);

    const tour = await Tour.findById(req.params.id);

    // req.user._id : currently logged person, tour?.postedBy : the person who made this tour

    const owner = (JSON.stringify(req.user._id) === JSON.stringify(tour?.postedBy));

    // console.log("req.user._id : ", JSON.stringify(req.user._id));
    // console.log("tour?.postedBy : ", JSON.stringify(tour?.postedBy));

    console.log("owner : ", owner);

    if (!owner) {
      return res.json({ error: "Permission denied" });
    } else {
      // validation
      if (!photos.length) {
        return res.json({ error: "Photos are required" });
      }
      if (!price) {
        return res.json({ error: "price is required" });
      }
      if (!type) {
        return res.json({ error: "Is property house or land?" });
      }
      if (!address) {
        return res.json({ error: "address is required" });
      }
      if (!description) {
        return res.json({ error: "description is required" });
      }

      // if address is changed geo code must be updated
      const geo = await config.GOOGLE_GEOCODER.geocode(address);

      await tour.updateOne(
        {
          $set:
          {
            ...req.body,
            slug: tour.slug, //no change
            location: {
              type: "Point",
              coordinates: [geo?.[0]?.longitude, geo?.[0]?.latitude],
            },
            name: title // title is converted into name in model 
          }
        }
      );


      res.json({ ok: true });
    }
  } catch (err) {
    console.log(err);
    res.json({ error: "Something went wrong. Try again." });
  }
};

export const remove = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    // req.user._id : currently logged person, tour?.postedBy : the person who made this tour

    const owner = (JSON.stringify(req.user._id) === JSON.stringify(tour?.postedBy));

    // console.log("req.user._id : ", JSON.stringify(req.user._id));
    // console.log("tour?.postedBy : ", JSON.stringify(tour?.postedBy));

    // console.log("owner : ", owner);

    if (!owner) {
      return res.json({ error: "Permission denied" });
    } else {
      await Tour.findByIdAndDelete(tour._id);
      res.json({ ok: true });
    }
  } catch (err) {
    console.log(err);
    res.json({ error: "Something went wrong. Try again." });
  }
};


export const read = catchAsync(async (req, res) => {

  try {
    //console.log("params.slug=> ", req.params.slug);
    const tour = await Tour.findOne({ slug: req.params.slug }).populate("postedBy", "name username email phone photo.Location");

    // console.log("tour in read ", tour);

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

    const tours = await Tour.find({});
    // .select("-photo")
    // .populate({
    //   path: "guides",
    //   select: '-__v'
    // })
    // .sort({ createdAt: -1 });

    res.json(tours);
  } catch (err) {
    console.log(err);
  }
});

export const getAllFeaturedTours = factory.getAll(Tour);

export const filteredTours = catchAsync(async (req, res) => {

  try {
    // console.log("inside filteredTours");
    const { checked, radio } = req.body;


    let args = {}; // [20, 39] radio[0]=20, radio[1]=39
    if (checked.length > 0) args.categoryIn = checked; // add category property to the args object
    // if (checked.length > 0) args.category[0] = checked; // add category property to the args object
    if (radio.length > 0) args.price = { $gte: radio[0], $lte: radio[1] }; // add price property to the args object

    console.log("args => ", args);
    // console.log("args.category: => ", args.category);
    // console.log("args.price: => ", args.price);

    const tours = await Tour.find(args)
      .select("-photo")
      .populate("categoryIn");


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
        { name: { $regex: `${keyword}`, $options: "i" } },
        { description: { $regex: `${keyword}`, $options: "i" } },
        { summary: { $regex: `${keyword}`, $options: "i" } },
      ],
    }).select("-photo");

    //console.log("results num =>", results.length);
    res.json(results);
  } catch (err) {
    console.log(err);
  }
});

export const searchNew = async (req, res) => {
  try {
    // console.log("req query : ", req.query);
    const { action, address, type, priceRange } = req.query;

    console.log("action, address, type, priceRange => ", action, address, type, priceRange);

    // if address is changed geo code must be updated
    const geo = await config.GOOGLE_GEOCODER.geocode(address);

    // how we can find the ads based on the nearby loaction
    const ads = await Tour.find({
      action: action === "Buy" ? "Sell" : "Rent",
      type,
      price: {
        $gte: parseInt(priceRange[0]),
        $lte: parseInt(priceRange[1]),
      },
      location: {
        $near: {
          $maxDistance: 50000, // 1000m = 1km
          $geometry: {
            type: "Point",
            coordinates: [geo?.[0]?.longitude, geo?.[0]?.latitude],
          },
        }
      }
    }).limit(24).sort({ cteatedAt: -1 }).select('-photos.key -photos.Key -photos.ETag, -photos.Bucket -location -googleMap');

    console.log("ads : ", ads);

    res.json(ads);

  } catch (err) {
    console.log(err);
    res.json({ error: "Something went wrong in searching. Try again." });
  }

};




export const relatedTours = catchAsync(async (req, res) => {
  try {
    const { tourId, categoryId } = req.params;
    const related = await Tour.find({
      categoryIn: categoryId,
      _id: { $ne: tourId },
    })
      .select("-photo")
      .populate("categoryIn")
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
    ).populate("buyers", "email name");

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

export const photo = catchAsync(async (req, res, next) => {
  try {
    //console.log("id in photo: ", req.params.photoId);
    const product = await Tour.findById(req.params.photoId);

    const photo = product.photos[0].Location;

    console.log("photo : ", photo);

    return res.send(photo);

  } catch (err) {
    console.log(err);
  }
});

export const uploadImage = async (req, res) => {
  try {
    // console.log(req.body);
    const { image } = req.body;

    const base64Image = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""), "base64"
    );

    const type = image.split(";")[0].split("/")[1];

    // image params
    const params = {
      Bucket: "hyung-aws-bucket",
      Key: `${nanoid()}.${type}`,
      Body: base64Image,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };

    config.AWSS3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      } else {
        // console.log(data);
        res.send(data);
      }
    });

  } catch (err) {
    console.log(err);
    res.json({ error: "Upload failed. Try again." });

  }
}

export const removeImage = async (req, res) => {
  try {
    // console.log(req.body);
    const { Key, Bucket } = req.body;

    config.AWSS3.deleteObject({ Bucket, Key }, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      } else {
        // console.log(data);
        res.send({ ok: true });
      }
    });

  } catch (err) {
    console.log(err);
    res.json({ error: "Upload failed. Try again." });

  }
}

export const create = async (req, res) => {
  try {
    // console.log(req.body);
    // const { photos, description, name, address, price, type, landsize, ratingsAverage, ratingsQuantity, quantity, sold, title } = req.body;

    console.log("req.body => ", req.body);
    console.log("req.body.category => ", req.body.category);
    // const { category} = req.fields;
    // console.log("req.fields=> ",req.fields);

    if (!req.body.ad.photos?.length) {
      return res.json({ error: "Photos are required" });
    }
    if (!req.body.ad.price) {
      return res.json({ error: "Price is required" });
    }
    if (!req.body.ad.type) {
      return res.json({ error: "Is property house or land?" });
    }
    if (!req.body.ad.address) {
      return res.json({ error: "Address is required" });
    }
    if (!req.body.ad.description) {
      return res.json({ error: "Description is required" });
    }

    const geo = await config.GOOGLE_GEOCODER.geocode(req.body.ad.address);
    // console.log("geo => ", geo);


    const ad = await new Tour({
      ...req.body.ad,
      categoryIn: req.body.category,
      postedBy: req.user._id,
      // categoryIn: req. ? ,
      location: {
        type: "Point",
        coordinates: [geo?.[0]?.longitude, geo?.[0]?.latitude],
      },
      googleMap: geo,
      slug: slugify(`${req.body.ad.type}-${req.body.ad.address}-${req.body.ad.price}-${nanoid(6)}`)
    }).save();

    // make user role -> "Seller"
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { role: "Seller" },
      },
      { new: true }
    );

    user.password = undefined;
    user.resetCode = undefined;

    // find the category
    const categoryId = await Category.findById(req.body.category);
    console.log("categoryId : ", categoryId._id);

    // grap this user and update it to reflect this user in localstorage and context before it logged again by doing in the client side 

    res.json({
      ad,
      user,
      categoryId
    });
  } catch (err) {
    console.log(err);
    res.json({ error: "Something went wrong. Try again." });
  }
};


export const ads = async (req, res) => {
  try {
    //console.log("req.body : ", req.body);
    const adsForSell = await Tour.find({ action: "Sell" }).select('-googleMap -location -photo.Key -photo.key, -photo.ETag').sort({ createdAt: -1 }).limit(12);

    const adsForRent = await Tour.find({ action: "Rent" }).select('-googleMap -location -photo.Key -photo.key, -photo.ETag').sort({ createdAt: -1 }).limit(12);

    res.json({ adsForSell, adsForRent });

  } catch (err) {
    console.log(err);
    res.json({ error: "Something went wrong. Try again." });
  }
};

export const adsForSell = async (req, res) => {
  try {
    //console.log("req.body : ", req.body);
    const ads = await Tour.find({ action: "Sell" }).select('-googleMap -location -photo.Key -photo.key, -photo.ETag').sort({ createdAt: -1 }).limit(24);

    res.json(ads);

  } catch (err) {
    console.log(err);
    res.json({ error: "Something went wrong. Try again." });
  }
};
export const adsForRent = async (req, res) => {
  try {

    const ads = await Tour.find({ action: "Rent" }).select('-googleMap -location -photo.Key -photo.key, -photo.ETag').sort({ createdAt: -1 }).limit(12);

    res.json(ads);

  } catch (err) {
    console.log(err);
    res.json({ error: "Something went wrong. Try again." });
  }
};

export const wishlist = async (req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;

    // currently logged in user
    const user = await User.findById(req.user._id);

    // currently logged in user's wishlist
    const tours = await Tour.find({ _id: user.wishlist })
      .select('-photos.Key -photos.key -photos.ETag -photos.Bucket -location -googleMap')
      .populate('postedBy', 'name email username phone')
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const total = tours.length;

    res.json({ tours, total: total });
  } catch (err) {
    console.log(err);
    res.json({ error: "Something went wrong. Try again." });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { wishlist: req.body.productId },
      },
      { new: true }
    );
    // send everything except password and resetCode
    const { password, resetCode, ...rest } = user._doc;

    res.json(rest);
  } catch (err) {
    console.log(err);
    res.json({ error: "Something went wrong. Try again." });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { wishlist: req.params.productId },
      },
      { new: true }
    );

    const { password, resetCode, ...rest } = user._doc;

    res.json(rest);
  } catch (err) {
    console.log(err);
    res.json({ error: "Something went wrong. Try again." });
  }
};

export const enquiries = async (req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;

    // currently logged in user
    const user = await User.findById(req.user._id);

    // currently logged in user's wishlist
    const tours = await Tour.find({ _id: user.enquiredProperties })
      .select('-photos.Key -photos.key -photos.ETag -photos.Bucket -location -googleMap')
      .populate('postedBy', 'name email username phone')
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const total = tours.length;

    res.json({ tours, total: total });
  } catch (err) {
    console.log(err);
    res.json({ error: "Something went wrong. Try again." });
  }
};

export const addToEnquiries = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { enquiredProperties: req.body.productId },
      },
      { new: true }
    );
    // send everything except password and resetCode
    const { password, resetCode, ...rest } = user._doc;

    res.json(rest);
  } catch (err) {
    console.log(err);
    res.json({ error: "Something went wrong. Try again." });
  }
};

// no meaning because can't cancel sended email
export const removeFromEnquiries = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { enquiredProperties: req.params.productId },
      },
      { new: true }
    );

    const { password, resetCode, ...rest } = user._doc;

    res.json(rest);
  } catch (err) {
    console.log(err);
    res.json({ error: "Something went wrong. Try again." });
  }
};

export const contactSeller = async (req, res) => {
  try {
    const { name, email, message, phone, productId } = req.body;

    // owner email
    const tour = await Tour.findById(productId).populate("postedBy", "email");

    const user = await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { enquiredProperties: productId }
    });
    if (!user) {
      return res.json({ error: "Could not find user with that email" });
    } else {
      // send email to the owner
      config.AWSSES.sendEmail(

        emailTemplate(
          tour.postedBy.email, `     
        <p>You have received a new customer enquiry</p>

          <h4>Customer details</h4>
          <p>Name: ${name}</p>
          <p>Email: ${email}</p>
          <p>Phone: ${phone}</p>
          <p>Message: ${message}</p>

        <a href="${config.CLIENT_URL}/product/${tour.slug}">${tour.type} in ${tour.address} for ${tour.action} ${tour.price}</a>
      `,
          email,
          "New enquiry received"
        ),
        (err, data) => {
          if (err) {
            console.log(err);
            return res.json({ ok: false });
          } else {
            console.log(data);
            return res.json({ ok: true });
          }
        });
    }
  } catch (err) {
    console.log(err);
    res.json({ error: "Something went wrong. Try again." });
  }
};

export const userTours = async (req, res) => {
  try {

    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;

    const total = await Tour.find({ postedBy: req.user._id });
    console.log('total : ', total);

    const tours = await Tour.find({ postedBy: req.user._id })
      .select('-photos.Key -photos.key -photos.ETag -photos.Bucket -location -googleMap')
      .populate('postedBy', 'name email username phone')
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.json({ tours, total: total.length });
  } catch (err) {
    console.log(err);
    res.json({ error: "Something went wrong. Try again." });
  }
};