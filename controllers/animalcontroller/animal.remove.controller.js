const AnimalServices = require("../../services/animal.services");
const { deleteAnimal } = new AnimalServices();

module.exports = animalDeleteController = async (request, response) => {
    const { animalId } = request.params;
    const { dataValues } = request.animal;
    const { animalRole, id } = dataValues;
  
    try {
      if (animalRole === "kingofjungle" || animalRole === "queenofjungle") {
        return response.status(400).json({
          status: "failed",
          message: "You don't have permission to perform this action",
        });
      }
  
      if (String(animalId) === String(id)) {
        return response.status(400).json({
          status: "failed",
          message: "You can't delete your own profile",
        });
      }
      const result = await deleteAnimal(animalId);
      return response.status(200).json({ status: "success", message: result });
    } catch (error) {
      return response
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  };