const AnimalServices = require("../../services/animal.services");
const { editAnimal } = new AnimalServices();
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { animalExists } = require("../../services/utils/common");



module.exports = animalEditController = async (request, response) => {
    const {
      animalname,
      animalRole,
      email,
      phoneNumber,
      password,
      confirmPassword,
      address,
      contributions,
      dob,
      category,
      requestForRole,
    } = request.body;
  
    const { animalId } = request.params;
  
    let animal;
    try {
      animal = await animalExists("id", animalId);
      if (!animal) {
        return response.status(404).json({
          status: "failed",
          message: "Animal not found",
        });
      }
    } catch (error) {
      return response.status(500).json({
        status: "error",
        message: "Error fetching animal",
      });
    }
    const { dataValues } = request.animal;
    const {
      animalRole: ar,
      email: existingEmail,
      phoneNumber: existingPhoneNumber,
    } = dataValues;
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    try {
      // if (ar === "kingofjungle") {
      //   return response.status(400).json({
      //     status: "failed",
      //     message: "You don't have permission to perform this action",
      //   });
      // }
      if (
        !animalname &&
        !email &&
        !phoneNumber &&
        !address &&
        !dob &&
        !category &&
        !contributions &&
        !password
      ) {
        return response.status(400).json({
          status: "failed",
          message: "At least one field must be provided for editing",
        });
      }
  
      if (email && (!validator.isEmail(email) || !emailRegex.test(email))) {
        return response
          .status(400)
          .json({ status: "failed", message: "Email is invalid" });
      }
  
      if (password && confirmPassword && password !== confirmPassword) {
        return response.status(400).json({
          status: "failed",
          message: "Password and Confirm password must be the same",
        });
      }
  
      let hashedPassword;
      if (password) {
        if (password.length < 7) {
          return response.status(400).json({
            status: "failed",
            message: "Password must be at least 7 characters long",
          });
        }
        hashedPassword = await bcrypt.hash(password, 10);
      }
  
      if (
        category &&
        ![
          "herbivores",
          "carnivores",
          "omnivores",
          "amphibian",
          "reptiles",
        ].includes(category)
      ) {
        return response
          .status(400)
          .json({ status: "failed", message: "Invalid category" });
      }
  
      if (dob && new Date(dob) > new Date()) {
        return response
          .status(400)
          .json({ status: "failed", message: "Invalid date of birth" });
      }
  
      if (contributions?.length > 100) {
        return response.status(400).json({
          status: "failed",
          message: "Contributions length exceeds limit",
        });
      }
  
      if (address?.length > 200) {
        return response
          .status(400)
          .json({ status: "failed", message: "Address length exceeds limit" });
      }
  
      if (animalRole && requestForRole && animalRole === requestForRole) {
        return response.status(400).json({
          status: 400,
          message: "Role and requested role cannot be the same",
        });
      }
  
      const updatedAnimal = await editAnimal(animalId, {
        animalname: animalname || animal.animalname,
        animalRole: animalRole || animal.animalRole,
        email: email || animal.email,
        phoneNumber: phoneNumber || animal.phoneNumber,
        password: hashedPassword || animal.password,
        contributions: contributions || animal.contributions,
        address: address || animal.address,
        dob: dob || animal.dob,
        requestForRole: requestForRole || animal.requestForRole,
        category: category || animal.category,
      });
  
      if (!updatedAnimal) {
        return response
          .status(400)
          .json({ status: "failed", message: "Error updating animal" });
      }
  
      return response.status(200).json({
        status: "success",
        data: updatedAnimal,
        message: "Updated successfully",
      });
    } catch (error) {
    

      const { errors, name, parent } = error;
      if (name === "SequelizeUniqueConstraintError") {
        return response
          .status(400)
          .json({ status: "failed", message: errors[0].message });
      } else if (name === "SequelizeDatabaseError" && parent?.code === "22003") {
        return response
          .status(400)
          .json({ status: "failed", message: "Invalid phone number" });
      } else if (name === "SequelizeDatabaseError" && parent?.code !== "22003") {
        return response
          .status(400)
          .json({ status: "failed", message: "Invalid inputs" });
      } else {
        return response
          .status(500)
          .json({ status: "error", message: "Internal server error" });
      }
    }
  };
  