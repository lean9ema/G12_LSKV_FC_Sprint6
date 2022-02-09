'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Visibility extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Visibility.hasMany(models.Products,{
        as: "Products", 
        foreignKey: "idVisibility" 
       })
    }
  }
  Visibility.init({
    state: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Visibility',
  });
  return Visibility;
};