const { check } = require("express-validator");
const { VALID_STATES } = require("../constants");
const { Spot, Review, Booking } = require("../db/models");
const multer = require("multer");
const {
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  BadReqestError,
  CustomError,
} = require("../errors");
const { Op } = require("sequelize");
const {
  restoreUser,
  requireAuth,
  handleValidationErrors,
  sanitizeFile,
  s3Storage,
  s3ReviewStorage,
} = require("../util");

const canEditResource = ([resource, fk], req, res, next) => {
  if (!req.user)
    return new UnauthorizedError(`You must be logged in to edit ${resource}s`);
  if (!req[resource]) return new NotFoundError(`Could not find ${resource}`);
  if (req.user.id !== req[resource][fk])
    return new ForbiddenError(`You do not have access to this ${resource}`);
};

const checkResourceExists = async (id, model, resourceName, req) => {
  const data = await model.findByPk(id);
  if (!data)
    return new NotFoundError(`Could not find requested ${resourceName}`);
  req[resourceName] = data;
};

const checkSpotExists = async (req, res, next) => {
  const { spotId } = req.params;
  const result = await checkResourceExists(spotId, Spot, "spot", req);
  if (result instanceof CustomError) return next(result);
  next();
};

const checkUserCanEditSpot = async (req, res, next) => {
  const result = canEditResource(["spot", "ownerId"], req, res, next);
  if (result instanceof CustomError) return next(result);
  next();
};

const checkSpotInputData = [
  check("address")
    .notEmpty()
    .matches(/^\d+\s[A-z]+\s[A-z]+/g)
    .withMessage("Please provide a valid address"),
  check("city").notEmpty().withMessage("Please provide a city"),
  check("state").isIn(VALID_STATES).withMessage("Please provide a valid state"),
  check("country")
    .notEmpty()
    .equals("USA")
    .withMessage("We only accept USA for now"),
  check("name").notEmpty().withMessage("Please enter a valid name"),
  check("description")
    .notEmpty()
    .withMessage("Please enter a valid description"),
  check("price")
    .isFloat({ min: 1, max: 99999 })
    .withMessage("Please enter a valid price"),
  // check("postalCode")
  //   .notEmpty()
  //   .matches(/^\d{5}(-\d{4})?$/)
  //   .withMessage("Please provide a valid postal code"),
  handleValidationErrors,
];
const validateEditSpots = [
  restoreUser,
  requireAuth,
  ...checkSpotInputData,
  checkSpotExists,
  checkUserCanEditSpot,
];

const requireUserLogin = [restoreUser, requireAuth];

const uploadImage = multer({
  storage: s3Storage,
  fileFilter: (req, file, cb) => {
    sanitizeFile(file, cb);
  },
  limits: {
    fileSize: 1024 * 1024 * 2, //2mb file size
  },
});

const uploadReviewImage = multer({
  storage: s3ReviewStorage,
  fileFilter: (req, file, cb) => {
    sanitizeFile(file, cb);
  },
  limits: {
    fileSize: 1024 * 1024 * 2, //2mb file size
  },
});

const canUploadMoreImages = async (req, res, next) => {
  const count = await req.spot.countSpotImages();
  if (count > 12)
    return next(
      new BadReqestError("Too many images uploaded", {
        image: "too many images uploaded for this spot",
      })
    );
  next();
};

const canUploadMoreReviewImages = async (req, res, next) => {
  const count = await req.review.countReviewImages();
  if (count > 5)
    return next(
      new BadReqestError("Too many images uploaded", {
        image: "too many images uploaded for this review",
      })
    );
  next();
};

const checkReviewExists = async (req, res, next) => {
  const { reviewId } = req.params;
  const result = await checkResourceExists(reviewId, Review, "review", req);
  if (result instanceof CustomError) return next(result);
  next();
};

const checkUserCanEditReview = (req, res, next) => {
  const result = canEditResource(["review", "userId"], req, res);
  if (result instanceof CustomError) return next(result);
  next();
};

const checkBookingExists = async (req, res, next) => {
  const { bookingId } = req.params;
  const result = await checkResourceExists(bookingId, Booking, "booking", req);
  if (result instanceof CustomError) return next(result);
  if (!req.spot) {
    req.spot = await Spot.findByPk(req.booking.id);
  }
  next();
};
const checkUserCanEditBooking = (req, res, next) => {
  const result = canEditResource(["booking", "userId"], req, res, next);
  if (result instanceof CustomError) return next(result);
  next();
};

const checkReviewInputData = [
  check("review")
    .notEmpty()
    .isLength({ min: 25, max: 300 })
    .withMessage("Reviews must be between 25 and 300 characters"),
  check("stars")
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be between 1 and 5"),
  handleValidationErrors,
];

const checkUserAlreadyHasReview = async (req, res, next) => {
  const reviews = await req.user.getReviews({
    where: {
      spotId: req.spot.id,
    },
  });
  if (reviews.length)
    return next(
      new BadReqestError("A review already exists for this spot from you")
    );
  next();
};

const checkBookingInputData = [
  check("startDate")
    .notEmpty()
    .isDate({ format: "MM/DD/YYYY" })
    .withMessage("Please provide a startDate"),
  check("endDate")
    .notEmpty()
    .isDate({ format: "MM/DD/YYYY" })
    .withMessage("Please provide an end date"),
  handleValidationErrors,
];

const notAlreadyBooked = async (req, res, next) => {
  const { startDate, endDate } = req.body;
  const bookings = await Booking.findAll({
    where: {
      [Op.and]: [
        {
          startDate: {
            [Op.lte]: new Date(startDate),
          },
        },
        {
          endDate: {
            [Op.gte]: new Date(endDate),
          },
        },
      ],
      spotId: req.spot.id,
    },
  });
  //if there are bookings in this timeframe
  if (bookings.length)
    return next(
      new BadReqestError("Sorry, this spot is already booked for these dates", {
        startDate: "starte date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      })
    );
  next();
};

module.exports = {
  validateEditSpots,
  requireUserLogin,
  checkSpotExists,
  checkUserCanEditSpot,
  checkSpotInputData,
  uploadImage,
  canUploadMoreImages,
  checkUserCanEditReview,
  checkReviewExists,
  checkReviewInputData,
  uploadReviewImage,
  checkUserAlreadyHasReview,
  canUploadMoreReviewImages,
  checkBookingExists,
  checkUserCanEditBooking,
  checkBookingInputData,
  notAlreadyBooked,
};
