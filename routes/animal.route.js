const express = require("express");
const authentication = require("../middlewares/auth.middleware");
const {
  animalListController,
  animalDeleteController,
  animalPostController,
  animalEditController,
  getAnimalController,
} = require("../controllers/animal.controller");

const router = express.Router();

router.get("/animalslist", authentication, animalListController);
router.get("/findanimal/:id", authentication, getAnimalController);
router.post("/animalcreate", authentication, animalPostController);
router.delete("/animalremove/:animalId", authentication, animalDeleteController);
router.put("/animaledit/:animalId", authentication, animalEditController);

module.exports = router;
