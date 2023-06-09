"use strict";

const { User } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn(
      { tableName: "Users", schema: process.env.SCHEMA },
      "firstName",
      {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      options
    );
    await queryInterface.addColumn(
      { tableName: "Users", schema: process.env.SCHEMA },
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
