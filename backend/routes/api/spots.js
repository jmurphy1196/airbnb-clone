const router = require("express").Router();
const { Spot } = require("../../db/models");

router.get("/", async (req, res) => {
  let { page, size } = req.query;
  page = +page <= 0 || isNaN(+page) ? 1 : +page;
  size = +size <= 0 || isNaN(+size) ? 10 : +size;
  const pagination = {
    offset: (page - 1) * size,
    limit: size,
  };
  const spots = await Spot.findAll({
    ...pagination,
  });
  res.json(spots);
});

module.exports = router;
