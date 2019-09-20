const treasuresRouter = require("express").Router();
const { getTreasures } = require("../controllers/getTreasures");
const { postTreasure } = require("../controllers/postTreasure");

treasuresRouter
  .route("/")
  .get(getTreasures)
  .post(postTreasure);

module.exports = treasuresRouter;
