const { animalFind } = require("../../services/utils/common");

module.exports = getAnimalController = async (request, response) => {
  try {
    const { id } = request.params;

    const result = await animalFind("id", id);
    if (!result) {
      return response
        .status(400)
        .json({ status: "failed", message: "Coudn't find an animal" });
    }
    return response.status(200).json({
      status: true,
      data: result,
      message: "Found",
    });
  } catch (error) {
    
    return response
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};