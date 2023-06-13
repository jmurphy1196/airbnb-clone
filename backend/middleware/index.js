const { check } = require("express-validator");
const { handleValidationErrors } = require("../util/validation");
const { restoreUser, requireAuth } = require("../util/auth");
const { VALID_STATES } = require("../constants");
const { Spot, SpotImage, User, Review, Booking } = require("../db/models");
const { sanitizeFile, s3Storage, s3ReviewStorage } = require("../util/s3");
const multer = require("multer");
const {
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  BadReqestError,
} = require("../errors");

const checkSpotExists = async (req, res, next) => {
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);
  if (!spot)
    return next(new NotFoundError("Could not find requested resource"));
  req.spot = spot;
  next();
};

const userCanEditSpot = async (req, res, next) => {
  if (!req.spot) return next(new NotFoundError("Spot was not found"));
  if (!req.user)
    return next(new UnauthorizedError("must be logged in to edit a spot"));
  if (req.user.id !== req.spot.ownerId)
    return next(
      new ForbiddenError(
        "You do not have valid permissions to edit this resource"
      )
    );
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
  check("postalCode")
    .notEmpty()
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage("Please provide a valid postal code"),
  handleValidationErrors,
];
const validateEditSpots = [
  restoreUser,
  requireAuth,
  ...checkSpotInputData,
  checkSpotExists,
  userCanEditSpot,
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
  const review = await Review.findByPk(reviewId);
  if (!review)
    return next(new NotFoundError("Could not find requested review"));
  req.review = review;
  next();
};

const checkUserCanEditReview = (req, res, next) => {
  if (!req.user)
    return next(new UnauthorizedError("You must be logged in to edit reviews"));
  if (!req.review) return next(new NotFoundError("Could not find req.review"));
  if (req.user.id !== req.review.userId)
    return next(new ForbiddenError("You do not have access to this review"));
  next();
};

const checkBookingExists = async (req, res, next) => {
  const { bookingId } = req.params;
  const booking = await Booking.findByPk(bookingId);
  if (!booking) return next(new NotFoundError("Could not find booking"));
  req.booking = booking;
  next();
};
const checkUserCanEditBooking = (req, res, next) => {
  if (!req.user)
    return next(
      new UnauthorizedError("You must be logged in to edit a booking")
    );
  if (!req.booking) return next(new NotFoundError("Could not find booking"));
  if (req.user.id !== req.booking.userId)
    return next(new ForbiddenError("You do not have access to this review"));
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

module.exports = {
  validateEditSpots,
  requireUserLogin,
  checkSpotExists,
  userCanEditSpot,
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
};
