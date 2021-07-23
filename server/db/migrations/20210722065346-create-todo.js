/*
 * @Description  :
 * @Author       : pacino
 * @Date         : 2021-07-22 14:53:46
 * @LastEditTime : 2021-07-22 17:26:43
 * @LastEditors  : pacino
 */
"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Todos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      deadline: {
        type: Sequelize.DATE,
      },
      content: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.INTEGER,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Todos");
  },
};
