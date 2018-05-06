"use strict";

const assert = require("assert");
const nock = require("nock");
const SergeOrdersClient = require("serge-orders-client").SergeOrdersClient;

const client = new SergeOrdersClient("http://localhost:4003");
const dependencies = require("../src/config.local");
console.error = jest.fn();

const order = {
  expectedBy: new Date(),
  products: [
    {
      product: dependencies.sergeProductsUrl + "/v1/products/123",
      quantity: 10
    },
    {
      product: dependencies.sergeProductsUrl + "/v1/products/456",
      quantity: 20
    },
    {
      product: dependencies.sergeProductsUrl + "/v1/products/789",
      quantity: 30
    }
  ]
};

describe("serge-orders service", () => {

  beforeAll(() => new Promise(res => {
    require("../local");
    setTimeout(res, 100);
  }));

  beforeEach(() => {
    let productsNock = nock(dependencies.sergeProductsUrl)
      .persist()
      .get(() => true)
      .reply(200, {});
  });

  afterEach(nock.cleanAll);

  it("functions correctly when posting and getting an entry", async () => {
    let postResult = await client.add(order);
    Object.keys(order).map(k => assert.deepEqual(postResult[k], order[k]));

    let location = postResult._links.self.href;
    let getIdResult = await client.get(location);
    Object.keys(order).map(k => assert.deepEqual(getIdResult[k], order[k]));
  });

  it("lists the entry among all entries", async () => {
    let postResult = await client.add(order);

    let location = postResult._links.self.href;
    let getAllResult = await client.getAll();
    assert(getAllResult.find(order => order._links.self.href === location));
  });

  it("updates an entry", async () => {
    let postResult = await client.add(order);

    let location = postResult._links.self.href;

    let newOrder = Object.assign({}, order, {
      expectedBy: new Date()
    });
    let putIdResult = await client.update(location, newOrder);
    Object.keys(order).map(k => assert.deepEqual(putIdResult[k], newOrder[k]));
    let getIdResult = await client.get(location);
    Object.keys(order).map(k => assert.deepEqual(getIdResult[k], newOrder[k]));
  });

  it("logically deletes an entry", async () => {
    let postResult = await client.add(order);

    let location = postResult._links.self.href;

    await client.delete(location);

    let getIdResult = await client.get(location);
    assert.deepEqual(getIdResult.archived, true);
  });

  it("does not show the archived entry among all entries", async () => {
    let postResult = await client.add(order);

    let location = postResult._links.self.href;

    await client.delete(location);

    let getAllResult = await client.getAll();
    assert(!getAllResult.find(order => order._links.self.href === location));
  });

  it("shows the archived entry if an appropriate query parameter is specified", async () => {
    let postResult = await client.add(order);

    let location = postResult._links.self.href;

    await client.delete(location);

    let getAllResult = await client.getAll(true);
    assert(getAllResult.find(order => order._links.self.href === location));
  });
});
