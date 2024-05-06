const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      require: [true, 'Most have a review'],
    },
    rating: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      require: [true, 'review most belong to a user'],
    },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      require: [true, 'review most belong to a tour'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Query middleware
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  });

  next();
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.statics.calcCountAndAvg = async function (tourId) {
  const stat = await this.aggregate([
    { $match: { tour: tourId } },

    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        ratingAvg: { $avg: '$rating' },
      },
    },
  ]);

  if (stat.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stat[0].nRating,
      ratingsAverage: stat[0].ratingAvg,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 1,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcCountAndAvg(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.x = await this.findOne();
  console.log('X:: ', this.x);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.x.constructor.calcCountAndAvg(this.x.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
