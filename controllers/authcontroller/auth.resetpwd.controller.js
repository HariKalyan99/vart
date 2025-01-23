const bcrypt = require("bcryptjs");
const config = require("../../config");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
const animals = require("../../db/models/animals");


module.exports = resetPasswordController = async (request, response) => {
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
      to: animal.email,
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