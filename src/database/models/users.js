'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.belongsTo(models.Roles,{
        foreignKey:'idRoles',
        as:'roles'
      });
      Users.hasMany(models.Image_users,{
        foreignKey:'idUsers',
        as:'image_users'
      })
    }
  }
  Users.init({
    name: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    userName: DataTypes.STRING,
    dni: DataTypes.INTEGER,
    date_of_birth: DataTypes.DATE,
    idRoles: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};