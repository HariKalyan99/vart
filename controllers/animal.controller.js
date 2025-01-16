const { allAnimals, deleteAnimal } = require("../services/animal.services");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { animalSignup } = require("../services/auth.services");


const animalListController = async(request, response) => {
    try {
        const result = await allAnimals();
        return response.status(200).json({
          status: true,
          data: result,
        });
      } catch (error) {
        return response
        .status(500)
        .json({ status: "error", message: "Internal server error" });
  }
}

const animalDeleteController = async(request, response) => {
    const {animalId} =  request.params;
    const {dataValues} = request.animal;
    const {animalRole, id} = dataValues
    console.log(id, animalId)

    try {
        if(animalRole === "kingofjungle" || animalRole === "queenofjungle"){
            return response.status(400).json({status: "failed", message: "You are not allowed to access this feature!"})
        }

        if(String(animalId) === String(id)){
            return response.status(400).json({status: "failed", message: "You can't delete your own profile"})
        }
        const result = await deleteAnimal(animalId);
        return response.status(200).json({status: "success", message: result});
    } catch (error) {
        return response
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }

}



const animalPostController = async (request, response) => {
    const { animalname, animalRole, email, phoneNumber, password, confirmPassword, address, contributions} =
      request.body;
    const {dataValues} = request.animal;
    const {animalRole: ar} =  dataValues;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    try {
        if (ar !== "zookeeper") {
          return response
            .status(400)
            .json({ status: "failed", message: "You are not allowed to use this feature" });
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

      if(contributions?.length > 100){
        return response.status(400).json({status: "failed", message: "exeeding contributions!"})
      }
      
      if(address?.length > 200){
        return response.status(400).json({status: "failed", message: "exeeding address!"})
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newanimal = await animalSignup({
        animalname,
        animalRole,
        email,
        phoneNumber,
        password: hashedPassword,
        contributions: contributions || "",
        address: address || ""
      });
      if (!newanimal) {
        return response
          .status(400)
          .json({ status: "failed", message: "Error creating the animal" });
      }
  
      return response.status(201).json({ status: "success", data: newanimal });
    } catch (error) {
        console.log(error);
        return response
          .status(500)
          .json({ status: "error", message: "Internal server error" });
      }
  };


module.exports = { animalListController, animalDeleteController, animalPostController}