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
      link: DataTypes.STRING,
      length: DataTypes.INTEGER,
      tags: DataTypes.ARRAY(DataTypes.STRING),
    },
    {
      sequelize,
      modelName: 'Video',
    },
  );

  return Video;
};
