const router = require("express").Router();
const { Spot, SpotImage } = require("../../db/models");
const {
  validateEditSpots,
  checkSpotExists,
  userCanEditSpot,
} = require("../../middleware");

const { BadReqestError } = require("../../errors");
const {
  getLocationData,
  getlatitudeAndLongitude,
} = require("../../util/geocoder");

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
    include: [
      {
        model: SpotImage,
        where: {
          preview: true,
        },
        attributes: ["url"],
      },
    ],
  });
  const formattedSpots = [];
  for (let spot of spots) {
    const formattedSpot = {
      ...spot.dataValues,
      preview: spot.SpotImages[0].url,
    };
    delete formattedSpot.SpotImages;
    formattedSpots.push(formattedSpot);
  }
  res.json({
    Spots: formattedSpots,
  });
});

router.put("/:spotId", validateEditSpots, async (req, res, next) => {
  let {
    address,
    city,
    state,
    country,
    postalCode,
    lat,
    lng,
    name,
    description,
    price,
  } = req.body;
  const keys = [
    "address",
    "city",
    "state",
    "country",
    "postalCode",
    "lat",
    "lng",
    "name",
    "description",
    "price",
  ];
  //if not lat or lng is provided we will get it with an API call
  if (!lat || !lng) {
    const locationData = await getLocationData({ address, city, state });
    [lat, lng] = getlatitudeAndLongitude(locationData);
  } else {
    //check if lat and lng provided are not valid
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return next(new BadReqestError("LAT OR LNG Provided is invalid"));
    }
  }
  //edit all values
  [
    address,
    city,
    state,
    country,
    postalCode,
    lat,
    lng,
    name,
    description,
    price,
  ].forEach((val, i) => {
    req.spot[keys[i]] = val;
  });

  await req.spot.save();

  res.json(req.spot);
});

router.delete(
  "/:spotId",
  checkSpotExists,
  userCanEditSpot,
  async (req, res, next) => {
    //TODO should not be able to delete if a booking is coming up and delete associated bookings
    await req.spot.destroy();
    res.json({ message: "Successfully deleted" });
  }
);

module.exports = router;
