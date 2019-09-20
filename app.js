const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter");
const _ = require("./errors");
const cors = require("cors");

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Page not found" });
});

// psql error handlers
app.use(_.psqlErrorHandler400);
app.use(_.psqlErrorHandler422);
app.use(_.psqlErrorHandler500);

module.exports = app;
