'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JokeQueue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  JokeQueue.init({
    id: DataTypes.STRING,
    email: DataTypes.STRING,
    value: DataTypes.STRING,
    url: DataTypes.STRING,
    messageId: DataTypes.STRING,
    err: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'JokeQueue',
  });
  return JokeQueue;
};