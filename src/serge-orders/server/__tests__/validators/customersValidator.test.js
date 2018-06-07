"use strict";

const assert = require("assert");
const nock = require("nock");
const SergeCustomersClient = require("serge-customers-client").SergeCustomersClient;

const paths = {
  customersValidator: "../../src/validators/customersValidator"
};
const customersValidator = require(paths.customersValidator);
const dependencies = require("../../src/config.local");

const params = {
  req: {
    dependencies: dependencies,
    get: jest.fn()
      .mockReturnValue("auth")
  }
};
  const customerEntry = params.req.dependencies.sergeCustomersUrl + "/v1/customers/123";

describe("customersValidator", () => {

  let customersNock;
  afterEach(nock.cleanAll);

  describe("for validate()", () => {
    it("does nothing if the parameter isn't there", async () => {
      await customersValidator(null, params);
    });

    it("throws an error if customer does not exist", async () => {
      customersNock = nock(params.req.dependencies.sergeCustomersUrl)
        .persist()
        .get("/v1/customers/123")
        .reply(404);

      try {
        let result = await customersValidator(customerEntry, params);
      } catch (err) {
        return "The error was thrown.";
      }
      throw new Error("An error was supposed to be thrown!");
    });

    it("throws an error if customer is archived", async () => {
      customersNock = nock(params.req.dependencies.sergeCustomersUrl)
        .persist()
        .get("/v1/customers/123")
        .reply(200, {
          id: "",
          archived: true
        });

      try {
        let result = await customersValidator(customerEntry, params);
      } catch (err) {
        return "The error was thrown.";
      }
      throw new Error("An error was supposed to be thrown!");
    });

    it("succeeds if customer exists", async () => {
      customersNock = nock(params.req.dependencies.sergeCustomersUrl)
        .persist()
        .get(() => true)
        .reply(200, {
          id: ""
        });

      await customersValidator(customerEntry, params);
    });
  });
});
