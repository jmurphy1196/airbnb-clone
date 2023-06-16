"use strict";
const { Model } = require("sequelize");
const { User } = require("./user");
const { Spot } = require("./spot");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.Spot, { foreignKey: "spotId" });
      Review.belongsTo(models.User, { foreignKey: "userId" });
      Review.hasMany(models.ReviewImage, { foreignKey: "reviewId" });
    }
  }
  Review.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Spot,
          key: "id",
        },
        onDelete: "CASCADE",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: "id",
        },
        onDelete: "CASCADE",
      },
      review: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: [5, 300],
        },
      },
      stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
