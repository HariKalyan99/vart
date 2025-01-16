const animals = require("../db/models/animals");

const allAnimals = async() => {
    try {
        const result = await animals.findAll({});
        return result;
      } catch (error) {
        throw error;
      }
}

const deleteAnimal = async (animalId) => {
    try {
      const result = await animals.destroy({
        where: { id: animalId },
      });
  
      if (result === 0) {
        throw new Error('Animal not found or already deleted');
      }
  
      return 'Animal deleted successfully';
    } catch (error) {
      throw error;
    }
  };
  


module.exports = {allAnimals, deleteAnimal}