const router = require("express").Router();
const { restoreUser } = require("../../util/auth");

const sessionRouter = require("./session");
const userRouter = require("./users");
const spotsRouter = require("./spots");

router.use(restoreUser);
router.use("/session", sessionRouter);
router.use("/users", userRouter);
router.use("/spots", spotsRouter);

router.post("/test", (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
