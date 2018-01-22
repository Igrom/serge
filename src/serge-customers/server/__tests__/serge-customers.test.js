"use strict";

const assert = require("assert");
const SergeCustomersClient = require("serge-customers-client");

const client = new SergeCustomersClient("http://localhost:4000");
console.error = jest.fn();

const customer = {
  name: "Service Test Customer",
  address: "Test Rd., Ruhenheim 12345, Nowhere",
  email: "test@example.com",
  phone: "555-123-123",
  language: "en-US",
  website: "https://www.example.com",
};

describe("serge-customers service", () => {

  beforeAll(() => new Promise(res => {
    require("../local");
    setTimeout(res, 100);
  }));

  it("functions correctly when posting and getting an entry", async () => {
    let postResult = await client.add(customer);
    Object.keys(customer).map(k => assert.equal(postResult[k], customer[k]));

    let location = postResult._links.self.href;
    let getIdResult = await client.get(location);
    Object.keys(customer).map(k => assert.equal(getIdResult[k], customer[k]));
  });

  it("lists the entry among all entries", async () => {
    let postResult = await client.add(customer);

    let location = postResult._links.self.href;
    let getAllResult = await client.getAll();
    assert(getAllResult.find(customer => customer._links.self.href === location));
  });

  it("updates an entry", async () => {
    let postResult = await client.add(customer);

    let location = postResult._links.self.href;

    let newCustomer = Object.assign({}, customer, {
      language: "pl-PL"
    });
    let putIdResult = await client.update(location, newCustomer);
    Object.keys(customer).map(k => assert.equal(putIdResult[k], newCustomer[k]));
    let getIdResult = await client.get(location);
    Object.keys(customer).map(k => assert.equal(getIdResult[k], newCustomer[k]));
  });

  it("logically deletes an entry", async () => {
    let postResult = await client.add(customer);

    let location = postResult._links.self.href;

    await client.delete(location);

    let getIdResult = await client.get(location);
    assert.equal(getIdResult.archived, true);
  });

  it("does not show the archived entry among all entries", async () => {
    let postResult = await client.add(customer);

    let location = postResult._links.self.href;

    await client.delete(location);

    let getAllResult = await client.getAll();
    assert(!getAllResult.find(customer => customer._links.self.href === location));
  });

  it("shows the archived entry if an appropriate query parameter is specified", async () => {
    let postResult = await client.add(customer);

    let location = postResult._links.self.href;

    await client.delete(location);

    let getAllResult = await client.getAll(true);
    assert(getAllResult.find(customer => customer._links.self.href === location));
  });
});
