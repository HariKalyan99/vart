const express = require("express");
const authentication = require("../middlewares/auth.middleware");
const animalListController = require("../controllers/animalcontroller/animal.list.controller");
const getAnimalController = require("../controllers/animalcontroller/animal.byId.controller");
const animalPostController = require("../controllers/animalcontroller/animal.create.controller");
const animalDeleteController = require("../controllers/animalcontroller/animal.remove.controller");
const animalEditController = require("../controllers/animalcontroller/animal.edit.controller");
const animalCreatemanyController = require("../controllers/animalcontroller/animal.createmany.controller");

const router = express.Router();


router.post("/manyanimals", authentication, animalCreatemanyController);

/**
 * @swagger
 * /animalslist:
 *   get:
 *     summary: Get the list of animals for the authenticated user.
 *     description: This endpoint retrieves the list of animals based on the authenticated user's ID.
 *     operationId: getAnimalsList
 *     tags:
 *       - Animals
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of animals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       animalname:
 *                         type: string
 *                         example: "Lion"
 *                       animalRole:
 *                         type: string
 *                         example: "kingofjungle"
 *                       email:
 *                         type: string
 *                         example: "lion@jungle.com"
 *                       phoneNumber:
 *                         type: string
 *                         example: "1234567890"
 *                       category:
 *                         type: string
 *                         example: "carnivores"
 *                 totalAnimalData:
 *                   type: integer
 *                   example: 5
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Please log in to get access"
 *       404:
 *         description: Not Found - Animal no longer exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Animal no longer exists"
 *       500:
 *         description: Internal Server Error
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

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get("/animalslist", authentication, animalListController);



/**
 * @swagger
 * /animalcreate:
 *   post:
 *     summary: Create a new animal record.
 *     description: This endpoint allows a user with the "zookeeper" role to create a new animal record.
 *     operationId: createAnimal
 *     tags:
 *       - Animals
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               animalname:
 *                 type: string
 *                 description: Name of the animal
 *               animalRole:
 *                 type: string
 *                 description: Role of the animal (e.g. "kingofjungle")
 *               email:
 *                 type: string
 *                 description: Email of the animal
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number of the animal (must be 10 digits)
 *               address:
 *                 type: string
 *                 description: Address of the animal
 *               contributions:
 *                 type: string
 *                 description: Contributions of the animal
 *               dob:
 *                 type: string
 *                 format: date
 *                 description: Date of birth of the animal
 *               category:
 *                 type: string
 *                 description: Category of the animal (e.g. "herbivores", "carnivores")
 *               requestForRole:
 *                 type: string
 *                 description: Role the animal is requesting (optional)
 *     responses:
 *       200:
 *         description: Animal created successfully
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
 *                   example: "Password has been sent to Lion's email"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     animalname:
 *                       type: string
 *                       example: "Lion"
 *                     email:
 *                       type: string
 *                       example: "lion@jungle.com"
 *                     phoneNumber:
 *                       type: string
 *                       example: "1234567890"
 *                     animalRole:
 *                       type: string
 *                       example: "kingofjungle"
 *       400:
 *         description: Bad Request - Validation failed
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
 *                   example: "Invalid phone number"
 *       401:
 *         description: Unauthorized - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "You don't have permission to perform this action"
 *       500:
 *         description: Internal Server Error
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

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


router.post("/animalcreate", authentication, animalPostController);


/**
 * @swagger
 * /animalremove/{animalId}:
 *   delete:
 *     summary: Remove an animal record
 *     description: This endpoint allows a user to delete an animal record unless the user is a "kingofjungle" or "queenofjungle". It also prevents a user from deleting their own profile.
 *     operationId: deleteAnimal
 *     tags:
 *       - Animals
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: animalId
 *         in: path
 *         description: ID of the animal to be removed
 *         required: true
 *         schema:
 *           type: string
 *           example: "12345"
 *     responses:
 *       200:
 *         description: Animal removed successfully
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
 *                   example: "Animal removed successfully"
 *       400:
 *         description: Bad Request - Validation or permission issue
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
 *                   example: "You don't have permission to perform this action"
 *       401:
 *         description: Unauthorized - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized access"
 *       500:
 *         description: Internal Server Error
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

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


router.delete("/animalremove/:animalId", authentication, animalDeleteController);
/**
 * @swagger
 * /findanimal/{id}:
 *   get:
 *     summary: Retrieve a specific animal by ID
 *     description: Fetches details of an animal by its ID. The animal must exist for a successful response.
 *     operationId: getAnimal
 *     tags:
 *       - Animals
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the animal to retrieve
 *         required: true
 *         schema:
 *           type: string
 *           example: "12345"
 *     responses:
 *       200:
 *         description: Animal found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "12345"
 *                     animalname:
 *                       type: string
 *                       example: "Lion"
 *                     animalRole:
 *                       type: string
 *                       example: "kingofjungle"
 *                     email:
 *                       type: string
 *                       example: "lion@zoo.com"
 *                     phoneNumber:
 *                       type: string
 *                       example: "1234567890"
 *                 message:
 *                   type: string
 *                   example: "Found"
 *       400:
 *         description: Animal not found or invalid ID
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
 *                   example: "Couldn't find an animal"
 *       401:
 *         description: Unauthorized - Insufficient permissions or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized access"
 *       500:
 *         description: Internal Server Error
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

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


router.get("/findanimal/:id", authentication, getAnimalController);

/**
 * @swagger
 * /animaledit/{animalId}:
 *   put:
 *     summary: Edit an animal's details
 *     description: Update the details of an existing animal. At least one field must be provided for editing.
 *     operationId: editAnimal
 *     tags:
 *       - Animals
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: animalId
 *         in: path
 *         description: ID of the animal to be edited
 *         required: true
 *         schema:
 *           type: string
 *           example: "12345"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               animalname:
 *                 type: string
 *                 example: "Lion"
 *               animalRole:
 *                 type: string
 *                 example: "kingofjungle"
 *               email:
 *                 type: string
 *                 example: "lion@zoo.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "1234567890"
 *               password:
 *                 type: string
 *                 example: "newpassword123"
 *               confirmPassword:
 *                 type: string
 *                 example: "newpassword123"
 *               address:
 *                 type: string
 *                 example: "123 Jungle Road"
 *               contributions:
 *                 type: string
 *                 example: "Donated food for lions"
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "2010-05-01"
 *               category:
 *                 type: string
 *                 enum: ["herbivores", "carnivores", "omnivores", "amphibian", "reptiles"]
 *                 example: "carnivores"
 *               requestForRole:
 *                 type: string
 *                 enum: ["zookeeper", "kingofjungle", "queenofjungle"]
 *                 example: "zookeeper"
 *     responses:
 *       200:
 *         description: Animal updated successfully
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
 *                       type: string
 *                       example: "12345"
 *                     animalname:
 *                       type: string
 *                       example: "Lion"
 *                     animalRole:
 *                       type: string
 *                       example: "kingofjungle"
 *                     email:
 *                       type: string
 *                       example: "lion@zoo.com"
 *                     phoneNumber:
 *                       type: string
 *                       example: "1234567890"
 *                     address:
 *                       type: string
 *                       example: "123 Jungle Road"
 *                     contributions:
 *                       type: string
 *                       example: "Donated food for lions"
 *                     dob:
 *                       type: string
 *                       example: "2010-05-01"
 *                     category:
 *                       type: string
 *                       example: "carnivores"
 *                     requestForRole:
 *                       type: string
 *                       example: "zookeeper"
 *                 message:
 *                   type: string
 *                   example: "Updated successfully"
 *       400:
 *         description: Invalid input or existing constraints error
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
 *                   example: "Email is already taken"
 *       404:
 *         description: Animal not found
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
 *                   example: "Animal not found"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized access"
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
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


router.put("/animaledit/:animalId", authentication, animalEditController);

module.exports = router;
