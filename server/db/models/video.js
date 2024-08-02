'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    static associate(models) {
      Video.hasMany(models.UserVideo, { foreignKey: 'videoId' });
      Video.hasMany(models.Like, { foreignKey: 'videoId' });
    }
  }

  Video.init(
    {
      title: DataTypes.STRING,
      videoPath: DataTypes.STRING,
      link: DataTypes.STRING,
      length: DataTypes.INTEGER,
      tags: DataTypes.ARRAY(DataTypes.STRING),
      approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      thumbnailPath: DataTypes.STRING,  // Добавлено поле для хранения пути к превьюшке
    },
    {
      sequelize,
      modelName: 'Video',
    },
  );

  return Video;
};
