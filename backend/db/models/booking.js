"use strict";
const { Model } = require("sequelize");
const { User } = require("./user");
const { Spot } = require("./spot");
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
          isValidDate(val) {
            const dayjs = require("dayjs");
            const day = dayjs(val);
            if (day.isBefore(dayjs())) {
              throw new Error("Cannot book before today");
            }
            // if (day.isAfter(dayjs().add(1, "year"))) {
            //   throw new Error("Cannot book more than a year out");
            // }
          },
        },
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isValidDate(val) {
            const dayjs = require("dayjs");
            const endDate = dayjs(val);
            const startDate = dayjs(this.startDate);
            if (endDate.isBefore(startDate)) {
              throw new Error("End date cannot be before the start date");
            }
            // if (endDate.isAfter(startDate.add(14, "day"))) {
            //   throw new Error("Bookings cannot be longer than two weeks");
            // }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
