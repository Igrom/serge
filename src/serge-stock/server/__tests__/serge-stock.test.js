"use strict";

const assert = require("assert");
const nock = require("nock");
const SergeStockClient = require("serge-stock-client").SergeStockClient;

const client = new SergeStockClient("http://localhost:4004");
const dependencies = require("../src/config.local");
console.error = jest.fn();

const listing = {
  product: dependencies.sergeProductsUrl + "/v1/products/123",
  quantity: 10
};

describe("serge-stock service", () => {

  beforeAll(() => new Promise(res => {
    require("../local");
    setTimeout(res, 300);
  }));

  beforeEach(() => {
    let products = nock("http://localhost:4002")
      .persist()
      .get(() => true)
      .reply(200, {});
  });

  afterEach(nock.cleanAll);

  it("functions correctly when posting and getting an entry", async () => {
    let postResult = await client.add(listing);
    Object.keys(listing).map(k => assert.equal(postResult[k], listing[k]));

    let location = postResult._links.self.href;
    let getIdResult = await client.get(location);
    Object.keys(listing).map(k => assert.equal(getIdResult[k], listing[k]));
  });

  it("lists the entry among all entries", async () => {
    let postResult = await client.add(listing);

    let location = postResult._links.self.href;
    let getAllResult = await client.getAll();
    assert(getAllResult.find(listing => listing._links.self.href === location));
  });

  it("logically deletes an entry", async () => {
    let postResult = await client.add(listing);

    let location = postResult._links.self.href;

    await client.delete(location);

    let getIdResult = await client.get(location);
    assert.equal(getIdResult.archived, true);
  });

  it("does not show the archived entry among all entries", async () => {
    let postResult = await client.add(listing);

    let location = postResult._links.self.href;

    await client.delete(location);

    let getAllResult = await client.getAll();
    assert(!getAllResult.find(listing => listing._links.self.href === location));
  });

  it("shows the archived entry if an appropriate query parameter is specified", async () => {
    let postResult = await client.add(listing);

    let location = postResult._links.self.href;

    await client.delete(location);

    let getAllResult = await client.getAll(true);
    assert(getAllResult.find(listing => listing._links.self.href === location));
  });
});
