'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    static associate(models) {
      History.belongsTo(models.User, { foreignKey: 'userId' });
      History.belongsTo(models.Video, { foreignKey: 'videoId' });
    }
  }

  History.init(
    {
      userId: DataTypes.INTEGER,
      videoId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'History',
    },
  );

  return History;
};
