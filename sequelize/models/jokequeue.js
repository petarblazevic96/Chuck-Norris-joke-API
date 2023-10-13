'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JokeQueue extends Model {}
  
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