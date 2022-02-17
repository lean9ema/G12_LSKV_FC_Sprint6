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
      Colours.hasMany(models.Products,{
        as: "Products", 
        foreignKey: "idColour" 
       })
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