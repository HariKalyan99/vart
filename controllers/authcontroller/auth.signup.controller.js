const validator = require("validator");
const bcrypt = require("bcryptjs");
const AuthServices = require("../../services/auth.services");
const { animalSignup } = new AuthServices();


module.exports = signupController = async (request, response) => {
  const {
    animalname,
    animalRole,
    email,
    phoneNumber,
    password,
    confirmPassword,
  } = request.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  try {
    if (["zookeeper"].includes(animalRole)) {
      return response
        .status(400)
        .json({ status: "failed", message: "Invalid role" });
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

    const hashedPassword = await bcrypt.hash(password, 10);
    const newanimal = await animalSignup({
      animalname,
      animalRole: "kingofjungle",
      email,
      phoneNumber,
      password: hashedPassword,
    });
    if (!newanimal) {
      return response
        .status(400)
        .json({ status: "failed", message: "Error creating the animal" });
    }

    return response.status(201).json({
      status: "success",
      data: newanimal,
      message: "Registered successfully",
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
        .json({ status: "failed", message: "Invalid credentials" });
    } else {
      return response
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }
};
