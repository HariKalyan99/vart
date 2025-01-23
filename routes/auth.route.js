const express = require('express');
const authentication = require('../middlewares/auth.middleware');
const authSignupController = require('../controllers/authcontroller/auth.signup.controller');
const authLoginController = require('../controllers/authcontroller/auth.login.controller');
const authLogoutController = require('../controllers/authcontroller/auth.logout.controller');
const forgotPasswordController = require('../controllers/authcontroller/auth.forgotpwd.controller');
const resetPasswordController = require('../controllers/authcontroller/auth.resetpwd.controller');


const router = express.Router();


/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Registers a new animal.
 *     description: Creates a new animal in the system by providing animal details such as name, role, email, phone number, and password.
 *     operationId: signupAnimal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               animalname:
 *                 type: string
 *                 description: The name of the animal (unique).
 *                 example: "Lion"
 *               animalRole:
 *                 type: string
 *                 description: The role of the animal (should not be "zookeeper").
 *                 example: "kingofjungle"
 *               email:
 *                 type: string
 *                 description: The animal's email address.
 *                 example: "lion@example.com"
 *               phoneNumber:
 *                 type: string
 *                 description: The animal's phone number (10 digits).
 *                 example: "1234567890"
 *               password:
 *                 type: string
 *                 description: The animal's password (minimum 7 characters).
 *                 example: "strongpassword123"
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmation of the password.
 *                 example: "strongpassword123"
 *     responses:
 *       '201':
 *         description: Successful animal registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     animalname:
 *                       type: string
 *                       example: "Lion"
 *                     animalRole:
 *                       type: string
 *                       example: "kingofjungle"
 *                     email:
 *                       type: string
 *                       example: "lion@example.com"
 *                     phoneNumber:
 *                       type: string
 *                       example: "1234567890"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-23T12:00:00Z"
 *                 message:
 *                   type: string
 *                   example: "Registered successfully"
 *       '400':
 *         description: Bad request due to validation errors or missing parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "failed"
 *                 message:
 *                   type: string
 *                   example: "Password and Confirm password must be same"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.post("/signup", authSignupController);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login an animal
 *     description: Authenticate an animal using email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the animal
 *                 example: lion@example.com
 *               password:
 *                 type: string
 *                 description: The password of the animal
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: Login successful, returns user details and a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Logged in successfully
 *                 role:
 *                   type: string
 *                   example: kingofjungle
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Lion King
 *       400:
 *         description: Missing or invalid data
 *       401:
 *         description: Invalid credentials or token expired
 *       500:
 *         description: Internal server error
 */

router.post("/login", authLoginController);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logs out the currently authenticated animal.
 *     description: Logs out the animal by clearing the session and updating the `isLoggedIn` status in the database.
 *     operationId: logoutAnimal
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 *                 status:
 *                   type: string
 *                   example: "success"
 *       '400':
 *         description: Bad request, unable to log out due to invalid state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "failed"
 *                 message:
 *                   type: string
 *                   example: "You are not logged in!"
 *       '500':
 *         description: Internal server error, unable to log out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *       '401':
 *         description: Unauthorized, invalid or expired JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid or expired token"
 */


router.get("/logout", authentication, authLogoutController);


/**
 * @swagger
 * /forgotpassword:
 *   post:
 *     summary: Initiates a password reset process for a user.
 *     description: This endpoint sends a password reset link to the user's email if the email exists.
 *     operationId: forgotPassword
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Email address for password reset request
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Password reset link has been sent to the email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Password reset link has been sent to your email"
 *       400:
 *         description: Email not found or invalid email format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "failed"
 *                 message:
 *                   type: string
 *                   example: "Email not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *     security: []
 */

router.post("/forgotpassword", forgotPasswordController);



/**
 * @swagger
 * /resetpassword:
 *   post:
 *     summary: Resets the user's password using a valid token.
 *     description: This endpoint allows the user to reset their password if they provide a valid token and matching new passwords.
 *     operationId: resetPassword
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: The token and new password fields needed to reset the password.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "abcdef12345"
 *               newPassword:
 *                 type: string
 *                 example: "newPassword123"
 *               confirmPassword:
 *                 type: string
 *                 example: "newPassword123"
 *     responses:
 *       200:
 *         description: Password has been successfully reset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Your password has been reset successfully"
 *       400:
 *         description: Invalid or expired token, or password mismatch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "failed"
 *                 message:
 *                   type: string
 *                   example: "Passwords do not match"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *     security: []
 */

router.post("/resetpassword", resetPasswordController);


module.exports = router;