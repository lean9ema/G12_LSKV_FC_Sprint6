'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stars extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Stars.hasMany(models.Products,{
        as: "Product", 
        foreignKey: "idStar" 
       })
    }
  }
  Stars.init({
    cant: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Stars',
  });
  return Stars;
};