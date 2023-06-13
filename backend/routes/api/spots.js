const router = require("express").Router();
const {
  Spot,
  SpotImage,
  User,
  ReviewImage,
  Review,
} = require("../../db/models");
const {
  validateEditSpots,
  checkSpotExists,
  userCanEditSpot,
  checkSpotInputData,
  uploadImage,
  canUploadMoreImages,
  requireUserLogin,
  checkReviewInputData,
  checkUserAlreadyHasReview,
} = require("../../middleware");

const { BadReqestError, NotFoundError } = require("../../errors");
const {
  getLocationData,
  getlatitudeAndLongitude,
} = require("../../util/geocoder");
const { restoreUser, requireAuth } = require("../../util/auth");

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
        required: false,
      },
      {
        model: Review,
        attributes: ["stars"],
      },
    ],
  });

  const formattedSpots = [];
  for (let spot of spots) {
    const url = spot.SpotImages.length ? spot.SpotImages[0].url : null;
    const formattedSpot = {
      ...spot.dataValues,
      preview: url,
    };
    const totalRating = formattedSpot.Reviews.reduce(
      (acc, val) => val.stars + acc,
      0
    );
    const avgRating =
      totalRating <= 0 ? 0 : totalRating / formattedSpot.Reviews.length;
    formattedSpot.avgRating = avgRating;
    delete formattedSpot.SpotImages;
    delete formattedSpot.Reviews;
    formattedSpots.push(formattedSpot);
  }
  res.json({
    Spots: formattedSpots,
  });
});
router.get("/current", requireUserLogin, async (req, res) => {
  const spots = await req.user.getSpots();
  res.json({
    Spots: [...spots],
  });
});

router.get("/:spotId", checkSpotExists, async (req, res) => {
  const images = await req.spot.getSpotImages();
  res.json({
    ...req.spot.dataValues,
    SpotImages: images,
  });
});
router.get("/:spotId/reviews", checkSpotExists, async (req, res) => {
  const reviews = await req.spot.getReviews({
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });
  res.json({
    Reviews: [...reviews],
  });
});

router.post(
  "/",
  [restoreUser, requireAuth, checkSpotInputData],
  async (req, res) => {
    let {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
      postalCode,
    } = req.body;
    if (!lat || !lng) {
      const locationData = await getLocationData({ address, city, state });
      [lat, lng] = getlatitudeAndLongitude(locationData);
    } else {
      //check if lat and lng provided are not valid
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return next(new BadReqestError("LAT OR LNG Provided is invalid"));
      }
    }
    const spot = await req.user.createSpot({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
      postalCode,
    });

    res.json(spot);
  }
);

//TODO Check if the user has had a booking for this spot to make a review

router.post(
  "/:spotId/reviews",
  [
    requireUserLogin,
    checkSpotExists,
    checkReviewInputData,
    checkUserAlreadyHasReview,
  ],
  async (req, res) => {
    const { review, stars } = req.body;

    const userReview = await Review.create({
      userId: req.user.id,
      spotId: req.spot.id,
      review,
      stars,
    });

    res.json(userReview);
  }
);

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

router.delete(
  "/:spotId/images/:imageId",
  checkSpotExists,
  userCanEditSpot,
  async (req, res, next) => {
    const { imageId } = req.params;
    const spotImages = await req.spot.getSpotImages({
      where: {
        id: imageId,
      },
    });
    if (!spotImages.length)
      return next(
        new NotFoundError("image could not be found", {
          imageId: "image not found with given id",
        })
      );
    await spotImages[0].destroy();
    res.json({ message: "Successfully deleted" });
  }
);

router.post(
  "/:spotId/images",
  restoreUser,
  requireAuth,
  checkSpotExists,
  canUploadMoreImages,
  uploadImage.single("image"),
  async (req, res, next) => {
    const { preview } = req.body;
    if (!req.file) {
      return next(new BadReqestError("Please upload an image"));
    }
    const image = await req.spot.createSpotImage({
      url: req.file.location,
      preview: preview === "true" ? true : false,
    });
    res.json({
      url: image.getDataValue("url"),
      preview: image.getDataValue("preview"),
    });
  }
);

router.post(
  "/:spotId/images/array",
  restoreUser,
  requireAuth,
  checkSpotExists,
  canUploadMoreImages,
  uploadImage.array("images[]"),
  async (req, res, next) => {
    if (!req.files.length) {
      return next(new BadReqestError("Please upload at least one image"));
    }
    const data = [];
    for (let file of req.files) {
      const image = await req.spot.createSpotImage({
        url: file.location,
        preview: false,
      });
      data.push(image);
    }
    res.json({ msg: "success", data });
  }
);

module.exports = router;
