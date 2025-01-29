const { animalExists } = require("../../services/utils/common");
const AnimalServices = require('../../services/animal.services');
const {editAnimal} = new AnimalServices()

module.exports = animalRoleRequest = async(request, response) => {
    const {requestForRole} = request.body;

    if(!requestForRole){
        return response.status(400).json({status: "failed", message: "No request received"});
    } 

    const {animalId} = request.params;
    let animal;
    try {
      animal = await animalExists("id", animalId);
      if (!animal) {
        return response.status(404).json({
          status: "failed",
          message: "Animal not found",
        });
      }
    } catch (error) {
      return response.status(500).json({
        status: "error",
        message: "Error fetching animal",
      });
    }

    try {
        const { dataValues } = request.animal;
        const {
          animalRole: ar,
        } = dataValues;
    
        if(ar === "zookeeper"){
            return response.status(400).json({status: "failed", message: "You are not allowed to use this feature"})
        }
    
        if(requestForRole && !["zookeeper", "kingofjungle", "queenofjungle"].includes(requestForRole)){
            return response.status(400).json({status:"failed", message: "Invalid request"})
        }
    
        const updatedAnimal =  await editAnimal(animalId, {
            requestForRole: requestForRole || animal.requestForRole,
        })
    
        if(!updatedAnimal){
            return response.status(400).json({status: "failed", message: "Error updating animal"})
        }
    
        return response.status(201).json({status: "success", message: `Role has been requested for ${requestForRole}`});
    } catch (error) {
        return response.status(500).json({status: "failed", message: "Internal server error"})   
    }
}