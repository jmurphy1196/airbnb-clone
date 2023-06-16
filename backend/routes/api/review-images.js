const router = require("express").Router();
const { NotFoundError, ForbiddenError } = require("../../errors");
const { requireUserLogin } = require("../../middleware");
const { Review, ReviewImage } = require("../../db/models");

router.delete("/:imageId", [requireUserLogin], async (req, res, next) => {
  const image = await ReviewImage.findByPk(req.params.imageId);
  // const s3Key = image.url.split("/").slice(3).join("/");
  //delete from AWS
  // await deleteS3Obj(s3Key);
  //delete from DB
  if (!image) {
    return next(new NotFoundError("Could not find requested image"));
  }

  const review = await Review.findByPk(image.reviewId);

  if (review.userId !== req.user.id) {
    return next(new ForbiddenError("not authorized to edit image"));
  }

  await image.destroy();
  res.json({ message: "Successfully deleted" });
});

module.exports = router;
