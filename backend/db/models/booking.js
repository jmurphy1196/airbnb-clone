"use strict";
const { Model } = require("sequelize");
const { User } = require("./user");
const { Spot } = require("./spot");
const { formatDate } = require("../../util/date");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, { foreignKey: "userId" });
      Booking.belongsTo(models.Spot, { foreignKey: "spotId" });
    }
  }
  Booking.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Spot,
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: "id",
        },
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isAfter: formatDate(new Date()),
          isBefore: formatDate(
            new Date(
              `${new Date().getFullYear() + 1}-${new Date().getMonth() + 1}`
            )
          ),
        },
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {},
      },
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
