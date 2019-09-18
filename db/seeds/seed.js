const { ownerData, shopData, treasureData } = require("../data/test-data");
// const { ownerData, shopData, treasureData } = require("../data/dev-data"); // data to seed dev-db

const {
  createRef,
  formatShopData,
  formatTreasureData
} = require("../../utils");

exports.seed = function(knex, Promise) {
  //sql command
  return (
    knex
      .insert(ownerData)
      .into("owners")
      .returning("*")
      //result of command
      .then(owners => {
        console.log(`${owners.length} owners were inserted`);
        //have access to owners Rows in database - they have owner_id
        //formatting shop data to use the ID
        const ownerRef = createRef(owners, "owner_id", "forename");
        //create reference object of owner names and their IDs
        const formatedShopData = formatShopData(shopData, ownerRef);
        //insert shop data relies on owner data and needs formatting to use owner_id
        return knex
          .insert(formatedShopData)
          .into("shops")
          .returning("*");
      })
      .then(shops => {
        //have access to shopRows from the database
        console.log(`${shops.length} shops inserted`);
        const shopRef = createRef(shops, "shop_id", "shop_name");
        //create reference object to shop names and ids
        const formattedTreasureData = formatTreasureData(treasureData, shopRef);
        //format the treasures to replace the shop names with their ids
        return knex //insert treasyre data into database
          .insert(formattedTreasureData)
          .into("treasures")
          .returning("*");
      })
      .then(treasures => {
        console.log(`${treasures.length} treasures inserted`);
      })
      .catch(err => console.log(err))
  );
};
