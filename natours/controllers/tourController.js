const Tour = require('../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./factoryHandler');
const { ObjectId } = require('mongodb');

exports.aliasTopCheaps = (req, res, next) => {
  req.query.sort = 'ratingsAvarage,price';
  req.query.fields = 'name,price,ratingsAvarage,summary';
  req.query.limit = '5';
  next();
};

exports.checkID = (req, res, next, val) => {
  if (!ObjectId.isValid(val)) {
    return next(new AppError('We could not find any tour with this ID', 404));
  }

  next();
};

exports.getTours = factory.getAll(Tour);
exports.createTour = factory.createDoc(Tour);
exports.getTourById = factory.getOne(Tour, { path: 'reviews' });
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAvarage: { $gte: 0 } },
    },
    {
      $group: {
        _id: '$difficulty',
        amount: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAvarage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      tourStats: stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    totals: plan.length,
    data: {
      plan,
    },
  });
});

exports.getTourBySlug = catchAsync(async (req, res, next) => {
  const tour = await Tour.find({ slug: req.params.slug });

  if (!tour) {
    return next(new AppError('We could not find that tour', 400));
  }

  res.status(200).json({
    status: 'success',
    tour,
  });
});
