const { config } = require("dotenv");
const jwt = require("jsonwebtoken");
const animals = require("../db/models/animals");


const authentication = async (request, response, next) => {
  const authorizationHeader = request.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
    return response.status(401).json({ error: "Please log in to get access" });
  }
  
  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    return response.status(401).json({ error: "Token missing. Please log in" });
  }

  try {
    const decodedToken = jwt.verify(token, config.jwtsecret);
    const animalId = decodedToken.id;

    const animalExist = await animals.findByPk(animalId);
    if (!animalExist) {
      return response.status(404).json({ error: "Animal no longer exists" });
    }

    request.animal = animalExist;
    next();
  } catch (error) {
    return response.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authentication;
