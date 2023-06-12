"use strict";

/** @type {import('sequelize-cli').Migration} */
const { Review, User } = require("../models");
const { Op } = require("sequelize");
let options = { validate: true };
options.tableName = "Reviews";
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
const reviewData = [
  {
    review: "THIS IS A TEST REVIEW 1",
    stars: 4,
    id: 1,
  },
  {
    review: "THIS IS A TEST REVIEW 2",
    stars: 1,
    id: 2,
  },
  {
    review: "THIS IS A TEST REVIEW 3",
    stars: 2,
    id: 3,
  },
  {
    review: "THIS IS A TEST REVIEW 4",
    stars: 3,
    id: 4,
  },
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
    for (const user of users) {
      const spots = await user.getSpots();
      if (spots.length && reviewData.length) {
        //add a review  to first spot
        const spot = spots[0];
        const review = await spot.createReview({
          ...reviewData.pop(),
          userId: user.id,
        });
      }
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
