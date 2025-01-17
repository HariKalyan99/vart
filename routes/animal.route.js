const express = require("express");
const authentication = require("../middlewares/auth.middleware");
const {
  animalListController,
  animalDeleteController,
  animalPostController,
  animalEditController,
} = require("../controllers/animal.controller");

const router = express.Router();

router.get("/animalslist", authentication, animalListController);
router.post("/animalcreate", authentication, animalPostController);
router.delete("/animalremove/:animalId", authentication, animalDeleteController);
router.put("/animaledit/:animalId", authentication, animalEditController);

module.exports = router;
