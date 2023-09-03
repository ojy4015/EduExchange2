//////////////////////////////////////////////////////////////////////////

const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const ObjectId = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required:true,
      unique: true,
      lowercae: true,
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      maxLength: 256,
      minlength: 8,
      select: false
      //  const user = await User.findOne({ email }).select('+password') <=when you need password
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!'
      }
    },
    address: {
      type: {},
      trim: true,
      default: null
    },
    phone: { type: String, default: "" },
    photo: {},
    role: {
      type: [String],
      default: ["Buyer"],
      enum: ["Buyer", "Seller", "Admin"],
    },
    // enquiredProperties: [{ type: ObjectId, ref: "Ad" }],
    // wishlist: [{ type: ObjectId, ref: "Ad" }],
    resetCode: {
      type: String,
      default: "",
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    },
  },
  { timestamps: true }
);

// document middleware
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// query middleware
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// instance method avaiable on all documents of a certain collection
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// instance method
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

// instance method
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // save this encrypted token in database so that we can campare it with the token user provide
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // ({ resetToken }=>plain token to send with email, this.passwordResetToken => encrypted one in db)
  console.log({ resetToken }, this.passwordResetToken);

  // now + 10min
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  console.log(this.passwordResetExpires);

  // return plain resetToken
  return resetToken;
};

const User = mongoose.model('User', userSchema);


module.exports = User;


/////////////////original(2023.09.03)///////////////

// const crypto = require('crypto');
// const mongoose = require('mongoose');
// const validator = require('validator');
// const bcrypt = require('bcrypt');
// const ObjectId = require('mongoose');

// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       trim: true,
//       required:true,
//       unique: true,
//       lowercae: true,
//     },
//     name: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//     email: {
//       type: String,
//       trim: true,
//       required: [true, 'Please provide your email'],
//       unique: true,
//       lowercase: true,
//       validate: [validator.isEmail, 'Please provide a valid email']
//     },
//     password: {
//       type: String,
//       required: [true, 'Please provide a password'],
//       maxLength: 256,
//       minlength: 8,
//       select: false
//       //  const user = await User.findOne({ email }).select('+password') <=when you need password
//     },
//     passwordConfirm: {
//       type: String,
//       required: [true, 'Please confirm your password'],
//       validate: {
//         // This only works on CREATE and SAVE!!!
//         validator: function (el) {
//           return el === this.password;
//         },
//         message: 'Passwords are not the same!'
//       }
//     },
//     address: {
//       type: {},
//       trim: true,
//       default: null
//     },
//     phone: { type: String, default: "" },
//     photo: {},
//     role: {
//       type: [String],
//       default: ["Buyer"],
//       enum: ["Buyer", "Seller", "Admin"],
//     },
//     // enquiredProperties: [{ type: ObjectId, ref: "Ad" }],
//     // wishlist: [{ type: ObjectId, ref: "Ad" }],
//     resetCode: {
//       type: String,
//       default: "",
//     },
//     passwordChangedAt: Date,
//     passwordResetToken: String,
//     passwordResetExpires: Date,
//     active: {
//       type: Boolean,
//       default: true,
//       select: false
//     },
//   },
//   { timestamps: true }
// );

// // document middleware
// userSchema.pre('save', async function (next) {
//   // Only run this function if password was actually modified
//   if (!this.isModified('password')) return next();

//   // Hash the password with cost of 12
//   this.password = await bcrypt.hash(this.password, 12);

//   // Delete passwordConfirm field
//   this.passwordConfirm = undefined;
//   next();
// });

// userSchema.pre('save', function (next) {
//   if (!this.isModified('password') || this.isNew) return next();

//   this.passwordChangedAt = Date.now() - 1000;
//   next();
// });

// // query middleware
// userSchema.pre(/^find/, function (next) {
//   // this points to the current query
//   this.find({ active: { $ne: false } });
//   next();
// });

// // instance method avaiable on all documents of a certain collection
// userSchema.methods.correctPassword = async function (
//   candidatePassword,
//   userPassword
// ) {
//   return await bcrypt.compare(candidatePassword, userPassword);
// };

// // instance method
// userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
//   if (this.passwordChangedAt) {
//     const changedTimestamp = parseInt(
//       this.passwordChangedAt.getTime() / 1000,
//       10
//     );

//     return JWTTimestamp < changedTimestamp;
//   }

//   // False means NOT changed
//   return false;
// };

// // instance method
// userSchema.methods.createPasswordResetToken = function () {
//   const resetToken = crypto.randomBytes(32).toString('hex');

//   // save this encrypted token in database so that we can campare it with the token user provide
//   this.passwordResetToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');

//   // ({ resetToken }=>plain token to send with email, this.passwordResetToken => encrypted one in db)
//   console.log({ resetToken }, this.passwordResetToken);

//   // now + 10min
//   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

//   console.log(this.passwordResetExpires);

//   // return plain resetToken
//   return resetToken;
// };

// const User = mongoose.model('User', userSchema);


// module.exports = User;
