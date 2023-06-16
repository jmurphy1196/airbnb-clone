"use strict";

const { Spot, User } = require("../models");
const { Op } = require("sequelize");
const {
  getLocationData,
  getlatitudeAndLongitude,
} = require("../../util/geocoder");

/** @type {import('sequelize-cli').Migration} */
let options = { validate: true };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const spots = [
  {
    address: "42001 PACIFIC COAST HWY",
    city: "malibu",
    country: "USA",
    state: "CA",
    name: "Carbon Beach",
    description: "test",
    price: 7500,
    // postalCode: "90265",
  },
  {
    address: "20801 QUEENS PARK LN",
    city: "Huntington Beach",
    country: "USA",
    state: "CA",
    name: "The Sands - Luxury family friendly beachfront home",
    description: "test",
    price: 7500,
    // postalCode: "92646",
  },
  {
    address: "127 VIEUDELOU AVE",
    city: "avalon",
    country: "USA",
    state: "CA",
    name: "The Big Blue, 1BR + Den",
    description: "test",
    price: 500,
    // postalCode: "90704",
  },
  {
    address: "303 DORIS AVE",
    city: "Oxnard",
    country: "USA",
    state: "CA",
    name: "On the sand",
    description: "test",
    price: 800,
    // postalCode: "93030",
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
    for (let spot of spots) {
      const data = await getLocationData(spot);
      const [lat, lng] = getlatitudeAndLongitude(data);
      spot.lat = lat;
      spot.lng = lng;
    }

    const users = await User.findAll({
      where: {
        username: {
          [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2", "porkins1196"],
        },
      },
    });
    users.forEach(async (usr, i) => {
      await usr.createSpot({
        ...spots[i],
      });
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Spots";
    const users = await User.findAll({
      where: {
        username: {
          [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2", "porkins1196"],
        },
      },
    });
    const userIds = users.map((usr) => usr.id);
    await queryInterface.bulkDelete(
      options,
      {
        ownerId: {
          [Op.in]: userIds,
        },
      },
      options
    );
  },
};
