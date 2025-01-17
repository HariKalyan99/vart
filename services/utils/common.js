const { Op } = require("sequelize");
const animals = require("../../db/models/animals");

const animalExists = async (field, value, excludeId) => {
  let result;
    try {
    if (excludeId) {
        result = await animals.findOne({
        where: {
          [field]: value,
          id: { [Op.ne]: excludeId },
        },
      });
    } else {
        result = await animals.findOne({
        where: {
          [field]: value,
        },
      });
    }

    return result !== null;
  } catch (error) {
    throw error;
  }
};
module.exports = animalExists;
