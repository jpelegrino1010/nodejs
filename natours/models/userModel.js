const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSquema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User most have a name'],
  },

  email: {
    type: String,
    required: [true, 'User most have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'guide', 'lead-guide'],
    default: 'user',
  },

  photo: String,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },

  password: {
    type: String,
    required: [true, 'User most have a password'],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'User most have a password'],
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: 'The password has to match',
    },
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSquema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSquema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangeAt = Date.now() - 1000;
});

userSquema.pre(/^find/, async function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSquema.methods.correctPassword = async function (
  inputPassword,
  userPassword,
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

userSquema.methods.passwordChangeAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const passwordChantAt = parseInt(this.passwordChangeAt.getTime() / 1000);

    return JWTTimestamp < passwordChantAt;
  }

  return false;
};

userSquema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 100;

  return resetToken;
};

const User = mongoose.model('User', userSquema);

module.exports = User;
