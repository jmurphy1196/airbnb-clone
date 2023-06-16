const router = require("express").Router();
const { SpotImage, Spot } = require("../../db/models");
const { ForbiddenError } = require("../../errors");

router.delete("/:spotImageId", async (req, res, next) => {
  const { spotImageId } = req.params;
  const spotImage = await SpotImage.findByPk(spotImageId);
  if (!spotImage)
    return next(
      new NotFoundError("image could not be found", {
        imageId: "image not found with given id",
      })
    );
  const spot = await Spot.findByPk(spotImage.spotId);
  if (spot.ownerId !== req.user.id) {
    return next(new ForbiddenError("You cannot edit this image"));
  }
  // const s3Key = spotImages[0].url.split("/").slice(3).join("/");
  //delete from aws
  // await deleteS3Obj(s3Key);
  //delete from DB
  await spotImage.destroy();
  res.json({ message: "Successfully deleted" });
});

module.exports = router;
