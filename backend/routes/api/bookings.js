const router = require("express").Router();
const {
  requireUserLogin,
  checkBookingInputData,
  checkBookingExists,
  checkUserCanEditBooking,
  notAlreadyBooked,
} = require("../../middleware");
const { Spot, SpotImage, Booking } = require("../../db/models");
const dayjs = require("dayjs");
const { BadReqestError, ForbiddenError } = require("../../errors");

router.get("/current", requireUserLogin, async (req, res) => {
  const bookings = await req.user.getBookings({
    include: [
      {
        model: Spot,
        include: {
          model: SpotImage,
          where: {
            preview: true,
          },
          required: false,
        },
      },
    ],
  });
  const formattedBookings = [];
  for (let booking of bookings) {
    console.log("THIS IS THE BOOKING", booking);
    const formattedBooking = {
      ...booking.dataValues,
      Spot: { ...booking.Spot.dataValues },
    };

    if (booking.Spot.SpotImages.length) {
      formattedBooking.Spot.previewImage = booking.Spot.SpotImages[0].url;
    } else {
      formattedBooking.Spot.previewImage = null;
    }
    delete formattedBooking.Spot.SpotImages;
    console.log(formattedBooking);
    formattedBookings.push(formattedBooking);
  }
  res.json({
    Bookings: [...formattedBookings],
  });
});

router.put(
  "/:bookingId",
  [
    requireUserLogin,
    checkBookingInputData,
    checkBookingExists,
    checkUserCanEditBooking,
    notAlreadyBooked,
  ],
  async (req, res, next) => {
    const { startDate, endDate } = req.body;
    if (dayjs().isAfter(dayjs(req.booking.getDataValue("endDate")))) {
      return next(new BadReqestError("Past bookings can't be modified"));
    }
    req.booking.startDate = startDate;
    req.booking.endDate = endDate;
    await req.booking.save();
    res.json(req.booking);
  }
);

router.delete(
  "/:bookingId",
  requireUserLogin,
  checkBookingExists,
  checkUserCanEditBooking,
  async (req, res, next) => {
    if (dayjs(req.booking.startDate).isBefore(dayjs())) {
      return next(
        new ForbiddenError("Bookings that have been started can't be deleted")
      );
    }
    await req.booking.destroy();
    res.json({ message: "Successfully deleted" });
  }
);

module.exports = router;
