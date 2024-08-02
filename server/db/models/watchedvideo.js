'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WatchedVideo extends Model {
    static associate(models) {
      WatchedVideo.belongsTo(models.User, { foreignKey: 'userId' });
      WatchedVideo.belongsTo(models.Video, { foreignKey: 'videoId' });
    }
  }

  WatchedVideo.init(
    {
      userId: DataTypes.INTEGER,
      videoId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'WatchedVideo',
    },
  );

  return WatchedVideo;
};
