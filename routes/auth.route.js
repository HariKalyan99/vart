const express = require('express');
const { signupController, loginController, userListController } = require('../controllers/auth.controller');
const authentication = require('../middlewares/auth.middleware');

const router = express.Router();


router.post("/signup", signupController);
router.post("/login", loginController);
// router.get("/animalslist", authentication, userListController);


module.exports = router;