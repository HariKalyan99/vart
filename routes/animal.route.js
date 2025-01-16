const express = require("express");
const authentication = require("../middlewares/auth.middleware");
const {
  animalListController,
  animalDeleteController,
  animalPostController,
} = require("../controllers/animal.controller");

const router = express.Router();

router.get("/animalslist", authentication, animalListController);
router.post("/animalcreate", authentication, animalPostController);
router.delete("/animalremove/:animalId", authentication, animalDeleteController);

module.exports = router;
