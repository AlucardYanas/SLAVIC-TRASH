'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    static associate(models) {
      Video.hasMany(models.Like, { foreignKey: 'videoId' });
      Video.hasMany(models.History, { foreignKey: 'videoId' });
      Video.hasMany(models.WatchedVideo, { foreignKey: 'videoId' });
    }
  }

  Video.init(
    {
      title: DataTypes.STRING,
      videoPath: DataTypes.STRING,

      length: DataTypes.INTEGER,

      thumbnailPath: DataTypes.STRING,  // Добавлено поле для хранения пути к превьюшке
    },
    {
      sequelize,
      modelName: 'Video',
    },
  );

  return Video;
};
