'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../../connections/connectToSQL');

module.exports =  sequelize.define('animals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      animalRole: {
        type: DataTypes.ENUM("zookeeper", "kingofjungle", "queenofjungle"),
        unique: true,
        allowNull: true,
      },
      animalname: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notNull: {
            msg: "animalname cannot be null",
          },
          notEmpty: {
            msg: "animalname cannot be empty",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
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
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
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
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 200],
        },
      },
      dob: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      contributions: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 100],
        },
      },
      category: {
        type: DataTypes.ENUM("herbivores", "carnivores", "omnivores", "amphibian", "reptiles"),
        allowNull: true,
      },
      requestForRole: {
        type: DataTypes.ENUM("zookeeper", "kingofjungle", "queenofjungle")
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    }, {
  paranoid: true,
  freezeTableName: true,
  modelName: "animals",
})