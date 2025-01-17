const express = require('express');
const { signupController, loginController, logoutController, resetPasswordController, forgotPasswordController} = require('../controllers/auth.controller');
const authentication = require('../middlewares/auth.middleware');

const router = express.Router();


router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/logout", authentication, logoutController);
router.post("/forgotpassword", authentication, forgotPasswordController);
router.post("/resetpassword", authentication, resetPasswordController)


module.exports = router;