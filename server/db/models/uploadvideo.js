'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UploadVideo extends Model {
    static associate(models) { 
    }
  }
  UploadVideo.init({
    title: DataTypes.STRING,
    videoPath: DataTypes.STRING,
    length: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UploadVideo',
  });
  return UploadVideo;
};