"use strict";

const { User } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
const tableName =
  process.env.NODE_ENV === "production"
    ? `${process.env.SCHEMA}.Users`
    : "Users";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    console.log("THIS IS TABLENAME", tableName);

    await queryInterface.addColumn(
      tableName,
      "firstName",
      {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      options
    );
    await queryInterface.addColumn(
      tableName,
      "lastName",
      {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      options
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("Users", "firstName", options);
    await queryInterface.removeColumn("Users", "lastName", options);
  },
};
