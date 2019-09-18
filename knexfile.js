// Update with your config settings.
const ENV = process.env.NODE_ENV || "development";

const dbConfig = {
  development: {
    client: "pg",
    connection: {
      database: "mitchs_rare_treasures"
      //   username: "natasafi",
      //   password: "thisismynewpassword19921118"
    },
    seeds: {
      directory: "./db/seeds"
    }
  },
  test: {
    client: "pg",
    connection: {
      database: "mitchs_rare_treasures_test"
      //   username: "natasafi",
      //   password: "thisismynewpassword19921118"
    },
    seeds: {
      directory: "./db/seeds"
    }
  }
};

module.exports = dbConfig[ENV];
