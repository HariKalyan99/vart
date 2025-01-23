const express = require("express");
const authentication = require("../middlewares/auth.middleware");
const animalListController = require("../controllers/animalcontroller/animal.list.controller");
const getAnimalController = require("../controllers/animalcontroller/animal.byId.controller");
const animalPostController = require("../controllers/animalcontroller/animal.create.controller");
const animalDeleteController = require("../controllers/animalcontroller/animal.remove.controller");
const animalEditController = require("../controllers/animalcontroller/animal.edit.controller");

const router = express.Router();

router.get("/animalslist", authentication, animalListController);
router.get("/findanimal/:id", authentication, getAnimalController);
router.post("/animalcreate", authentication, animalPostController);
router.delete("/animalremove/:animalId", authentication, animalDeleteController);
router.put("/animaledit/:animalId", authentication, animalEditController);

module.exports = router;
