"use strict";

const assert = require("assert");
const nock = require("nock");
const SergeLocationsClient = require("serge-locations-client").SergeLocationsClient;

const client = new SergeLocationsClient("http://localhost:4006");
const dependencies = require("../src/config.local");
console.error = jest.fn();

const locationEntry = {
  stock: [
    {
      stock: dependencies.sergeStockUrl + "/v1/stock/123",
      quantity: 10
    },
    {
      stock: dependencies.sergeStockUrl + "/v1/stock/456",
      quantity: 20
    },
    {
      stock: dependencies.sergeStockUrl + "/v1/stock/789",
      quantity: 30
    }
  ]
};

describe("serge-locations service", () => {

  beforeAll(() => new Promise(res => {
    require("../local");
    setTimeout(res, 300);
  }));

  beforeEach(() => {
    let stockNock = nock(dependencies.sergeStockUrl)
      .persist()
      .get(() => true)
      .reply(200, {});
  });

  afterEach(nock.cleanAll);

  it("functions correctly when posting and getting an entry", async () => {
    let postResult = await client.add(locationEntry);
    Object.keys(locationEntry).map(k => assert.deepEqual(postResult[k], locationEntry[k]));

    let location = postResult._links.self.href;
    let getIdResult = await client.get(location);
    Object.keys(locationEntry).map(k => assert.deepEqual(getIdResult[k], locationEntry[k]));
  });

  it("lists the entry among all entries", async () => {
    let postResult = await client.add(locationEntry);

    let location = postResult._links.self.href;
    let getAllResult = await client.getAll();
    assert(getAllResult.find(locationEntry => locationEntry._links.self.href === location));
  });

  it("updates an entry", async () => {
    let postResult = await client.add(locationEntry);

    let location = postResult._links.self.href;

    let newLocation = Object.assign({}, locationEntry, {
    });
    let putIdResult = await client.update(location, newLocation);
    Object.keys(locationEntry).map(k => assert.deepEqual(putIdResult[k], newLocation[k]));
    let getIdResult = await client.get(location);
    Object.keys(locationEntry).map(k => assert.deepEqual(getIdResult[k], newLocation[k]));
  });

  it("logically deletes an entry", async () => {
    let postResult = await client.add(locationEntry);

    let location = postResult._links.self.href;

    await client.delete(location);

    let getIdResult = await client.get(location);
    assert.deepEqual(getIdResult.archived, true);
  });

  it("does not show the archived entry among all entries", async () => {
    let postResult = await client.add(locationEntry);

    let location = postResult._links.self.href;

    await client.delete(location);

    let getAllResult = await client.getAll();
    assert(!getAllResult.find(locationEntry => locationEntry._links.self.href === location));
  });

  it("shows the archived entry if an appropriate query parameter is specified", async () => {
    let postResult = await client.add(locationEntry);

    let location = postResult._links.self.href;

    await client.delete(location);

    let getAllResult = await client.getAll(true);
    assert(getAllResult.find(locationEntry => locationEntry._links.self.href === location));
  });
});
