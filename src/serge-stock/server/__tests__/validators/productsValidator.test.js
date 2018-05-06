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
const product = params.req.dependencies.sergeProductsUrl + "/v1/products/123";

describe("productsValidator", () => {

  let productsNock;
  afterEach(nock.cleanAll);

  describe("for validate()", () => {
    it("does nothing if the parameter isn't there", async () => {
      await productsValidator(null, params);
    });

    it("throws an error if product does not exist", async () => {
      productsNock = nock(params.req.dependencies.sergeProductsUrl)
        .get("/v1/products/123")
        .reply(404);

      try {
        let result = await productsValidator(product, params);
      } catch (err) {
        return "The error was thrown.";
      }
      throw new Error("An error was supposed to be thrown!");
    });

    it("throws an error if product is archived", async () => {
      productsNock = nock(params.req.dependencies.sergeProductsUrl)
        .get("/v1/products/123")
        .reply(200, {
          name: "",
          archived: true
        });

      try {
        let result = await productsValidator(product, params);
      } catch (err) {
        return "The error was thrown.";
      }
      throw new Error("An error was supposed to be thrown!");
    });

    it("succeeds if product exists", async () => {
      productsNock = nock(params.req.dependencies.sergeProductsUrl)
        .get("/v1/products/123")
        .reply(200, {
          name: ""
        });

      await productsValidator(product, params);
    });
  });
});
