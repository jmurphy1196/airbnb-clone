const { check } = require("express-validator");
const { handleValidationErrors } = require("../util/validation");
const { restoreUser, requireAuth } = require("../util/auth");
const { VALID_STATES } = require("../constants");
const { Spot, SpotImage, User } = require("../db/models");
const {
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
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
const validateEditSpots = [
  restoreUser,
  requireAuth,
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
  checkSpotExists,
  userCanEditSpot,
];

const requireUserLogin = [restoreUser, requireAuth];

module.exports = {
  validateEditSpots,
  requireUserLogin,
  checkSpotExists,
  userCanEditSpot,
};