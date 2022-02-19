'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Products.belongsTo(models.Categorys,{
        foreignKey:'idCategory',
        as:'category'
      }),
      Products.belongsTo(models.Styles,{
        as: "Styles", 
        foreignKey: "idStyle" 
       }),
      Products.belongsTo(models.Colours,{
        as: "Colours", 
        foreignKey: "idColour" 
       }),
       Products.belongsTo(models.Sizes,{
        as: "Sizes", 
        foreignKey: "idSize" 
       }),
       Products.belongsTo(models.Visibility,{
        as: "Visibility", 
        foreignKey: "idVisibility" 
       }),
       Products.belongsTo(models.Stars,{
        as: "Stars", 
        foreignKey: "idStar" 
       }),
       Products.hasMany(models.Image_product,{
        as: "ImageProduct", 
        foreignKey: "idproducts" 
       })

    }
  }
  Products.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    idCategory: DataTypes.INTEGER,
    idSize: DataTypes.INTEGER,
    idColour: DataTypes.INTEGER,
    idStyle: DataTypes.INTEGER,
    idVisibility: DataTypes.INTEGER,
    idStar: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};