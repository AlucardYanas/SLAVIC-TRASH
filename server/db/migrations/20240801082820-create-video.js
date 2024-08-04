'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Videos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      videoPath: {
        type: Sequelize.STRING,
      },
      link: {
        type: Sequelize.STRING,
      },
      length: {
        type: Sequelize.INTEGER,
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      thumbnailPath: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Videos');
  },
};
