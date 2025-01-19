const validator = require("validator");
const bcrypt = require("bcryptjs");
const config = require("../config");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");

const {
  animalSignup,
  animalLogin,
  animalLogout,
} = require("../services/auth.services");
const jwt = require("jsonwebtoken");
const { editAnimal } = require("../services/animal.services");
const animals = require("../db/models/animals");

const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtsecret, {
    expiresIn: config.jwtexpiresin,
  });
};

const signupController = async (request, response) => {
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

const loginController = async (request, response) => {
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
      return response
        .status(200)
        .json({
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
    });
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

const logoutController = async (request, response) => {
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
      return response.status(200).json({
        message: "Logout successfull",
        status: "success",
      });
    } else {
      return response
        .status(400)
        .json({ status: "failed", message: "Unable to logout" });
    }
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

const generateResetToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

const forgotPasswordController = async (request, response) => {
  const { email } = request.body;

  try {
    const animal = await animals.findOne({
      where: { email },
    });

    if (!animal) {
      return response
        .status(400)
        .json({ status: "failed", message: "Email not found" });
    }

    
    if(animal?.dataValues.isLoggedIn){
      console.log(animal.dataValues)
      await editAnimal(animal.dataValues.id, {
        isLoggedIn: false,
      });
      await animalLogout(response);
    }

    const resetToken = generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await editAnimal(animal.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry,
    });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: config.appemail,
        pass: config.apppwd,
      },
    });

    const mailOptions = {
      from: config.appemail,
      to: email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Please copy the access password below to reset your password: access_password=${resetToken}`,
    };

    await transporter.sendMail(mailOptions);

    return response.status(200).json({
      status: "success",
      message: "Password reset link has been sent to your email",
    });
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

const resetPasswordController = async (request, response) => {
  const { token, newPassword, confirmPassword } = request.body;
 
  try {
    if (!newPassword || newPassword.length < 7) {
      return response.status(400).json({
        status: "failed",
        message: "Password must be at least 7 characters long",
      });
    }

    if (newPassword !== confirmPassword) {
      return response
        .status(400)
        .json({ status: "failed", message: "Passwords do not match" });
    }

    const animal = await animals.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() },
      },
    });

    if (!animal) {
      return response
        .status(400)
        .json({ status: "failed", message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await animal.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: config.appemail,
        pass: config.apppwd,
      },
    });

    const mailOptions = {
      from: config.appemail,
      to: email,
      subject: "Password Reset",
      text: `Password has been reset!`,
    };

    await transporter.sendMail(mailOptions);

    return response.status(200).json({
      status: "success",
      message: "Your password has been reset successfully",
    });
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

module.exports = {
  signupController,
  loginController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
  generateResetToken
};
