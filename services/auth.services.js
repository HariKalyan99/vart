const animals = require("../db/models/animals");

class AuthServices {
  animalSignup = async (body) => {
    try {
      const newAnimal = await animals.create({
        ...body,
      });
      const result = await animals.findOne({
        where: { id: newAnimal.id },
        attributes: { exclude: ["password", "deletedAt"] },
      });
      return result;
    } catch (error) {
      throw error;
    }
  };
  animalBulkCreate = async(animalsData) => {
    try {
      const newAnimals = await animals.bulkCreate(animalsData, {
          returning: true,
      });
      const result = await animals.findAll({
          where: {
              id: newAnimals.map(animal => animal.id),
          },
          attributes: { exclude: ["password", "deletedAt"] },
      });
      return result;
  } catch (error) {
      throw error;
  }
  }
  
  animalLogin = async (email) => {
    try {
      const result = await animals.findOne({ where: { email } });
      return result;
    } catch (error) {
      throw error;
    }
  };
  
  animalLogout = async (response) => {
    try {
      response.cookie("jwt", "", {
          httpOnly: true, 
          secure: process.env.NODE_ENV === "production", 
          expires: new Date(0),
          path: "/",
          sameSite: "Lax", 
        });
        return true;
    } catch (error) {
      throw error
    }
  };
}

module.exports = AuthServices;
