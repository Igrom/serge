"use strict";

const assert = require("assert");
const SergeSourcesClient = require("serge-sources-client").SergeSourcesClient;

const client = new SergeSourcesClient("http://localhost:4001");
console.error = jest.fn();

const source = {
  name: "Service Test Source",
  address: "Test Rd., Ruhenheim 12345, Nowhere",
  email: "test@example.com",
  phone: "555-123-123",
  language: "en-US",
  website: "https://www.example.com",
};

describe("serge-sources service", () => {

  beforeAll(() => new Promise(res => {
    require("../local");
    setTimeout(res, 100);
  }));

  it("functions correctly when posting and getting an entry", async () => {
    let postResult = await client.add(source);
    Object.keys(source).map(k => assert.equal(postResult[k], source[k]));

    let location = postResult._links.self.href;
    let getIdResult = await client.get(location);
    Object.keys(source).map(k => assert.equal(getIdResult[k], source[k]));
  });

  it("lists the entry among all entries", async () => {
    let postResult = await client.add(source);

    let location = postResult._links.self.href;
    let getAllResult = await client.getAll();
    assert(getAllResult.find(source => source._links.self.href === location));
  });

  it("updates an entry", async () => {
    let postResult = await client.add(source);

    let location = postResult._links.self.href;

    let newSource = Object.assign({}, source, {
      language: "pl-PL"
    });
    let putIdResult = await client.update(location, newSource);
    Object.keys(source).map(k => assert.equal(putIdResult[k], newSource[k]));
    let getIdResult = await client.get(location);
    Object.keys(source).map(k => assert.equal(getIdResult[k], newSource[k]));
  });

  it("logically deletes an entry", async () => {
    let postResult = await client.add(source);

    let location = postResult._links.self.href;

    await client.delete(location);

    let getIdResult = await client.get(location);
    assert.equal(getIdResult.archived, true);
  });

  it("does not show the archived entry among all entries", async () => {
    let postResult = await client.add(source);

    let location = postResult._links.self.href;

    await client.delete(location);

    let getAllResult = await client.getAll();
    assert(!getAllResult.find(source => source._links.self.href === location));
  });

  it("shows the archived entry if an appropriate query parameter is specified", async () => {
    let postResult = await client.add(source);

    let location = postResult._links.self.href;

    await client.delete(location);

    let getAllResult = await client.getAll(true);
    assert(getAllResult.find(source => source._links.self.href === location));
  });
});
