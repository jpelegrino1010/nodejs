const express = require('express');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/appError');
const GlobalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const hemlet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

// Set security HTTP Headers
app.use(hemlet());

// json body request parser req.body
app.use(express.json());

// Data clean up
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

// Logging development
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

app.use(cookieParser());

// Api Routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// Serving static files
app.use(express.static(`${__dirname}/public`));

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error Handling
app.use(GlobalErrorHandler);

module.exports = app;
