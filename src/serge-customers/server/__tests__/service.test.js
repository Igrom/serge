"use strict";

const assert = require("assert");
const SergeCustomersClient = require("serge-customers-client");

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

    let customer = {
      name: "Service Test Customer",
      address: "Test Rd., Ruhenheim 12345, Nowhere",
      email: "test@example.com",
      phone: "555-123-123",
      language: "en-US",
      website: "https://www.example.com",
    };

    let result = await client.add(customer);
    console.log(result);
    Object.keys(customer).map(k => assert.equal(result[k], customer[k]));
  });
});
