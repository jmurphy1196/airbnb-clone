const router = require("express").Router();
const {
  requireUserLogin,
  checkReviewInputData,
  checkReviewExists,
  checkUserCanEditReview,
  canUploadMoreReviewImages,
  uploadReviewImage,
} = require("../../middleware");
const { User, Spot, ReviewImage } = require("../../db/models");
const { BadReqestError } = require("../../errors");

router.get("/current", requireUserLogin, async (req, res) => {
  const reviews = await req.user.getReviews({
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
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
router.put(
  "/:reviewId",
  [
    requireUserLogin,
    ...checkReviewInputData,
    checkReviewExists,
    checkUserCanEditReview,
  ],
  async (req, res, next) => {
    const { review, stars } = req.body;
    req.review.review = review;
    req.review.stars = stars;
    await req.review.save();
    res.json(req.review);
  }
);
router.delete(
  "/:reviewId",
  [requireUserLogin, checkReviewExists, checkUserCanEditReview],
  async (req, res) => {
    await req.review.destroy();
    res.json({ message: "Succesfully deleted" });
  }
);
router.post(
  "/:reviewId/images",
  [
    requireUserLogin,
    checkReviewExists,
    checkUserCanEditReview,
    canUploadMoreReviewImages,
    uploadReviewImage.single("image"),
  ],
  async (req, res, next) => {
    if (!req.file) {
      return next(new BadReqestError("You must upload at least one image"));
    }
    const reviewImage = await ReviewImage.create({
      url: req.file.location,
      reviewId: req.review.id,
      userId: req.user.id,
    });

    res.json({
      url: reviewImage.getDataValue("url"),
      id: reviewImage.id,
    });
  }
);
router.delete(
  "/:reviewId/images/:reviewImageId",
  [requireUserLogin, checkReviewExists, checkUserCanEditReview],
  async (req, res) => {
    const image = await ReviewImage.findOne({
      where: {
        id: req.params.reviewImageId,
      },
    });
    //TODO DELETE IMG FROM AWS
    await image.destroy();
    res.json({ message: "Successfully deleted" });
  }
);
module.exports = router;
