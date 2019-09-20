const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter");
const cors = require("cors");

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Page not found" });
});

// TODO: psql error handlers

module.exports = app;
