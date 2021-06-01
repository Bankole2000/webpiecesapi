const { Model, Sequelize, DataTypes } = require("sequelize");
const db = require("../../config/database");

class UpdateRequest extends Model {}

UpdateRequest.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    invited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize: db,
    modelName: "updateRequest"
  }
);

module.exports = UpdateRequest;
