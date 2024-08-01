'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserVideo extends Model {
    static associate(models) {
      UserVideo.belongsTo(models.User, { foreignKey: 'userId' });
      UserVideo.belongsTo(models.Video, { foreignKey: 'videoId' });
    }
  }

  UserVideo.init(
    {
      userId: DataTypes.INTEGER,
      videoId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'UserVideo',
    },
  );

  return UserVideo;
};
