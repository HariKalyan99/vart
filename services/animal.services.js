const { Op } = require("sequelize");
const animals = require("../db/models/animals");

const allAnimals = async (animalId) => {
  try {
    const result = await animals.findAll({
      where: {
        id: { [Op.ne]: animalId },
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteAnimal = async (animalId) => {
  try {
    const result = await animals.destroy({
      where: { id: animalId },
    });

    if (result === 0) {
      throw new Error("Animal not found or already deleted");
    }

    return "Animal deleted successfully";
  } catch (error) {
    throw error;
  }
};

const editAnimal = async (animalId, updatedFields) => {
  try {
    const animal = await animals.findByPk(animalId);

    if (!animal) {
      throw new Error("Animal not found");
    }

    const result = await animal.update(updatedFields);

    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = { allAnimals, deleteAnimal, editAnimal };

