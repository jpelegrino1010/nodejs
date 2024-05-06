const mongoose = require('mongoose');
const { type } = require('../../natours-client/src/store/types');

const bookingSchema = mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    require: [true, 'booking must have a tour'],
  },

  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    require: [true, 'booking must have a user'],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  paid: {
    type: Boolean,
    default: true,
  },

  price: {
    type: Number,
    require: [true, 'Booking must have a price'],
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
