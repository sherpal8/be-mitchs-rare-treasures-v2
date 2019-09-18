const {
  personalDataObj: { username, password }
} = require("./config.js");

// Update with your config settings.
const ENV = process.env.NODE_ENV || "development";

const dbConfig = {
  development: {
    client: "pg",
    connection: {
      database: "mitchs_rare_treasures"
      //   username,
      //   password
    },
    seeds: {
      directory: "./db/seeds"
    }
  },
  test: {
    client: "pg",
    connection: {
      database: "mitchs_rare_treasures_test"
      //   username,
      //   password
    },
    seeds: {
      directory: "./db/seeds"
    }
  }
};

module.exports = dbConfig[ENV];
