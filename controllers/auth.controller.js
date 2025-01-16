const user = require("../db/models/user");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const config = require("../config");
const { userSignup, userLogin } = require("../services/auth.services");
const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtsecret, {
    expiresIn: config.jwtexpiresin,
  });
};

const signupController = async (request, response, next) => {
  const { username, userRole, email, phoneNumber, password, confirmPassword } =
    request.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  try {
    if (["admin"].includes(userRole)) {
      return response
        .status(400)
        .json({ status: "failed", message: "Invalid user role" });
    }

    if (!username || !email || !password) {
      return response.status(400).json({
        status: "failed",
        message: "Mandatory fields: email, password, username",
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
    const newUser = await userSignup({
      username,
      userRole,
      email,
      phoneNumber,
      password: hashedPassword,
    });
    if (!newUser) {
      return response
        .status(400)
        .json({ status: "failed", message: "Error creating the user" });
    }

    return response.status(201).json({ status: "success", data: newUser });
  } catch (error) {
    const { errors, name } = error;
    if (name === "SequelizeUniqueConstraintError") {
      return response
        .status(400)
        .json({ status: "failed", message: errors[0].message });
    }else if(name === "SequelizeDatabaseError"){
        return response.status(400).json({status: "failed", message: "Invalid user role"})
    } else {
      return response
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }
};

const LoginController = async(request, response, next) => {
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

    const result = await userLogin(email);

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
      message: "User logged in successfully",
      status: "success",
      user: result.userRole,
      token,
    });

  } catch (error) {
    console.log(error);
      return response
        .status(500)
        .json({ status: "error", message: "Internal server error" });
  }
};

module.exports = { signupController, LoginController };
