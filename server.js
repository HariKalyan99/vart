const config = require('./config');
const dotenv = require('dotenv');
dotenv.config();
const cors =  require('cors')
const express = require('express');
const authRouter = require('./routes/auth.route');
const animalRouter = require('./routes/animal.route');
const appMiddleware = require('./middlewares/app.middleware');

const app = express();
const PORT = config.appport || 4040

app.use(express.json());
app.use(
    cors({
      origin:
        config.nodeenvironment === "production"
          ? ""
          : "*",
      credentials: true,
    }),
  );
app.use(appMiddleware);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/animals", animalRouter);

app.use("*", (request, response) => {
    return response
      .status(404)
      .json({ message: `Can't find ${request.originalUrl} on the server` });
});

app.listen(PORT, () => {
    console.log(`Connection establishment, Listening on the port: ${PORT}`)
})






