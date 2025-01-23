const AuthServices = require("../../services/auth.services");
const { animalLogout } = new AuthServices();
const { editAnimal } = require("../../services/animal.services");

module.exports = logoutController = async (request, response) => {
  try {
    const { isLoggedIn, id } = request.animal;
    const result = await animalLogout(response);
    if (!isLoggedIn) {
      return response
        .status(400)
        .json({ status: "failed", message: "You are not logged in!" });
    }

    await editAnimal(id, {
      isLoggedIn: false,
    });

    if (result) {
      request.session.destroy((err) => {
        if (err) {
          return response.status(500).json({ error: "Error logging out" });
        }

        return response.status(200).json({
          message: "Logout successfull",
          status: "success",
        });
      });
    } else {
      return response
        .status(400)
        .json({ status: "failed", message: "Unable to logout" });
    }
  } catch (error) {
    return response
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};