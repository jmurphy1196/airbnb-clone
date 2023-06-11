"use strict";

const { SpotImage, Spot } = require("../models");
const { Op } = require("sequelize");
let options = { validate: true };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */

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

    const spots = await Spot.findAll({
      where: {
        address: {
          [Op.in]: [
            "42001 PACIFIC COAST HWY",
            "20801 QUEENS PARK LN",
            "127 VIEUDELOU AVE",
            "303 DORIS AVE",
          ],
        },
      },
    });
    for (let spot of spots) {
      await spot.createSpotImage({
        preview: true,
        url: "https://a0.muscache.com/im/pictures/e99f4706-2c4e-4690-a7da-d6ad5184c50f.jpg?im_w=720",
      });
      await spot.createSpotImage({
        preview: false,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-817707067934974680/original/c15264ee-8817-44c3-b58a-95db29597e60.jpeg?im_w=720",
      });
      await spot.createSpotImage({
        preview: false,
        url: "https://a0.muscache.com/im/pictures/acbc8a69-de9c-4cd0-b857-4b874538b4fe.jpg?im_w=720",
      });
      await spot.createSpotImage({
        preview: false,
        url: "https://a0.muscache.com/im/pictures/49c45526-0940-46b3-8cd8-34a01ceadb64.jpg?im_w=720",
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
    const spots = await Spot.findAll({
      where: {
        address: {
          [Op.in]: [
            "42001 PACIFIC COAST HWY",
            "20801 QUEENS PARK LN",
            "127 VIEUDELOU AVE",
            "303 DORIS AVE",
          ],
        },
      },
    });
    const spotIds = spots.map((s) => s.id);
    options.tableName = "SpotImages";
    await queryInterface.bulkDelete(
      options,
      {
        spotId: {
          [Op.in]: spotIds,
        },
      },
      options
    );
  },
};
