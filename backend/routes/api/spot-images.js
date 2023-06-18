const router = require("express").Router();
const { SpotImage, Spot } = require("../../db/models");
const { ForbiddenError, NotFoundError } = require("../../errors");
const { checkSpotImageExists } = require("../../middleware");

router.delete(
  "/:spotImageId",
  [checkSpotImageExists],
  async (req, res, next) => {
    const { spotImageId } = req.params;
    const spot = await Spot.findByPk(req.spotImage.spotId);
    if (spot.ownerId !== req.user.id) {
      return next(new ForbiddenError("You cannot edit this image"));
    }
    // const s3Key = spotImages[0].url.split("/").slice(3).join("/");
    //delete from aws
    // await deleteS3Obj(s3Key);
    //delete from DB
    await req.spotImage.destroy();
    res.json({ message: "Successfully deleted" });
  }
);

module.exports = router;
