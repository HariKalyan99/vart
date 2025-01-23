const AnimalServices = require("../../services/animal.services");
const { allAnimals } = new AnimalServices();

module.exports = animalListController = async (request, response) => {
    try {
      const { animal } = request;
      const { dataValues } = animal;
      const { id } = dataValues;
      const result = await allAnimals(id);
      return response.status(200).json({
        status: true,
        data: result,
        totalAnimalData: result.length,
      });
    } catch (error) {
      return response
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  };