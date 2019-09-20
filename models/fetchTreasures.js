const connection = require("../connection");

exports.fetchTreasures = (sort_by, order) => {
  return connection
    .select(
      "treasures.treasure_id",
      "treasures.treasure_name",
      "treasures.colour",
      "treasures.age",
      "treasures.cost_at_auction",
      "shops.shop_name"
    )
    .from("treasures")
    .join("shops", "treasures.shop_id", "shops.shop_id")
    .orderBy(`${sort_by}`, `${order}`);
};
