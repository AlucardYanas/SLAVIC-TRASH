'use strict';

const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.UserVideo, { foreignKey: 'userId' });
      User.hasMany(models.Like, { foreignKey: 'userId' });
    }

    // Метод для проверки пароля
    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }

  User.init(
    {
      email: DataTypes.STRING,
      password: {
        type: DataTypes.TEXT,
        set(value) {
          // Хэширование пароля перед сохранением
          this.setDataValue('password', bcrypt.hashSync(value, 10));
        },
      },
      username: DataTypes.STRING,
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
    },
  );

  return User;
};
