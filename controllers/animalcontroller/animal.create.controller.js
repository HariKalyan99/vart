const AuthServices = require("../../services/auth.services");
const { animalSignup } = new AuthServices();
const validator = require("validator");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const config = require("../../config");
const crypto = require('crypto');

generateResetToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

module.exports = animalCreateController = async (request, response) => {
  const {
    animalname,
    animalRole,
    email,
    phoneNumber,
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
        message: "You don't have permission to perform this action",
      });
    }

    const newPassword = generateResetToken();

    if (!animalname || !email) {
      return response.status(400).json({
        status: "failed",
        message: "Mandatory fields: email, animalname",
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

    const hashedPassword = await bcrypt.hash(newPassword, 10);
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
      subject: "New password for your account!",
      text: `Account has been created! You can login to your account using this password=${newPassword}, note: please don't share this password elseware. Feel free to reset your password`,
    };

    await transporter.sendMail(mailOptions);
    return response.status(200).json({
      status: "success",
      message: `Password has been sent to ${animalname}'s email`,
      data: newanimal,
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
        .json({ status: "failed", message: "Invalid DOB" });
    } else if (name === "SequelizeDatabaseError") {
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

