const validator = require("validator");
const bcrypt = require("bcryptjs");
const config = require("../config");
const { animalSignup, animalLogin } = require("../services/auth.services");
const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtsecret, {
    expiresIn: config.jwtexpiresin,
  });
};

const signupController = async (request, response) => {
  const { animalname, animalRole, email, phoneNumber, password, confirmPassword } =
    request.body;
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
      animalRole,
      email,
      phoneNumber,
      password: hashedPassword,
    });
    if (!newanimal) {
      return response
        .status(400)
        .json({ status: "failed", message: "Error creating the animal" });
    }

    return response.status(201).json({ status: "success", data: newanimal });
  } catch (error) {
    const { errors, name } = error;
    if (name === "SequelizeUniqueConstraintError") {
      return response
        .status(400)
        .json({ status: "failed", message: errors[0].message });
    }else if(name === "SequelizeDatabaseError"){
        return response.status(400).json({status: "failed", message: "Invalid role"})
    } else {
      return response
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }
};

const loginController = async(request, response) => {
    const { email, password } =
    request.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  try {
    if (!email || !password) {
      return response.status(400).json({
        status: "failed",
        message: "email and password are required",
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

    const result = await animalLogin(email);

    if (!result) {
      return response.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordVerified = await bcrypt.compare(password, result.password);

    if (!isPasswordVerified) {
      logger.error("Invalid credentials");
      return response.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ id: result.id });

    return response.status(200).json({
      message: "logged in successfully",
      status: "success",
      role: result.animalRole,
      token,
    });

  } catch (error) {
    console.log(error);
      return response
        .status(500)
        .json({ status: "error", message: "Internal server error" });
  }
};

const animalListController = async(request, response) => {
    try {
        
    } catch (error) {
        
    }
}

module.exports = { signupController, loginController };
