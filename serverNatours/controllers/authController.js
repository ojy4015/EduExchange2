
import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from './../models/userModel.js';
import catchAsync from './../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import sendEmail from './../utils/email.js';
import * as config from "../config.js";
import { emailTemplate } from "../helpers/email.js";
// import {hashPassword, comparePassword} from '../helpers/auth.js';
import { nanoid } from 'nanoid';

//////////////////////////////////////////////////////to be modified
import { hashPassword, comparePassword } from "../helpers/auth.js";

/////////////////////////////////////////////////////////////////

const signToken = id => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: Date.now() + 7 * 24 * 60 * 60 * 1000
  });
};

// const signRefreshToken = id => {
//   return jwt.sign({ id }, config.JWT_SECRET, {
//     expiresIn: Date.now() + 168 * 24 * 60 * 60 * 1000
//   });
// };

const createSendToken = (user, statusCode, res) => {

  // 7 hour
  const token = jwt.sign({ id: user.id }, config.JWT_SECRET, {
    expiresIn: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  // const refreshToken = jwt.sign({ id: user.id }, config.JWT_SECRET, {
  //   expiresIn: Date.now() + 168 * 24 * 60 * 60 * 1000,
  // });

  const cookieOptions = {
    expires: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  // onyly when using https://
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    // refreshToken,
    user,
  });

};

// send email to registe
export const preSignup = catchAsync(async (req, res) => {
  // create jwt with email and password then email this token as clickable link
  // when user click on that email link, registeration complete

  // console.log(req.body);
  const { email, password } = req.body;

  if (!password) {
    return res.json({ error: "Password is required" });
  }
  if (password && password?.length < 8) {
    return res.json({ error: "Password should be at least 8 characters" });
  }

  // check if email is already taken
  const user = await User.findOne({ email });
  if (user) {
    return res.json({ error: "email is already taken" });
  }

  const token = jwt.sign({ email, password }, config.JWT_SECRET, {
    expiresIn: Date.now() + 7 * 24 * 60 * 60 * 1000
  });

  config.AWSSES.sendEmail(

    emailTemplate(email, `     
      <p>Please click the link below to activate your account.</p>
      <a href="${config.CLIENT_URL}/auth/account-activate/${token}">Activate my account</a>
    `,
      config.REPLY_TO, "Welcome to EduExchange"),
    (err, data) => {
      if (err) {
        console.log(err);
        return res.json({ ok: false });
      } else {
        console.log(data);
        return res.json({ ok: true });
      }
    });
});


// to register admin first create new normal user and go to compass, edit a role from a user to a admin
export const signup = catchAsync(async (req, res, next) => {
  // console.log(req.body);

  const { token } = req.body;

   const { email, password } = jwt.verify(token, config.JWT_SECRET);

  const newUser = await User.create({
    username: nanoid(6),
    email,
    password,
  });

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email) {
    return next(new AppError('Please provide email!', 400));
  }
  if (!password) {
    return next(new AppError('Please provide password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

export const protect = catchAsync(async (req, res, next) => {

  let token;

  token = req.headers.authorization;

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token, decoded = {id: , iat: , exp: }
  const decoded = await promisify(jwt.verify)(token, config.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;

  next();
});

export const currentUser = catchAsync(async (req, res, next) => {

  const user = await User.findById(req.user._id);

  if (!user) {
    next(new AppError('wrong!', 401));
  }

  user.password = undefined;
  user.resetCode = undefined;

  res.json(user);

});

// must preceded by a protect middle ware because of req.user = currentUser
export const restrictTo = (...roles) => {
  // can access roles array becasue of closure
  return (req, res, next) => {
    // roles ['admin', 'lead-guide'] : has permission
    if (!roles.includes(req.user.role[0])) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};


export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const { email } = req.body;
  // console.log("email in forgotPassword : ", { email });
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  } else {
    const resetCode = nanoid();
    user.resetCode = resetCode;
    user.save();

    const token = jwt.sign({ resetCode }, config.JWT_SECRET, {
      expiresIn: Date.now() + 7 * 24 * 60 * 60 * 1000
    });

    // send Email with token
    config.AWSSES.sendEmail(

      emailTemplate(email, `     
        <p>Please click the link below to access your account.</p>
        <a href="${config.CLIENT_URL}/auth/access-account/${token}">Access your account</a>
      `,
        config.REPLY_TO, "Access your account"),
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
});

export const accessAccount = catchAsync(async (req, res, next) => {
  //console.log(req.body);

  const { resetCode } = jwt.verify(req.body.resetCode, config.JWT_SECRET);

  // 1. find user by resetCpde and update resetCode=""
  const user = await User.findOneAndUpdate({ resetCode }, { resetCode: "" });

  // 2) If everything ok, send token to client
  createSendToken(user, 200, res);

});

// export const refreshToken = catchAsync(async (req, res, next) => {
 
//   const decoded = jwt.verify(req.headers.refresh_token, config.JWT_SECRET);
//   //console.log('decoded => ', decoded);

//   // decoded = { id: '64f66ec0a8a3713584acda20', iat: 1693981973, exp: 1699823155291 }

//   const user = await User.findById(decoded.id);

//   // 2) If everything ok, send token to client
//   createSendToken(user, 200, res);

// });

export const resetPassword = catchAsync(async (req, res, next) => {
  console.log('token : ', token);
  const { password, passwordConfirm } = req.body;
  console.log(password, passwordConfirm);
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 401));
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

// get anyuser without logged in
export const publicProfile = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username });

  user.password = undefined;
  user.resetCode = undefined;

  res.json(user);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword) {
    return res.json({ error: "current Password is required" });
  }
  if (newPassword && newPassword?.length < 8) {
    return res.json({ error: "Password should be min 8 characters" });
  }
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = newPassword;
  user.passwordConfirm = confirmNewPassword;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});

/////////////////////////////////////////////////////////////////// to be modified
// update name and address
export const updateProfile = async (req, res) => {
  try {
    // phone, photo can be modified
    const { name, address } = req.body;
    const user = await User.findById(req.user._id);

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name, // user.name is existing name
        address: address || user.address,
      },
      {
        new: true,
        runValidators: true
      }
    );

    // don't want to send password
    // updated.password = undefined;
    user.password = undefined;
    user.resetCode = undefined;
    res.json(updated);
  } catch (err) {
    console.log(err);
    // username and email is unique
    if (err.codeName === "DuplicateKey") {
      return res.json({ error: "username or email is already taken" });
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }
  }
};

/////////////////////////////////////////////////////////////