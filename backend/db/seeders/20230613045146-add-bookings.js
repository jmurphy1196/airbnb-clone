"use strict";

/** @type {import('sequelize-cli').Migration} */
const { User, Spot, Booking } = require("../models");
const { Op } = require("sequelize");
const dayjs = require("dayjs");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = "Bookings";
const sampleAddresses = [
  "42001 PACIFIC COAST HWY",
  "20801 QUEENS PARK LN",
  "127 VIEUDELOU AVE",
  "303 DORIS AVE",
];
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

    const users = await User.findAll({
      where: {
        username: {
          [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2", "porkins1196"],
        },
      },
    });

    for (let i = 0; i < users.length; i++) {
      const usr = users[i];
      const startDate = dayjs()
        .add(i + 1, "month")
        .format("MM/DD/YYYY");
      const endDate = dayjs(startDate).add(3, "day").format("MM/DD/YYYY");
      const spot = await Spot.findOne({
        where: {
          address: sampleAddresses[i],
        },
      });
      const booking = await Booking.create({
        spotId: spot.id,
        userId: usr.id,
        startDate,
        endDate,
        id: i + 1,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(options, {
      id: {
        [Op.in]: [1, 2, 3, 4],
      },
    });
  },
};
