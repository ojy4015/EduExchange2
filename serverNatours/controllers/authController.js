import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from './../models/userModel.js';
import catchAsync from './../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import sendEmail from './../utils/email.js';
import * as config from "../config.js";

//////////////////////////////////////////////////////to be modified
import { hashPassword, comparePassword } from "../helpers/auth.js";

/////////////////////////////////////////////////////////////////

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  // onyly when using https://
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  // res.status(statusCode).json({
  //   status: 'success',
  //   token,
  //   data: {
  //     user
  //   }
  // });

  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });

};

// send email to registe
const preSignup = catchAsync(async (req, res) => {
  // create jwt with email and password then email this token as clickable link
  // when user click on that email link, registeration complete

  // console.log(req.body);
  // const {email, password} = req.body;

  validation
  if (!validator.validate(email)) {
    return res.json({error: "A valid email is required"});
  }

  if(!password) {
    return res.json({error: "Password is required"});
  }
  if(password && password?.length < 6) {
    return res.json({error: "Password should be at least 6 characters"});
  }

    // check if email is already taken
  const user = await User.findOne({email});
  if (user) {
    return res.json({error: "email is taken"});
  }

  const token = jwt.sign({email, password}, config.JWT_SECRET, {
    expiresIn: config.JWT_TOKEN_EXPIRES_IN,
  });

  config.AWSSES.sendEmail(
    
    emailTemplate(email,`     
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
const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, photo, role } = req.body;

  //console.log(name, email, password, passwordConfirm, photo, role);
  const newUser = await User.create({
    // //req.body
    // name, email, password, passwordConfirm, photo, role
    name,
    email,
    password,
    passwordConfirm
  });

  createSendToken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
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

const protect = catchAsync(async (req, res, next) => {

  // 1) Getting token and check of it's there
  // let token;
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith('Bearer')
  // ) {
  //   token = req.headers.authorization.split(' ')[1];
  //   console.log('token in protect route: ', token);
  // }
  let token;

  token = req.headers.authorization;
  //console.log('token in protect route: ', token);

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token, decoded = {id: , iat: , exp: }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

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
  //console.log("req.user in protect: ", req.user);
  next();
});

// must preceded by a protect middle ware because of req.user = currentUser
const restrictTo = (...roles) => {
  // can access roles array becasue of closure
  return (req, res, next) => {
    // roles ['admin', 'lead-guide'] : has permission
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};


const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const { email } = req.body;
  // console.log("email in forgotPassword : ", { email });
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token(not encrypted one)
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  /////////////////////////////////////이메일을 보낼 수 없어 생략함////////////

  // // 3) Send it to user's email
  // const resetURL = `${req.protocol}://${req.get(
  //   'host'
  // )}/api/v1/users/resetPassword/${resetToken}`;

  // const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  // try {
  //   await sendEmail({
  //     email: user.email,
  //     subject: 'Your password reset token (valid for 10 min)',
  //     message
  //   });

  //   res.status(200).json({
  //     status: 'success',
  //     message: 'Token sent to email!'
  //   });
  // } catch (err) {
  //   user.passwordResetToken = undefined;
  //   user.passwordResetExpires = undefined;
  //   await user.save({ validateBeforeSave: false });

  //   return next(
  //     new AppError('There was an error sending the email. Try again later!'),
  //     500
  //   );
  // }
});

const resetPassword = catchAsync(async (req, res, next) => {
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
    return next(new AppError('Token is invalid or has expired', 400));
  }
  // user.password = req.body.password;
  // user.passwordConfirm = req.body.passwordConfirm;
  // user.passwordResetToken = undefined;
  // user.passwordResetExpires = undefined;
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  //console.log("currentPassword, newPassword, confirmNewPassword in backend=>", currentPassword, newPassword, confirmNewPassword)
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  //console.log('user=>', user.password);

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
const updateProfile = catchAsync(async (req, res) => {
  try {
    // const { name, password, address } = req.body;
    const { name, address } = req.body;
    const user = await User.findById(req.user._id);
    // check password length
    // if (password && password.length < 6) {
    //   return res.json({
    //     error: "Password is required and should be at least 6 characters long",
    //   });
    // }
    // hash the password, if anything undefined will not be saved in the database
    // const hashedPassword = password ? await hashPassword(password) : undefined;
    // console.log("hashedPassword = > ", hashedPassword);
    // console.log("user.password = > ", user.password);

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name, // user.name is existing name
        // password: hashedPassword || user.password,
        address: address || user.address,
      },
      {
        new: true,
        runValidators: true
      }
    );

    // don't want to send password
    // updated.password = undefined;
    res.json(updated);
  } catch (err) {
    console.log(err);
  }
});

export {preSignup, signup, login, protect, restrictTo, forgotPassword, resetPassword, updatePassword, updateProfile}
/////////////////////////////////////////////////////////////