const multer = require("multer");
const fs = require("fs");
const csv = require("csv-parser");
const crypto = require("crypto");
const AuthServices = require("../../services/auth.services");
const { animalBulkCreate } = new AuthServices();
const validator = require("validator");
const bcrypt = require("bcryptjs");

const generateResetToken = () => {
  return crypto.randomBytes(20).toString("hex");
}; // needed for mail sending!

module.exports = createManyAnimalsController = async (request, response) => {
  const { dataValues } = request.animal;
  const { animalRole: ar } = dataValues;
  if (ar === "kingofjungle" || ar === "queenofjungle") {
    return response.status(400).json({
      status: "failed",
      message: "You don't have permission to perform this action",
    });
  }
  const upload = multer({
    dest: "uploads/",
  }).single("csvfile");

  const uploadPath = "./uploads";
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }

  upload(request, response, async (err) => {
    if (err) {
      return response
        .status(500)
        .json({ status: "error", message: "File upload failed" });
    }

    // console.log('Request file:', request.file);
    // console.log('Request body:', request.body);

    const filePath = request.file ? request.file.path : null;

    if (!filePath) {
      return response
        .status(400)
        .json({ status: "error", message: "No file uploaded" });
    }

    try {
      const validationErrors = [];
      const validAnimalsData = [];

      const results = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          results.push(row);
        })
        .on("end", async () => {
          for (const row of results) {
            const { animalname, email, phoneNumber, category, dob } = row;

            if (!animalname || !email || !phoneNumber) {
              validationErrors.push(
                `Missing mandatory fields in row: ${JSON.stringify(row)}`,
              );
              continue;
            }

            if (!validator.isEmail(email)) {
              validationErrors.push(
                `Invalid email in row: ${JSON.stringify(row)}`,
              );
              continue;
            }

            if (
              !validator.isMobilePhone(phoneNumber) ||
              phoneNumber.length !== 10
            ) {
              validationErrors.push(
                `Invalid phone number in row: ${JSON.stringify(row)}`,
              );
              continue;
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
              validationErrors.push(
                `Invalid category in row: ${JSON.stringify(row)}`,
              );
              continue;
            }

            if (dob && new Date(dob) > new Date()) {
              validationErrors.push(
                `Invalid date of birth in row: ${JSON.stringify(row)}`,
              );
              continue;
            }

            // Hash password for each record
            const newPassword = `${animalname.slice(0, 4)}1234567`;
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            const newAnimal = {
              animalname,
              email,
              phoneNumber,
              category,
              dob: dob || null,
              password: hashedPassword,
            };

            validAnimalsData.push(newAnimal);
          }

          if (validationErrors.length > 0) {
            return response.status(400).json({
              status: "failed",
              message: "Some records failed validation",
              errors: validationErrors,
            });
          }

          if (validAnimalsData.length > 0) {
            try {
              const createdAnimals = await animalBulkCreate(validAnimalsData);
              return response.status(200).json({
                status: "success",
                message:
                  "Animals created successfully, password would be shared to mail, but you can access_password first fourletter following with 1234567",
                data: createdAnimals,
              });
            } catch (error) {
              if (error.errors[0]?.message?.length > 0) {
                return response.status(500).json({
                  status: "error",
                  message: error.errors,
                  error: error.message,
                });
              }
              return response.status(500).json({
                status: "error",
                message: "Error creating animals",
                error: error.message,
              });
            }
          } else {
            return response.status(400).json({
              status: "failed",
              message: "No valid animal records to create",
            });
          }
        })
        .on("error", (err) => {
          return response
            .status(500)
            .json({
              status: "error",
              message: "Error parsing the CSV file",
              error: err.message,
            });
        });
    } catch (error) {
      console.log(error);
      return response.status(500).json({
        status: "error",
        message: "Error processing the file",
        error: error.message,
      });
    }
  });
};
