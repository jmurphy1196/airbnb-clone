const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");

const { setTokenCookie, requireAuth } = require("../../util/auth");
const { handleValidationErrors } = require("../../util/validation");
const { User } = require("../../db/models");
const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  check("firstName")
    .exists()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long"),
  check("lastName")
    .exists()
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters long"),
  handleValidationErrors,
];

router.post("/", validateSignup, async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({
    email,
    hashedPassword,
    username,
    firstName,
    lastName,
  });
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  };
  setTokenCookie(res, safeUser);
  res.status(201);
  return res.json({ user: safeUser });
});

module.exports = router;
