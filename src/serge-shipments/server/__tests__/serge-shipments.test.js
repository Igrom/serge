"use strict";

const assert = require("assert");
const nock = require("nock");
const SergeShipmentsClient = require("serge-shipments-client").SergeShipmentsClient;

const client = new SergeShipmentsClient("http://localhost:4005");
const dependencies = require("../src/config.local");
console.error = jest.fn();

const shipment = {
  arrivesBy: new Date(),
  stock: [
    dependencies.sergeStockUrl + "/v1/stock/123",
    dependencies.sergeStockUrl + "/v1/stock/456",
    dependencies.sergeStockUrl + "/v1/stock/789"
  ]
};

describe("serge-shipments service", () => {

  beforeAll(() => new Promise(res => {
    require("../local");
    setTimeout(res, 100);
  }));

  beforeEach(() => {
    let stockNock = nock(dependencies.sergeStockUrl)
      .persist()
      .get(() => true)
      .reply(200, {});
  });

  afterEach(nock.cleanAll);

  it("functions correctly when posting and getting an entry", async () => {
    let postResult = await client.add(shipment);
    Object.keys(shipment).map(k => assert.deepEqual(postResult[k], shipment[k]));

    let location = postResult._links.self.href;
    let getIdResult = await client.get(location);
    Object.keys(shipment).map(k => assert.deepEqual(getIdResult[k], shipment[k]));
  });

  it("lists the entry among all entries", async () => {
    let postResult = await client.add(shipment);

    let location = postResult._links.self.href;
    let getAllResult = await client.getAll();
    assert(getAllResult.find(shipment => shipment._links.self.href === location));
  });

  it("updates an entry", async () => {
    let postResult = await client.add(shipment);

    let location = postResult._links.self.href;

    let newShipment = Object.assign({}, shipment, {
      arrivesBy: new Date()
    });
    let putIdResult = await client.update(location, newShipment);
    Object.keys(shipment).map(k => assert.deepEqual(putIdResult[k], newShipment[k]));
    let getIdResult = await client.get(location);
    Object.keys(shipment).map(k => assert.deepEqual(getIdResult[k], newShipment[k]));
  });

  it("logically deletes an entry", async () => {
    let postResult = await client.add(shipment);

    let location = postResult._links.self.href;

    await client.delete(location);

    let getIdResult = await client.get(location);
    assert.deepEqual(getIdResult.archived, true);
  });

  it("does not show the archived entry among all entries", async () => {
    let postResult = await client.add(shipment);

    let location = postResult._links.self.href;

    await client.delete(location);

    let getAllResult = await client.getAll();
    assert(!getAllResult.find(shipment => shipment._links.self.href === location));
  });

  it("shows the archived entry if an appropriate query parameter is specified", async () => {
    let postResult = await client.add(shipment);

    let location = postResult._links.self.href;

    await client.delete(location);

    let getAllResult = await client.getAll(true);
    assert(getAllResult.find(shipment => shipment._links.self.href === location));
  });
});
