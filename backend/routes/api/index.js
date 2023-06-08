const router = require("express").Router();
const { restoreUser } = require("../../util/auth");

router.use(restoreUser);

module.exports = router;
