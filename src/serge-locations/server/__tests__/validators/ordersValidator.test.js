"u/e strict";

const assert = require("assert");
const nock = require("nock");
const SergeOrdersClient = require("serge-orders-client").SergeOrdersClient;

const paths = {
  ordersValidator: "../../src/validators/ordersValidator"
};
const ordersValidator = require(paths.ordersValidator);
const dependencies = require("../../src/config.local");

const params = {
  req: {
    dependencies: dependencies,
    get: jest.fn()
      .mockReturnValue("auth")
  }
};

const orderEntry = params.req.dependencies.sergeOrdersUrl + "/v1/orders/789";

describe("ordersValidator", () => {

  let ordersNock;
  afterEach(nock.cleanAll);

  describe("for validate()", () => {
    it("does nothing if the parameter isn't there", async () => {
      await ordersValidator(null, params);
    });

    it("throws an error if order does not exist", async () => {
      ordersNock = nock(params.req.dependencies.sergeOrdersUrl)
        .persist()
        .get("/v1/orders/123")
        .reply(404);

      try {
        let result = await ordersValidator(orderEntry, params);
      } catch (err) {
        return "The error was thrown.";
      }
      throw new Error("An error was supposed to be thrown!");
    });

    it("throws an error if order is archived", async () => {
      ordersNock = nock(params.req.dependencies.sergeOrdersUrl)
        .persist()
        .get("/v1/orders/123")
        .reply(200, {
          id: "",
          archived: true
        });

      try {
        let result = await ordersValidator(orderEntry, params);
      } catch (err) {
        return "The error was thrown.";
      }
      throw new Error("An error was supposed to be thrown!");
    });

    it("succeeds if order exists", async () => {
      ordersNock = nock(params.req.dependencies.sergeOrdersUrl)
        .persist()
        .get(() => true)
        .reply(200, {
          id: ""
        });

      await ordersValidator(orderEntry, params);
    });
  });
});
