const router = require("express").Router();
const { SpotImage, Spot } = require("../../db/models");
const { ForbiddenError, NotFoundError } = require("../../errors");
const { checkSpotImageExists } = require("../../middleware");
const { deleteS3Obj } = require("../../util/s3");

router.delete(
  "/:spotImageId",
  [checkSpotImageExists],
  async (req, res, next) => {
    const { spotImageId } = req.params;
    const spot = await Spot.findByPk(req.spotImage.spotId);
    if (spot.ownerId !== req.user.id) {
      return next(new ForbiddenError("You cannot edit this image"));
    }
    const s3Key = req.spotImage.url.split("/").slice(3).join("/");
    //delete from aws
    await deleteS3Obj(s3Key);
    //delete from DB
    await req.spotImage.destroy();
    res.json({ message: "Successfully deleted" });
  }
);

router.put("/:spotImageId", [checkSpotImageExists], async (req, res, next) => {
  const { spotImageId } = req.params;
  const spot = await Spot.findByPk(req.spotImage.spotId);
  const spotImages = await spot.getSpotImages({ where: { preview: true } });
  if (spot.ownerId !== req.user.id) {
    return next(new ForbiddenError("You cannot edit this image"));
  }
  //make sure no other preview image, if there is make it not preview
  if (spotImages.length > 0) {
    for (let spotImage of spotImages) {
      spotImage.preview = false;
      await spotImage.save();
    }
  }
  req.spotImage.preview = true;
  await req.spotImage.save();
  res.json({
    message: "success edited image preview",
    data: req.spotImage.url,
  });
});

module.exports = router;
