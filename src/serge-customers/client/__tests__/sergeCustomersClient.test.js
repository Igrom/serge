"use strict";

const assert = require("assert");
const nock = require("nock");

const paths = {
  SergeCustomersClient: "../src/sergeCustomersClient"
};
const SergeCustomersClient = require(paths.SergeCustomersClient);
const baseUri = "http://localhost";
const authToken = "auth";

describe("SergeCustomersClient", () => {
  let test_serviceNock;

  describe("for getAll()", () => {
    beforeEach(() => {
      let test_serviceNock = nock(baseUri)
        .get(() => true)
        .reply(200, {});
    });

    afterEach(nock.cleanAll);

    it("retrieves authentication", async () => {
      let auth = jest.fn()
        .mockReturnValue(authToken);
      let client = new SergeCustomersClient(baseUri, auth);

      await client.getAll();
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
      let client = new SergeCustomersClient(baseUri, auth);

      await client.get(123);
      assert(auth.mock.calls.length);
    });
  });

  describe("for create()", () => {
    beforeEach(() => {
      let test_serviceNock = nock(baseUri)
        .get(() => true)
        .reply(200, {});
    });

    afterEach(nock.cleanAll);

    it("retrieves authentication", async () => {
      let auth = jest.fn()
        .mockReturnValue(authToken);
      let client = new SergeCustomersClient(baseUri, auth);

      await client.create({});
      assert(auth.mock.calls.length);
    });
  });

  describe("for delete()", () => {
    beforeEach(() => {
      let test_serviceNock = nock(baseUri)
        .get(() => true)
        .reply(200, {});
    });

    afterEach(nock.cleanAll);

    it("retrieves authentication", async () => {
      let auth = jest.fn()
        .mockReturnValue(authToken);
      let client = new SergeCustomersClient(baseUri, auth);

      await client.delete(123);
      assert(auth.mock.calls.length);
    });
  });
});
