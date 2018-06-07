"use strict";

const assert = require("assert");
const nock = require("nock");
const SergeProductsClient = require("serge-products-client").SergeProductsClient;

const paths = {
  productsValidator: "../../src/validators/productsValidator"
};
const productsValidator = require(paths.productsValidator);
const dependencies = require("../../src/config.local");

const params = {
  req: {
    dependencies: dependencies,
    get: jest.fn()
      .mockReturnValue("auth")
  }
};
  const productsEntry = [
    { product: params.req.dependencies.sergeProductsUrl + "/v1/products/123" },
    { product: params.req.dependencies.sergeProductsUrl + "/v1/products/456" },
    { product: params.req.dependencies.sergeProductsUrl + "/v1/products/789" }
];

describe("productsValidator", () => {

  let productsNock;
  afterEach(nock.cleanAll);

  describe("for validate()", () => {
    it("does nothing if the parameter isn't there", async () => {
      await productsValidator(null, params);
    });

    it("throws an error if products do not exist", async () => {
      productsNock = nock(params.req.dependencies.sergeProductsUrl)
        .persist()
        .get("/v1/products/123")
        .reply(404);

      try {
        let result = await productsValidator(productsEntry, params);
      } catch (err) {
        return "The error was thrown.";
      }
      throw new Error("An error was supposed to be thrown!");
    });

    it("throws an error if products are archived", async () => {
      productsNock = nock(params.req.dependencies.sergeProductsUrl)
        .persist()
        .get("/v1/products/123")
        .reply(200, {
          id: "",
          archived: true
        });

      try {
        let result = await productsValidator(productsEntry, params);
      } catch (err) {
        return "The error was thrown.";
      }
      throw new Error("An error was supposed to be thrown!");
    });

    it("succeeds if products exist", async () => {
      productsNock = nock(params.req.dependencies.sergeProductsUrl)
        .persist()
        .get(() => true)
        .reply(200, {
          id: ""
        });

      await productsValidator(productsEntry, params);
    });
  });
});
