const validator = require("validator");
const bcrypt = require("bcryptjs");
const config = require("../../config");
const AuthServices = require("../../services/auth.services");
const { animalLogin } = new AuthServices();
const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtsecret, {
    expiresIn: config.jwtexpiresin,
  });
};


module.exports = loginController = async (request, response) => {
  const { email, password } = request.body;
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
      return response.status(401).json({ message: "Invalid credentials" });
    }

    if (result.isLoggedIn) {
      return response.status(200).json({
        status: "warning",
        message: "Your account is logged in already",
      });
    }
    await editAnimal(result.id, {
      isLoggedIn: true,
    });

    const token = generateToken({ id: result.id });

    response.cookie("jwt", token, {
      httpOnly: config.NODE_ENV === "production",
      secure: config.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 1000,
      path: "/",
      sameSite: "Lax", //for csrf attacks
    });

    return response.status(200).json({
      message: "logged in successfully",
      status: "success",
      role: result.animalRole,
      id: result.id,
      name: result.animalname,
    });
  } catch (error) {
    return response
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};