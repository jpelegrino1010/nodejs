const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

const genToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, status, res) => {
  const token = genToken(user._id);

  user.password = undefined;
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(status).json({
    status: 'success',
    data: {
      user,
      token,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    ...req.body,
  });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return next(new AppError('Provide an email or password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  console.log(req.cookies);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // 1) Validate token
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401),
    );
  }

  // 2) Verification token
  const encode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if the user still exists

  const freshUser = await User.findById(encode.id);

  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token is not longer exists',
        401,
      ),
    );
  }

  if (freshUser.passwordChangeAfter(encode.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  }

  req.user = freshUser;

  next();
});

exports.isLogedIn = catchAsync(async (req, res, next) => {
  if (!req.session.email) {
    return res.json({ valid: false });
  }

  res.status(200).json({
    email: req.session.email,
    valid: true,
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  req.session.destroy((err) => {
    if (err) {
      return next(new AppError(err.message, 500));
    } else {
      res.json({ valid: false });
    }
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  console.log(req.cookies);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // 1) Validate token
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401),
    );
  }

  // 2) Verification token
  const encode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if the user still exists

  const freshUser = await User.findById(encode.id);

  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token is not longer exists',
        401,
      ),
    );
  }

  if (freshUser.passwordChangeAfter(encode.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  }

  req.user = freshUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'User do not have enugh permission to perform this action',
          403,
        ),
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get User based on Posted email

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('User could not be found in our database', 404));
  }

  // 2) Generate the random reset Token

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetUrl = `${req.protocol}://${req.get('host')}/api/user/resetPassword/${resetToken}`;

  const message = `Forgot your password please submit a PATCH request with your new password and passwordConfig to:
   ${resetUrl} \nIf you din't forget your password, please igone this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (Valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    console.error(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('The was an error sending email', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const loginUser = req.user;
  const user = await User.findById(loginUser.id).select('+password');
  const typeCurrentPassword = await user.correctPassword(
    req.body.currentPassword,
    user.password,
  );
  // 2) Check if Posted currect password is correct
  if (!typeCurrentPassword) {
    return next(
      new AppError('Sorry your password did not match with the logined', 400),
    );
  }
  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();
  // 4) Log user in send JWT

  createSendToken(user, 200, res);
});
