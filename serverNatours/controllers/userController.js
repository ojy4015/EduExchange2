import User from './../models/userModel.js';
import catchAsync from './../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import * as factory from './handlerFactory.js';

// middleware function for req.params.id = req.user.id;
const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};


const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.json(null);
});


const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

// thanks to closure, do not update password with this!
const updateUser = factory.updateOne(User);
// thanks to closure
const getUser = factory.getOne(User);
const getAllUsers = factory.getAll(User);

// thanks to closure, only admin can delete user
const deleteUser = factory.deleteOne(User);

export {getMe, deleteMe, createUser, updateUser, getUser, getAllUsers, deleteUser}

