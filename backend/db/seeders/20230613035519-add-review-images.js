"use strict";

/** @type {import('sequelize-cli').Migration} */
const { Review } = require("../models");
const { Op } = require("sequelize");
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
    const seededReviews = await Review.findAll({
      where: {
        id: {
          [Op.in]: [1, 2, 3, 4],
        },
      },
    });
    for (const review of seededReviews) {
      await review.createReviewImage({
        url: "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGhvdG98ZW58MHx8MHx8fDA%3D&w=1000&q=80",
      });
      await review.createReviewImage({
        url: "https://st2.depositphotos.com/2001755/5408/i/450/depositphotos_54081723-stock-photo-beautiful-nature-landscape.jpg",
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
    const seededReviews = await Review.findAll({
      where: {
        id: {
          [Op.in]: [1, 2, 3, 4],
        },
      },
    });
    for (const review of seededReviews) {
      const reviewImgs = await review.getReviewImages();
      if (reviewImgs.length) {
        for (let img of reviewImgs) {
          await img.destroy();
        }
      }
    }
  },
};
