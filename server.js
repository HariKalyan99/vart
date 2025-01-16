const express = require('express');
const dotenv = require('dotenv');
const authRouter = require('./routes/auth.route');
const animalRouter = require('./routes/animal.route');
dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 4040

app.use(express.json());
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






