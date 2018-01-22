"use strict";

const assert = require("assert");

const paths = {
  SergeClient: "../src/sergeClient"
};
const SergeClient = require(paths.SergeClient);
const baseUri = "http://localhost";
const match = "http://localhost/employees/{id}";
const authToken = Symbol("auth");

describe("SergeClient", () => {
  describe("constructor", () => {
    it("accepts HTTP and HTTPS URLs", () => {
      let client;

      client = new SergeClient("http://localhost");
      client = new SergeClient("https://localhost");
    });

    it("fails for no protocol", () => {
      let client;

      assert.throws(() => {
        client = new SergeClient("localhost");
      });
    });

    it("fails for other protocols", () => {
      let client;

      assert.throws(() => {
        client = new SergeClient("ftp://localhost");
      });

      assert.throws(() => {
        client = new SergeClient("gopher://localhost");
      });
    });
  });

  describe("getAuth()", () => {
    it("works with undefined/null", async () => {
      let auth = null;
      let client = new SergeClient(baseUri, auth);

      let result = await client.getAuth();
      assert.equal(result, null);
    });

    it("works with primitive types", async () => {
      let auth = authToken;
      let client = new SergeClient(baseUri, auth);

      let result = await client.getAuth();
      assert.equal(result, auth);
    });

    it("works with functions returning primitive types", async () => {
      let auth = () => authToken;
      let client = new SergeClient(baseUri, auth);

      let result = await client.getAuth();
      assert.equal(result, authToken);
    });

    it("works with functions returning Promises", async () => {
      let auth = () => Promise.resolve(authToken);
      let client = new SergeClient(baseUri, auth);

      let result = await client.getAuth();
      assert.equal(result, authToken);
    });
  });

  describe("isResourceUrl", () => {
    it("returns false if url not a string", () => {
      let url = 123;

      assert.equal(SergeClient.isResourceUrl(url, match), false);
    });

    it("returns false if url is not permitted", () => {
      let url = "ftp://not_permitted";

      assert.equal(SergeClient.isResourceUrl(url, match), false);
    });

    it("returns false if url has fewer path components than match", () => {
      let url = "https://too/few";

      assert.equal(SergeClient.isResourceUrl(url, match), false);
    });

    it("returns false if, after stripping path parameters, the url doesn't match", () => {
      let url = match
        .replace("employees", "employer")
        .replace("{id}", "123");

      assert.equal(SergeClient.isResourceUrl(url, match), false);
    });

    it("returns false if, after stripping path parameters, the url matches", () => {
      let url = match
        .replace("{id}", "123");

      assert.equal(SergeClient.isResourceUrl(url, match), true);
    });
  });
});
