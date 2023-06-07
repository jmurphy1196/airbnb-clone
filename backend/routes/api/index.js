const router = require("express").Router();

router.post("/test", (req, res) => {
  res.json({ reqestBody: req.body });
});

module.exports = router;
