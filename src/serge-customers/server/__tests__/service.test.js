"use strict";

const assert = require("assert");
const SergeCustomersClient = require("serge-customers-client");

global.winstonLogLevel = "crit";

describe("serge-customers service", () => {
  beforeAll(() => {
    require("../local");
  });

  beforeAll(() => new Promise(res => {
    require("../local");
    setTimeout(res, 100);
  }));

  it("works", async () => {
    let client = new SergeCustomersClient("http://localhost:4000");

    const customer = {
      name: "Service Test Customer",
      address: "Test Rd., Ruhenheim 12345, Nowhere",
      email: "test@example.com",
      phone: "555-123-123",
      language: "en-US",
      website: "https://www.example.com",
    };

    // POST /v1/customers
    let postResult = await client.add(customer);
    Object.keys(customer).map(k => assert.equal(postResult[k], customer[k]));

    // GET /v1/customers
    let location = postResult._links.self.href;
    let all = await client.getAll();
    assert(all.find(customer => customer._links.self.href === location) !== null);

    // GET /v1/customers/{id}
    let getIdResult = await client.get(location);
    Object.keys(customer).map(k => assert.equal(getIdResult[k], customer[k]));

    // PUT /v1/customers/{id}
    let newCustomer = Object.assign({}, customer, {
      language: "pl-PL"
    });
    let putIdResult = await client.update(location, newCustomer);
    Object.keys(customer).map(k => assert.equal(putIdResult[k], newCustomer[k]));
    getIdResult = await client.get(location);
    Object.keys(customer).map(k => assert.equal(getIdResult[k], newCustomer[k]));

    // DELETE /v1/customers/{id}
    await client.delete(location);
    let assert404 = async () => {
      try {
        await client.get(location);
      } catch (err) {
        return "Error thrown;"
      }
      throw new assert.AssertionError("Expected an error!");
    }
  });
});
