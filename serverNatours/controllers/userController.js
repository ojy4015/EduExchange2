import User from './../models/userModel.js';
import Tour from './../models/tourModel.js';
import catchAsync from './../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import * as factory from './handlerFactory.js';
import Order from "../models/orderModel.js";

// middleware function for req.params.id = req.user.id;
export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};


export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.json(null);
});


export const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

export const getOrders = catchAsync(async (req, res) => {

  const orders = await Order.find({ buyer: req.user._id })
    .populate(
      "products",
      "-photo"
    )
    .populate("buyer", "name");

  res.json(orders);
});

export const getAllOrders = catchAsync(async (req, res) => {

  const orders = await Order.find({})
    .populate("products", "-photo")
    .populate("buyer", "name")
    .sort({ createdAt: "-1" });

  res.json(orders);
});

// thanks to closure, do not update password with this!
export const updateUser = factory.updateOne(User);
// thanks to closure
export const getUser = factory.getOne(User);
export const getAllUsers = factory.getAll(User);

// thanks to closure, only admin can delete user
export const deleteUser = factory.deleteOne(User);

// all agents
export const agents = async (req, res) => {
  try {
    const agents = await User.find({ role: 'Seller' }).select('-password -role -enquiredProperties -wishlist -photo.key -photo.Key -photo.Bucket');

    res.json(agents);
  } catch (err) {
    console.log(err);
  }
}

// all properties each agent created: _id: agent's id
export const agentAdCount = async (req, res) => {
  try {
    const tours = await Tour.find({ postedBy: req.params._id }).select("_id");
    res.json(tours);
  } catch (err) {
    console.log(err);
  }
}

// show each agent's info, username: agent's usernames
export const agent = async (req, res) => {
  try {
    // agent(seller)
    const user = await User.findOne({ username: req.params.username }).select('-password -role -enquiredProperties -wishlist -photo.key -photo.Key -photo.Bucket');

    // all the tours created by this agent(seller)
    const tours = await Tour.find({ postedBy: user._id }).select(
      "-photos.key -photos.Key -photos.ETag -photos.Bucket -location -googleMap"
    );
    res.json({ user, tours });
  } catch (err) {
    console.log(err);
  }
}

