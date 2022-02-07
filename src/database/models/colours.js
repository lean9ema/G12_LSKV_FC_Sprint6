'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Colours extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Colours.init({
    name: DataTypes.STRING,
    urlColour: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Colours',
  });
  return Colours;
};