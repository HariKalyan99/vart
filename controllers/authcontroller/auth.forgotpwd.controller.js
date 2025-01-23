const config = require("../../config");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const AuthServices = require("../../services/auth.services");
const { animalLogout } = new AuthServices();
const { editAnimal } = require("../../services/animal.services");
const { animalFind } = require("../../services/utils/common");

const generateResetToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

module.exports = forgotPasswordController = async (request, response) => {
  const { email } = request.body;

  try {
    const animal = await animalFind("email", email);
    if (!animal) {
      return response
        .status(400)
        .json({ status: "failed", message: "Email not found" });
    }

    if (animal?.dataValues.isLoggedIn) {
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