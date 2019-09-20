const connection = require("../connection.js");

exports.addTreasure = newTreasure => {
  return connection
    .insert(newTreasure)
    .into("treasures")
    .returning("*");
};
