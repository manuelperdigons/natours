const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const authController = require('../controllers/authController');
const AppError = require('../utils/appError');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.locals.alert =
      "Your booking was succesful. Please check your email for confirmation. If your booking doesn't show here inmediatly, please come back later";
  }
  next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get all the tour data from our collection
  const tours = await Tour.find();

  // 2) Build our template

  // 3) Render template using data from first step (1)

  res.status(200).render('overview', {
    title: 'All tours',
    tours: tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1 get data from requested tour (including reviews and guides)

  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  // 2 Build template
  // 3 Render template using data from step 1
  res.status(200).render('tour', {
    title: tour.name,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  res.status(201).render('login', {
    title: 'Log In'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account'
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).render('account', {
    title: 'Your Account',
    user: updatedUser
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all the bookings from logged in user
  const bookings = await Booking.find({ user: req.user.id });
  // 2) Find tours ids enabled to those bookings
  const toursIds = bookings.map(el => {
    return el.tour;
  });
  const tours = await Tour.find({ _id: { $in: toursIds } });

  res.status(200).render('overview', {
    title: 'My Bookings',
    tours
  });
});
