const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/').get(tourController.getTours);

router.route('/details/:slug').get(tourController.getTourBySlug);
router.use(authController.protect);

router.route('/').post(tourController.createTour);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopCheaps, tourController.getTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.delete(
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  tourController.deleteTour,
);

router.use(authController.restrictTo('admin', 'user'));

router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour);

module.exports = router;
