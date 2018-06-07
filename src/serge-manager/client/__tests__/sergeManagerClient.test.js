"use strict";

const assert = require("assert");
const nock = require("nock");

const paths = {
  SergeManagerClient: "../src/sergeManagerClient"
};
const SergeManagerClient = require(paths.SergeManagerClient);
const baseUri = "http://localhost";
const authToken = "auth";

describe("SergeManagerClient", () => {
  let test_serviceNock;

  describe("for planShipments()", () => {
    beforeEach(() => {
      let test_serviceNock = nock(baseUri)
        .post(() => true)
        .reply(200, {});
    });

    afterEach(nock.cleanAll);

    it("retrieves authentication", async () => {
      let auth = jest.fn()
        .mockReturnValue(authToken);
      let client = new SergeManagerClient(baseUri, auth);

      await client.planShipments();
      assert(auth.mock.calls.length);
    });
  });

  describe("for get()", () => {
    beforeEach(() => {
      let test_serviceNock = nock(baseUri)
        .get(() => true)
        .reply(200, {});
    });

    afterEach(nock.cleanAll);

    it("retrieves authentication", async () => {
      let auth = jest.fn()
        .mockReturnValue(authToken);
      let client = new SergeManagerClient(baseUri, auth);

      await client.get(123);
      assert(auth.mock.calls.length);
    });
  });
});
