'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');
const sequelize = require('../../connections/connectToSQL');

module.exports =  sequelize.define('users', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  userRole: {
    type: Sequelize.ENUM("principal", "teacher", "student"),
    unique: true,
    allowNull: true,
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notNull: {
        msg: "username cannot be null",
      },
      notEmpty: {
        msg: "username cannot be empty",
      },
    },
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notNull: {
        msg: "email cannot be null",
      },
      notEmpty: {
        msg: "email cannot be empty",
      },
    },
  },
  phoneNumber: {
    type: Sequelize.INTEGER,
    unique: true,
    allowNull: true,
  },
  password: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notNull: {
        msg: "password cannot be null",
      },
      notEmpty: {
        msg: "password cannot be empty",
      },
    },
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
  deletedAt: {
    type: Sequelize.DATE,
  },
}, {
  paranoid: true,
  freezeTableName: true,
  modelName: "users",
})