process.env.NODE_ENV = "test";

const chai = require("chai");
const { expect } = chai;
const chaiSorted = require("chai-sorted");
const app = require("../app");
const request = require("supertest")(app);
const connection = require("../connection.js");
chai.use(chaiSorted);

after(() => connection.destroy());

describe("/*", () => {
  it("404 error: when given stray end-point", () => {
    return request
      .get("/hey")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal("Page not found");
      });
  });
});

describe("/api", () => {
  describe("/treasures GET", () => {
    it("200 with GET request", () => {
      return request.get("/api/treasures").expect(200);
    });
    it("each object-element of returned array has specified keys", () => {
      return request
        .get("/api/treasures")
        .expect(200)
        .then(({ body: { treasures } }) => {
          treasures.forEach(element => {
            expect(element).to.contain.keys(
              "treasure_id",
              "treasure_name",
              "colour",
              "age",
              "cost_at_auction",
              "shop_name"
            );
          });
        });
    });
    it("returned treasures array has specified length", () => {
      return request
        .get("/api/treasures")
        .expect(200)
        .then(({ body: { treasures } }) => {
          expect(treasures.length).to.equal(26);
        });
    });
    it("if no `sort_by` or `order` given in query, the returned array defaults to a `sort_by` of `cost_at_auction` in an ascending order", () => {
      return request
        .get("/api/treasures")
        .expect(200)
        .then(({ body: { treasures } }) => {
          //  expect(treasures).to.be.ascendingBy("cost_at_auction");
          expect(treasures[0]).to.eql({
            age: 56,
            colour: "onyx",
            cost_at_auction: "0.01",
            shop_name: "shop-e",
            treasure_id: 4,
            treasure_name: "treasure-f"
          });
          expect(treasures[25]).to.eql({
            treasure_id: 7,
            treasure_name: "treasure-e",
            colour: "onyx",
            age: 10865,
            cost_at_auction: "99999.99",
            shop_name: "shop-a"
          });
        });
    });
    it("if sort_by is by `age` and order is by `desc`, data returned accordingly", () => {
      return request
        .get("/api/treasures?sort_by=age&order=desc")
        .expect(200)
        .then(({ body: { treasures } }) => {
          expect(treasures).to.be.descendingBy("age");
          expect(treasures[0]).to.eql({
            treasure_id: 7,
            treasure_name: "treasure-e",
            colour: "onyx",
            age: 10865,
            cost_at_auction: "99999.99",
            shop_name: "shop-a"
          });
        });
    });
  });
  describe("/treasures POST", () => {
    it("201 with POST request", () => {
      return request
        .post("/api/treasures")
        .send({
          treasure_name: "Gemz",
          colour: "green",
          age: "1",
          cost_at_auction: "1.50",
          shop_id: 2
        })
        .expect(201)
        .then(({ body }) => {});
    });
    it("returns object of newly added treasures, with the value of treasure_id increased appropriately", () => {
      return request
        .post("/api/treasures")
        .send({
          treasure_name: "Gemz",
          colour: "green",
          age: "1",
          cost_at_auction: "1.50",
          shop_id: 2
        })
        .expect(201)
        .then(({ body: { insertedTreasure } }) => {
          expect(insertedTreasure[0]).to.eql({
            treasure_id: 28,
            treasure_name: "Gemz",
            colour: "green",
            age: 1,
            cost_at_auction: "1.50",
            shop_id: 2
          });
        });
    });
    // error handling
    it("all key-value pairs of data object must be present before submission", () => {
      return request
        .post("/api/treasures")
        .send({
          treasure_name: "Gemz",
          colour: "green",
          age: "1",
          cost_at_auction: "1.50",
          shop_id: 2
        })
        .expect(201)
        .then(({ body: { insertedTreasure } }) => {
          expect(insertedTreasure[0]).to.eql({
            treasure_id: 28,
            treasure_name: "Gemz",
            colour: "green",
            age: 1,
            cost_at_auction: "1.50",
            shop_id: 2
          });
        });
    });
  });
});
