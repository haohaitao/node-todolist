/*
 * @Description  :
 * @Author       : pacino
 * @Date         : 2021-08-20 16:16:38
 * @LastEditTime : 2021-08-20 16:32:55
 * @LastEditors  : pacino
 */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class n_optimization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  n_optimization.init(
    {
      host: DataTypes.STRING,
      load: DataTypes.STRING,
      req_date: DataTypes.DATE,
      ip: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "n_optimization",
    }
  );
  return n_optimization;
};
