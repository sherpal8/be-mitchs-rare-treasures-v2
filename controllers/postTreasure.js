const { addTreasure } = require("../models/addTreasure");

exports.postTreasure = (req, res, next) => {
  const newTreasure = req.body;
  addTreasure(newTreasure)
    .then(insertedTreasure => {
      res.status(201).send({ insertedTreasure });
    })
    .catch(next);
};
