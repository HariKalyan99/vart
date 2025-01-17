const { allAnimals, deleteAnimal, editAnimal } = require("../services/animal.services");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { animalSignup } = require("../services/auth.services");
const animalExists = require("../services/utils/common");

const animalListController = async (request, response) => {
  try {
    const { animal } = request;
    const { dataValues } = animal;
    const { id } = dataValues;
    const result = await allAnimals(id);
    return response.status(200).json({
      status: true,
      data: result,
      totalAnimalData: result.length
    });
  } catch (error) {
    return response
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

const animalDeleteController = async (request, response) => {
  const { animalId } = request.params;
  const { dataValues } = request.animal;
  const { animalRole, id } = dataValues;

  try {
    if (animalRole === "kingofjungle" || animalRole === "queenofjungle") {
      return response.status(400).json({
        status: "failed",
        message: "You are not allowed to access this feature!",
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

const animalPostController = async (request, response) => {
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

  const { dataValues } = request.animal;
  const { animalRole: ar } = dataValues;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  try {
    if (ar !== "zookeeper") {
      return response.status(400).json({
        status: "failed",
        message: "You are not allowed to use this feature",
      });
    }

    if (!animalname || !email || !password) {
      return response.status(400).json({
        status: "failed",
        message: "Mandatory fields: email, password, animalname",
      });
    }

    if (password?.length < 7) {
      return response.status(400).json({
        status: "failed",
        message: "Password must be atleast 7 characters long",
      });
    }

    if (!validator.isEmail(email) || !emailRegex.test(email)) {
      return response
        .status(400)
        .json({ status: "failed", message: "Email is invalid" });
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
        .json({ status: "failed", message: "Invalid input" });
    }

    if (dob && new Date(dob) > new Date()) {
      return response
        .status(400)
        .json({ status: "failed", message: "Invalid date of birth" });
    }

    if (
      !validator.isMobilePhone(phoneNumber) ||
      String(phoneNumber)?.length !== 10
    ) {
      return response
        .status(400)
        .json({ status: "failed", message: "Please enter a valid phone" });
    }

    if (password !== confirmPassword) {
      return response.status(400).json({
        status: "failed",
        message: "Password and Confirm password must be same",
      });
    }

    if (
      requestForRole &&
      !["zookeeper", "kingofjungle", "queenofjungle"].includes(requestForRole)
    ) {
      return response
        .status(400)
        .json({ status: "failed", message: "Please enter a valid input" });
    }

    if (contributions?.length > 100) {
      return response
        .status(400)
        .json({ status: "failed", message: "exeeding contributions!" });
    }

    if (address?.length > 200) {
      return response
        .status(400)
        .json({ status: "failed", message: "exeeding address!" });
    }

    if (animalRole && requestForRole && animalRole === requestForRole) {
      return response
        .status(400)
        .json({ status: 400, message: "role and requested role is same!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newanimal = await animalSignup({
      animalname,
      animalRole,
      email,
      phoneNumber,
      password: hashedPassword,
      contributions: contributions || "",
      address: address || "",
      dob: dob || null,
      requestForRole: requestForRole || null,
      category: category || null,
    });
    if (!newanimal) {
      return response
        .status(400)
        .json({ status: "failed", message: "Error creating the animal" });
    }

    return response.status(201).json({ status: "success", data: newanimal });
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
        .json({ status: "failed", message: "Invalid credentials" });
    } else {
      return response
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }
};

const animalEditController = async (request, response) => {
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
    const { animalRole: ar, email: existingEmail, phoneNumber: existingPhoneNumber } = dataValues;
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    try {
      if (ar === "kingofjungle") {
        return response.status(400).json({
          status: "failed",
          message: "You are not allowed to use this feature",
        });
      }
  
      if (!animalname && !email && !phoneNumber && !address && !dob && !category && !contributions && !password) {
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
  
      if (email && email !== existingEmail) {
        const emailExists = await animalExists("email", email);
        if (emailExists) {
          return response
            .status(400)
            .json({ status: "failed", message: "Email is already taken" });
        }
      }
  
      if (phoneNumber && phoneNumber !== existingPhoneNumber) {
        const phoneExists = await animalExists("phoneNumber", phoneNumber, existingAnimalId);
        if (phoneExists) {
            return response
                .status(400)
                .json({ status: "failed", message: "Phone number is already taken" });
        }
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
        return response
          .status(400)
          .json({ status: "failed", message: "Contributions length exceeds limit" });
      }
  
      if (address?.length > 200) {
        return response
          .status(400)
          .json({ status: "failed", message: "Address length exceeds limit" });
      }
  
      if (animalRole && requestForRole && animalRole === requestForRole) {
        return response
          .status(400)
          .json({ status: 400, message: "Role and requested role cannot be the same" });
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
      });
    } catch (error) {
      const { errors, name, parent } = error;
      console.log(error)
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
          .json({ status: "failed", message: "Invalid credentials" });
      } else {
        return response
          .status(500)
          .json({ status: "error", message: "Internal server error" });
      }
    }
  };
  

module.exports = {
  animalListController,
  animalDeleteController,
  animalPostController,
  animalEditController
};
