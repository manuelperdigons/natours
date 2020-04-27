const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path} is ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicatedFieldsDB = err => {
  const value = err.errmsg.match(/"(.*?)"/g);
  const message = `Duplicated field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token, please log in again', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired, please log in again', 401);

const sendErrorDev = (err, req, res) => {
  // A API
  if (req.originalUrl.startsWith('/api')) {
    // 1 Operational truted error, send message to client
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err
    });
  }
  // B RENDERED WEBSITE
  // 2 Programming or other unknown error, dont leak error details
  console.error('ERROR', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something wrong',
    msg: err.message
  });
};

const sendErrorProd = (err, req, res) => {
  // A API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      // 1 Operational truted error, send message to client
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    console.error('ERROR', err);
    // 2 Programming or other unknown error, dont leak error details
    return res.status(500).json({
      status: 'error',
      message: 'something went very wrong'
    });
  }

  // B) RENDERED WEBSITE
  // 1 Operational truted error, send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something wrong',
      msg: err.message
    });
  }
  console.error('ERROR', err);
  // 2 Programming or other unknown error, dont leak error details
  return res.status(err.statusCode).render('error', {
    title: 'Something wrong',
    msg: 'Please try again later'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicatedFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
