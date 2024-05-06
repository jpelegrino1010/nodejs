const AppError = require('./../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR ', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wront, we will contact the administrator',
    });
  }
};

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateField = (err) => {
  const message = `Sorry the field ${Object.keys(err.keyValue)} is unique`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const message = err._message;
  return new AppError(message, 400);
};

const handleTokenError = () =>
  new AppError('Invalid token please try again', 401);

const handleExprireToken = () =>
  new AppError('Your token has been exprired please login again!', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.kind === 'ObjectId') {
      error = handleCastError(error);
    }

    if (error.code === 11000) {
      error = handleDuplicateField(error);
    }

    if (error._message === 'Validation failed') {
      error = handleValidationError(error);
    }

    if (error.name === 'JsonWebTokenError') error = handleTokenError();

    if (error.name === 'TokenExpiredError') error = handleExprireToken();

    sendErrorProd(error, res);
  }
};
