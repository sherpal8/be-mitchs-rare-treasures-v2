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
  describe("/api/treasures", () => {
    describe("GET", () => {
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
      it("if sort_by and order values are inappropriate, by default the data is returned by sort_by = `cost_at_auction` and order = `asc` ", () => {
        return request
          .get("/api/treasures?sort_by=gaga&order=1")
          .expect(200)
          .then(({ body: { treasures } }) => {
            expect(treasures[0]).to.eql({
              age: 56,
              colour: "onyx",
              cost_at_auction: "0.01",
              shop_name: "shop-e",
              treasure_id: 4,
              treasure_name: "treasure-f"
            });
          });
      });
      it("if key/ query is not pre-defined acceptable key array, by default the data is returned by sort_by = `cost_at_auction` and order = `asc`", () => {
        return request
          .get("/api/treasures?unknownQuery=gaga")
          .expect(200)
          .then(({ body: { treasures } }) => {
            expect(treasures[0]).to.eql({
              age: 56,
              colour: "onyx",
              cost_at_auction: "0.01",
              shop_name: "shop-e",
              treasure_id: 4,
              treasure_name: "treasure-f"
            });
          });
      });
    });
    describe("POST", () => {
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
          .expect(201);
      });
      it("returns object of newly added treasure. Value of treasure_id increased by 1", () => {
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
      it("error 400: If inadequate keys/columns present in posted data", () => {
        return request
          .post("/api/treasures")
          .send({
            colour: "green",
            age: "1",
            cost_at_auction: "1.50",
            shop_id: 2
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("error 400: If more than expected keys/columns present in posted data", () => {
        return request
          .post("/api/treasures")
          .send({
            treasure_name: "Gemz",
            colour: "green",
            age: "1",
            cost_at_auction: "1.50",
            shop_id: 2,
            treasure_owner: "Jenny"
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("error 400: If data type of posted object[key] is non-compatible with database column", () => {
        return request
          .post("/api/treasures")
          .send({
            treasure_name: "Gemz",
            colour: "green",
            age: "happiness",
            cost_at_auction: "1.50",
            shop_id: 2
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("error 422: If data posted is in correct form, but shop_id does not exist in reference table, returns 422 ", () => {
        return request
          .post("/api/treasures")
          .send({
            treasure_name: "Gemz",
            colour: "green",
            age: "1",
            cost_at_auction: "1.50",
            shop_id: 100
          })
          .expect(422)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Unprocessable entity");
          });
      });
      it("error 405: Invalid methods", () => {
        const invalidMethods = ["put", "patch", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request[method]("/api/treasures")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Invalid method");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
});
