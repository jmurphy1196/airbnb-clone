"use strict";
const { Model } = require("sequelize");
const { VALID_STATES } = require("../../constants");
const { User } = require("../models/user");
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.hasMany(models.SpotImage, { foreignKey: "spotId" });
      Spot.belongsTo(models.User, { foreignKey: "ownerId" });
    }
  }
  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: "id",
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^\d+\s[A-z]+\s[A-z]+/g,
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [VALID_STATES],
        },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["USA"]],
        },
      },
      lat: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          min: -90,
          max: 90,
        },
      },
      lng: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          min: -180,
          max: 180,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [5],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          min: 0.1,
          max: 99999,
        },
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^\d{5}(-\d{4})?$/,
        },
      },
    },
    {
      sequelize,
      modelName: "Spot",
    }
  );
  return Spot;
};
