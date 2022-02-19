'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image_product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image_product.belongsTo(models.Products,{
        as: "product", 
        foreignKey: "idproducts" 
       })
    }
  }
  Image_product.init({
    urlName: DataTypes.STRING,
    idproducts: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Image_product',
  });
  return Image_product;
};    