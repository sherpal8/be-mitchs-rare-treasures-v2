const express = require("express");
const apiRouter = express.Router();
const treasuresRouter = require("./treasuresRouter");

apiRouter.use("/treasures", treasuresRouter);

module.exports = apiRouter;
