import User from './../models/userModel.js';
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

