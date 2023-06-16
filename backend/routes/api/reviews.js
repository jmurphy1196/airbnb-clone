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
const { deleteS3Obj } = require("../../util/s3");

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
    // if (!req.file) {
    //   return next(new BadReqestError("You must upload at least one image"));
    // }
    if (!req.body.url) {
      return next(new BadReqestError("Please provide a valid URL"));
    }
    const reviewImage = await ReviewImage.create({
      url,
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
    // const s3Key = image.url.split("/").slice(3).join("/");
    //delete from AWS
    // await deleteS3Obj(s3Key);
    //delete from DB
    await image.destroy();
    res.json({ message: "Successfully deleted" });
  }
);
module.exports = router;
