const treasuresRouter = require("express").Router();
const { getTreasures } = require("../controllers/getTreasures");
const { postTreasure } = require("../controllers/postTreasure");
const _ = require("../errors");

treasuresRouter
  .route("/")
  .get(getTreasures)
  .post(postTreasure)
  .all(_.invalidMethodHandler);

module.exports = treasuresRouter;
