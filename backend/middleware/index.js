const { check } = require("express-validator");
const { VALID_STATES } = require("../constants");
const { Spot, Review, Booking, SpotImage } = require("../db/models");
const multer = require("multer");
const {
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  BadReqestError,
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

const canEditResource = ([resource, fk]) => {
  return (req, res, next) => {
    if (!req.user)
      return next(
        new UnauthorizedError(`You must be logged in to edit ${resource}s`)
      );
    if (!req[resource])
      return next(new NotFoundError(`Could not find ${resource}`));
    if (req.user.id !== req[resource][fk])
      return next(
        new ForbiddenError(`You do not have access to this ${resource}`)
      );
    next();
  };
};

const checkResourceExists = (resourceId, model, resourceName) => {
  return async (req, res, next) => {
    const data = await model.findByPk(req.params[resourceId]);
    if (!data)
      return next(
        new NotFoundError(`Could not find requested ${resourceName}`)
      );
    req[resourceName] = data;
    next();
  };
};

const checkSpotExists = checkResourceExists("spotId", Spot, "spot");

const checkUserCanEditSpot = canEditResource(["spot", "ownerId"]);

const checkSpotInputData = [
  check("address")
    .notEmpty()
    // .matches(/^\d+\s[A-z]+\s[A-z]+/g)
    .withMessage("Please provide a valid address"),
  check("city").notEmpty().withMessage("Please provide a city"),
  check("state")
    .notEmpty()
    // isIn(VALID_STATES)
    .withMessage("Please provide a valid state"),
  check("country")
    .notEmpty()
    // .equals("USA")
    // .withMessage("We only accept USA for now"),
    .withMessage("Please provide a valid country"),
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

const checkReviewExists = checkResourceExists("reviewId", Review, "review");

const checkUserCanEditReview = canEditResource(["review", "userId"]);

const checkBookingExists = checkResourceExists("bookingId", Booking, "booking");
const checkUserCanEditBooking = canEditResource(["booking", "userId"]);

const checkReviewInputData = [
  check("review")
    .notEmpty()
    .isLength({ min: 5, max: 300 })
    .withMessage("Reviews must be between 5 and 300 characters"),
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
    .isDate({ format: "YYYY-MM-DD" })
    .withMessage("Please provide a startDate format: YYYY-MM-DD"),
  check("endDate")
    .notEmpty()
    .isDate({ format: "YYYY-MM-DD" })
    .withMessage("Please provide an end date format: YYYY-MM-DD"),
  handleValidationErrors,
];

const notAlreadyBooked = async (req, res, next) => {
  const { startDate, endDate } = req.body;
  const bookings = await Booking.count({
    where: {
      [Op.or]: [
        {
          startDate: {
            [Op.between]: [new Date(startDate), new Date(endDate)],
          },
        },
        {
          endDate: {
            [Op.between]: [new Date(startDate), new Date(endDate)],
          },
        },
      ],
      spotId: req.booking ? req.booking.spotId : req.spot.id,
    },
  });
  //if there are bookings in this timeframe
  if (bookings > 0)
    return next(
      new BadReqestError("Sorry, this spot is already booked for these dates", {
        startDate: "start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      })
    );
  next();
};

const checkSpotImageExists = checkResourceExists(
  "spotImageId",
  SpotImage,
  "spotImage"
);

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
  checkSpotImageExists,
};
