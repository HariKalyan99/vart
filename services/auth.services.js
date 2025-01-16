const animals = require("../db/models/animals");


const animalSignup = async (body) => {
  try {
    const newAnimal = await animals.create({
      ...body,
    });
    const result = await animals.findOne({
      where: { id: newAnimal.id }, 
      attributes: { exclude: ['password', 'deletedAt'] },
    });
    return result;
  } catch (error) {
    throw error
  }
};

const animalLogin = async (email) => {
  try {
    const result = await animals.findOne({ where: { email } });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  animalLogin, animalSignup
};