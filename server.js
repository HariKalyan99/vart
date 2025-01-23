const config = require("./config");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const express = require("express");
const authRouter = require("./routes/auth.route");
const animalRouter = require("./routes/animal.route");
const appMiddleware = require("./middlewares/app.middleware");
const morgan = require("morgan");
const logger = require("./services/utils/logger");
const session = require('express-session');
const morganFormat = ":method :url :status :response-time ms";
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');

const app = express();
const PORT = config.appport || 4040;

app.use(bodyParser.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'A simple Express API with Sequelize',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', 
        },
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api/v1/`, 
      },
    ],
  },
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    authAction: {
      BearerAuth: {
        name: "Bearer",
        schema: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
        },
        value: "Bearer <your_token>",
      },
    },
  },
}));

app.use(session({
  secret: config.sessionsecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));
app.use(express.json());
app.use(
  cors({
    origin: config.nodeenvironment === "production" ? "" : "*",
    credentials: true,
  }),
);
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);
// app.use(appMiddleware);
app.use("/api/v1/", authRouter);
app.use("/api/v1/", animalRouter);

app.use("*", (request, response) => {
  return response
    .status(404)
    .json({ message: `Can't find ${request.originalUrl} on the server` });
});

app.listen(PORT, () => {
  console.log(`Connection establishment, Listening on the port: ${PORT}`);

  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs/auth`);
});
