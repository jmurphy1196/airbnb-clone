const { validationResult } = require("express-validator");
const { BadReqestError } = require("../errors");

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach((error) => (errors[error.path] = error.msg));
    const err = new BadReqestError("Bad request", { errors });
    next(err);
  }
  next();
};

module.exports = {
  handleValidationErrors,
};
