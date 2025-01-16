const express = require('express');
const dotenv = require('dotenv');
const authRouter = require('./routes/auth.route');
dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 4040

app.use(express.json());
app.use("/api/v1/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Connection establishment, Listening on the port: ${PORT}`)
})




