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
        foreignKey: "Styles_idStyles" 
       }),
      Products.belongsTo(models.Colours,{
        as: "Colours", 
        foreignKey: "Colours_idColours" 
       }),
       Products.belongsTo(models.Sizes,{
        as: "Sizes", 
        foreignKey: "Sizes_idSizes" 
       }),
       Products.belongsTo(models.Image_product,{
        as: "Image_product", 
        foreignKey: "Sizes_idSizes" 
       }),
       Products.belongsTo(models.Visibility,{
        as: "Visibility", 
        foreignKey: "Visibility_idVisibility" 
       }),
       Products.belongsTo(models.Stars,{
        as: "Stars", 
        foreignKey: "Stars_idStars" 
       }),
       Products.hasMany(models.Image_product,{
        as: "Image_product", 
        foreignKey: "description" 
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