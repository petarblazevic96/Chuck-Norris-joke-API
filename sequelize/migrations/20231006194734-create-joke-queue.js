'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('JokeQueues', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      jobId: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.TEXT
      },
      value: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      messageId: {
        type: Sequelize.STRING
      },
      err: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('JokeQueues');
  }
};