"use strict";

const assert = require("assert");
const nock = require("nock");
const SergeProductsClient = require("serge-products-client").SergeProductsClient;

const client = new SergeProductsClient("http://localhost:4002");
const dependencies = require("../src/config.local");
console.error = jest.fn();

const product = {
  name: "Service Test Product",
  source: dependencies.sergeSourcesUrl + "/v1/sources/123",
  minimumOrderableQuantity: 5,
  batchQuantity: 40 
};

describe("serge-products service", () => {

  let sourcesNock = nock("http://localhost:4001")
      .persist()
      .get(() => true)
      .reply(200, {});

  beforeAll(() => new Promise(res => {
    require("../local");
    setTimeout(res, 100);
  }));

  it("functions correctly when posting and getting an entry", async () => {
    let postResult = await client.add(product);
    Object.keys(product).map(k => assert.equal(postResult[k], product[k]));

    let location = postResult._links.self.href;
    let getIdResult = await client.get(location);
    Object.keys(product).map(k => assert.equal(getIdResult[k], product[k]));
  });

  it("lists the entry among all entries", async () => {
    let postResult = await client.add(product);

    let location = postResult._links.self.href;
    let getAllResult = await client.getAll();
    assert(getAllResult.find(product => product._links.self.href === location));
  });

  it("updates an entry", async () => {
    let postResult = await client.add(product);

    let location = postResult._links.self.href;

    let newProduct = Object.assign({}, product, {
      batchQuantity: 50
    });
    let putIdResult = await client.update(location, newProduct);
    Object.keys(product).map(k => assert.equal(putIdResult[k], newProduct[k]));
    let getIdResult = await client.get(location);
    Object.keys(product).map(k => assert.equal(getIdResult[k], newProduct[k]));
  });

  it("logically deletes an entry", async () => {
    let postResult = await client.add(product);

    let location = postResult._links.self.href;

    await client.delete(location);

    let getIdResult = await client.get(location);
    assert.equal(getIdResult.archived, true);
  });

  it("does not show the archived entry among all entries", async () => {
    let postResult = await client.add(product);

    let location = postResult._links.self.href;

    await client.delete(location);

    let getAllResult = await client.getAll();
    assert(!getAllResult.find(product => product._links.self.href === location));
  });

  it("shows the archived entry if an appropriate query parameter is specified", async () => {
    let postResult = await client.add(product);

    let location = postResult._links.self.href;

    await client.delete(location);

    let getAllResult = await client.getAll(true);
    assert(getAllResult.find(product => product._links.self.href === location));
  });
});
