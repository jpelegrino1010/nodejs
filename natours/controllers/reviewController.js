const Review = require('./../models/reviewModel');
const factory = require('./factoryHandler');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  console.log(req.body.tour, req.body.tour);
  next();
};

exports.createReview = factory.createDoc(Review);
exports.getReviews = factory.getAll(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
