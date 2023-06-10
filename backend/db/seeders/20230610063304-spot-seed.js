"use strict";

const { Spot } = require("../models");

/** @type {import('sequelize-cli').Migration} */
let options = { validate: true };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const spots = [
  {
    ownerId: 1,
    address: "42001 PACIFIC COAST HWY",
    city: "malibu",
    country: "USA",
    state: "CA",
    lat: 12,
    lng: 12,
    name: "Carbon Beach",
    description: "test",
    price: 7500,
    postalCode: "90265",
  },
  {
    ownerId: 1,
    address: "20801 QUEENS PARK LN",
    city: "Huntington Beach",
    country: "USA",
    state: "CA",
    lat: 12,
    lng: 12,
    name: "The Sands - Luxury family friendly beachfront home",
    description: "test",
    price: 7500,
    postalCode: "92646",
  },
  {
    ownerId: 2,
    address: "127 VIEUDELOU AVE",
    city: "avalon",
    country: "USA",
    state: "CA",
    lat: 12,
    lng: 12,
    name: "The Big Blue, 1BR + Den",
    description: "test",
    price: 500,
    postalCode: "90704",
  },
  {
    ownerId: 2,
    address: "303 DORIS AVE",
    city: "Oxnard",
    country: "USA",
    state: "CA",
    lat: 12,
    lng: 12,
    name: "On the sand",
    description: "test",
    price: 800,
    postalCode: "93030",
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
    await Spot.bulkCreate(spots, options);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Spots";
    await queryInterface.bulkDelete(
      options,
      {
        ownerId: 1,
      },
      options
    );
  },
};
