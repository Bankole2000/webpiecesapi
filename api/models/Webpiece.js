const { Model, Sequelize, DataTypes } = require("sequelize");
const db = require("../../config/database");

class Webpiece extends Model {}

Webpiece.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imageFullsizedUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imageFullsizedPath: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    hasBeenDone: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    selectedTechnologies: {
      type: DataTypes.JSON,
      allowNull: true
    },
    userContactDetails: {
      type: DataTypes.JSON,
      allowNull: false
    },
    upvotes: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  {
    sequelize: db,
    modelName: "webpiece"
  }
);

module.exports = Webpiece;
