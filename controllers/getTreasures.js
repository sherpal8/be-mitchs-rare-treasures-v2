const { fetchTreasures } = require("../models/fetchTreasures");

exports.getTreasures = (req, res, next) => {
  let { sort_by, order } = req.query;
  const acceptedSortByArray = ["age", "cost_at_auction"];
  const acceptedOrderArray = ["asc", "desc"];
  sort_by = acceptedSortByArray.includes(sort_by) ? sort_by : "cost_at_auction";
  order = acceptedOrderArray.includes(order) ? order : "asc";
  fetchTreasures(sort_by, order)
    .then(treasures => {
      res.status(200).send({ treasures });
    })
    .catch(next);
};
