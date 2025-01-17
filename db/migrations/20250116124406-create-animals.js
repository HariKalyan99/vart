"use strict";


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("animals", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      animalRole: {
        type: Sequelize.ENUM("zookeeper", "kingofjungle", "queenofjungle"),
        allowNull: true,
      },
      animalname: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          is: /^[0-9]+$/i, 
          len: [10],
        },
      },
      password: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: [0, 200],
        },
      },
      dob: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      contributions: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: [0, 100],
        },
      },
      category: {
        type: Sequelize.ENUM("herbivores", "carnivores", "omnivores", "amphibian", "reptiles"),
        allowNull: true,
      },
      requestForRole: {
        type: Sequelize.ENUM("zookeeper", "kingofjungle", "queenofjungle")
      },
      resetPasswordToken: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      resetPasswordExpires: {
        type: Sequelize.DATE,
        allowNull: true,
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("animals");
  },
};
