const user = require("../db/models/user");


const userSignup = async (body) => {
  try {
    const newUser = await user.create({
      ...body,
    });
    const result = await user.findOne({
      where: { id: newUser.id }, 
      attributes: { exclude: ['password', 'deletedAt'] },
    });
    return result;
  } catch (error) {
    throw error
  }
};

const userLogin = async (email) => {
  try {
    const result = await user.findOne({ where: { email } });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  userLogin, userSignup
};