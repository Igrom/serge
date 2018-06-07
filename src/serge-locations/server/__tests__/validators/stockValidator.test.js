"u/e strict";

const assert = require("assert");
const nock = require("nock");
const SergeStockClient = require("serge-stock-client").SergeStockClient;

const paths = {
  stockValidator: "../../src/validators/stockValidator"
};
const stockValidator = require(paths.stockValidator);
const dependencies = require("../../src/config.local");

const params = {
  req: {
    dependencies: dependencies,
    get: jest.fn()
      .mockReturnValue("auth")
  }
};
  const stockEntry = [
    { stock: params.req.dependencies.sergeStockUrl + "/v1/stock/123" },
    { stock: params.req.dependencies.sergeStockUrl + "/v1/stock/456" },
    { stock: params.req.dependencies.sergeStockUrl + "/v1/stock/789" }
];

describe("stockValidator", () => {

  let stockNock;
  afterEach(nock.cleanAll);

  describe("for validate()", () => {
    it("does nothing if the parameter isn't there", async () => {
      await stockValidator(null, params);
    });

    it("throws an error if stock items do not exist", async () => {
      stockNock = nock(params.req.dependencies.sergeStockUrl)
        .persist()
        .get("/v1/stock/123")
        .reply(404);

      try {
        let result = await stockValidator(stockEntry, params);
      } catch (err) {
        return "The error was thrown.";
      }
      throw new Error("An error was supposed to be thrown!");
    });

    it("throws an error if stock entries are archived", async () => {
      stockNock = nock(params.req.dependencies.sergeStockUrl)
        .persist()
        .get("/v1/stock/123")
        .reply(200, {
          id: "",
          archived: true
        });

      try {
        let result = await stockValidator(stockEntry, params);
      } catch (err) {
        return "The error was thrown.";
      }
      throw new Error("An error was supposed to be thrown!");
    });

    it("succeeds if stock items exist", async () => {
      stockNock = nock(params.req.dependencies.sergeStockUrl)
        .persist()
        .get(() => true)
        .reply(200, {
          id: ""
        });

      await stockValidator(stockEntry, params);
    });
  });
});
