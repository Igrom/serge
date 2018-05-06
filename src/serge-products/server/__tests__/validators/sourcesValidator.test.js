"use strict";

const assert = require("assert");
const nock = require("nock");
const SergeSourcesClient = require("serge-sources-client").SergeSourcesClient;

const paths = {
  sourcesValidator: "../../src/validators/sourcesValidator"
};
const sourcesValidator = require(paths.sourcesValidator);
const dependencies = require("../../src/config.local");

const params = {
  req: {
    dependencies: dependencies,
    get: jest.fn()
      .mockReturnValue("auth")
  }
};
const source = params.req.dependencies.sergeSourcesUrl + "/v1/sources/123";

describe("sourcesValidator", () => {

  let sourcesNock;
  afterEach(nock.cleanAll);

  describe("for validate()", () => {
    it("does nothing if the parameter isn't there", async () => {
      await sourcesValidator(null, params);
    });

    it("throws an error if source does not exist", async () => {
      sourcesNock = nock(params.req.dependencies.sergeSourcesUrl)
        .get("/v1/sources/123")
        .reply(404);

      try {
        let result = await sourcesValidator(source, params);
      } catch (err) {
        return "The error was thrown.";
      }
      throw new Error("An error was supposed to be thrown!");
    });

    it("throws an error if source is archived", async () => {
      sourcesNock = nock(params.req.dependencies.sergeSourcesUrl)
        .get("/v1/sources/123")
        .reply(200, {
          name: "",
          archived: true
        });

      try {
        let result = await sourcesValidator(source, params);
      } catch (err) {
        return "The error was thrown.";
      }
      throw new Error("An error was supposed to be thrown!");
    });

    it("succeeds if source exists", async () => {
      sourcesNock = nock(params.req.dependencies.sergeSourcesUrl)
        .get("/v1/sources/123")
        .reply(200, {
          name: ""
        });

      await sourcesValidator(source, params);
    });
  });
});
