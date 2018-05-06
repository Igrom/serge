"use strict";

const assert = require("assert");
const nock = require("nock");

const paths = {
  SergeProductsClient: "../src/sergeProductsClient"
};
const SergeProductsClient = require(paths.SergeProductsClient);
const baseUri = "http://localhost";
const authToken = "auth";

describe("SergeProductsClient", () => {
  let test_serviceNock;

  describe("for getAll()", () => {
    beforeEach(() => {
      let test_serviceNock = nock(baseUri)
        .get(() => true)
        .reply(200, {
          _embedded: {
            products: []
          }
        });
    });

    afterEach(nock.cleanAll);

    it("retrieves authentication", async () => {
      let auth = jest.fn()
        .mockReturnValue(authToken);
      let client = new SergeProductsClient(baseUri, auth);

      await client.getAll();
      assert(auth.mock.calls.length);
    });
  });

  describe("for add()", () => {
    beforeEach(() => {
      let test_serviceNock = nock(baseUri)
        .post(() => true)
        .reply(200, {});
    });

    afterEach(nock.cleanAll);

    it("retrieves authentication", async () => {
      let auth = jest.fn()
        .mockReturnValue(authToken);
      let client = new SergeProductsClient(baseUri, auth);

      await client.add({"a": "b"});
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
      let client = new SergeProductsClient(baseUri, auth);

      await client.get(123);
      assert(auth.mock.calls.length);
    });
  });

  describe("for update()", () => {
    beforeEach(() => {
      let test_serviceNock = nock(baseUri)
        .put(() => true)
        .reply(200, {});
    });

    afterEach(nock.cleanAll);

    it("retrieves authentication", async () => {
      let auth = jest.fn()
        .mockReturnValue(authToken);
      let client = new SergeProductsClient(baseUri, auth);

      await client.update(123, {});
      assert(auth.mock.calls.length);
    });
  });

  describe("for delete()", () => {
    beforeEach(() => {
      let test_serviceNock = nock(baseUri)
        .delete(() => true)
        .reply(204, {});
    });

    afterEach(nock.cleanAll);

    it("retrieves authentication", async () => {
      let auth = jest.fn()
        .mockReturnValue(authToken);
      let client = new SergeProductsClient(baseUri, auth);

      await client.delete(123);
      assert(auth.mock.calls.length);
    });
  });
});
