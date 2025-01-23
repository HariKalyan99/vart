const express = require('express');
const authentication = require('../middlewares/auth.middleware');
const authSignupController = require('../controllers/authcontroller/auth.signup.controller');
const authLoginController = require('../controllers/authcontroller/auth.login.controller');
const authLogoutController = require('../controllers/authcontroller/auth.logout.controller');
const forgotPasswordController = require('../controllers/authcontroller/auth.forgotpwd.controller');
const resetPasswordController = require('../controllers/authcontroller/auth.resetpwd.controller');


const router = express.Router();

router.post("/signup", authSignupController);
router.post("/login", authLoginController);
router.get("/logout", authentication, authLogoutController);
router.post("/forgotpassword", forgotPasswordController);
router.post("/resetpassword", resetPasswordController)


module.exports = router;