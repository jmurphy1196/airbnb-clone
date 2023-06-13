"use strict";

/** @type {import('sequelize-cli').Migration} */
const { User, Spot, Booking } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = "ReviewImages";
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const user = await User.findOne({ where: { username: "porkins1196" } });
    const spot = await Spot.findOne({
      where: { address: "127 VIEUDELOU AVE" },
    });

    const bookingDate = `${new Date().getFullYear()}-${
      new Date().getMonth() + 2
    }-${new Date().getDate()}`;
    const bookingDateEnd = `${new Date().getFullYear()}-${
      new Date().getMonth() + 2
    }-${new Date().getDate() + 2}`;

    const booking = await Booking.create({
      spotId: spot.id,
      userId: user.id,
      startDate: new Date("2023-10-13"),
      endDate: new Date("2023-10-15"),
      id: 1,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const booking = await Booking.findByPk(1);
    await booking.destroy();
  },
};
