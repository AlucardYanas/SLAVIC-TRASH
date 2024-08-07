'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.WatchedVideo, { foreignKey: 'userId' });
      User.hasMany(models.Like, { foreignKey: 'userId' });
    }
  }

  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.TEXT,
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
