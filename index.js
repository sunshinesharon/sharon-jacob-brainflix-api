const express = require("express");
const videoRoutes = require("./routes/videos");
const cors = require("cors");
require("dotenv").config();
const { PORT } = process.env;
const app = express();

app.use(cors());

app.use(express.json());

app.use("/public", express.static("./public"));

app.use((req, res, next) => {
    console.log("Logging a request from middleware", req);
    next();
});

app.use("/videos", videoRoutes);

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});