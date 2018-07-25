"use strict";

const assert = require("assert");
const SergeOrdersClient = require("serge-orders-client").SergeOrdersClient;
const dependencies = require("../src/config.local");

const {
  calculateDeficits,
  getShipmentsFromDeficits,
} = require("../src/plan");
    

console.error = jest.fn();

const shipments = [
  {
    expectedBy: new Date('2018-01-01T00:00:00.000Z'),
    products: [
      {
        product: dependencies.sergeProductsUrl + "/v1/products/123",
        quantity: 10
      },
      {
        product: dependencies.sergeProductsUrl + "/v1/products/456",
        quantity: 100
      }
    ]
  },
  {
    expectedBy: new Date('2018-01-03T00:00:00.000Z'),
    products: [
      {
        product: dependencies.sergeProductsUrl + "/v1/products/123",
        quantity: 20
      },
      {
        product: dependencies.sergeProductsUrl + "/v1/products/456",
        quantity: 30
      },
      {
        product: dependencies.sergeProductsUrl + "/v1/products/789",
        quantity: 30
      }
    ]
  }
];

const orders = [
  {
    expectedBy: new Date('2018-01-02T00:00:00.000Z'),
    products: [
      {
        product: dependencies.sergeProductsUrl + "/v1/products/123",
        quantity: 10
      },
      {
        product: dependencies.sergeProductsUrl + "/v1/products/456",
        quantity: 20
      }
    ]
  },
  {
    expectedBy: new Date('2018-01-04T00:00:00.000Z'),
    products: [
      {
        product: dependencies.sergeProductsUrl + "/v1/products/123",
        quantity: 30
      },
      {
        product: dependencies.sergeProductsUrl + "/v1/products/456",
        quantity: 50
      },
      {
        product: dependencies.sergeProductsUrl + "/v1/products/789",
        quantity: 40
      }
    ]
  },
  {
    expectedBy: new Date('2018-01-05T00:00:00.000Z'),
    products: [
      {
        product: dependencies.sergeProductsUrl + "/v1/products/123",
        quantity: 40
      },
      {
        product: dependencies.sergeProductsUrl + "/v1/products/456",
        quantity: 40
      },
      {
        product: dependencies.sergeProductsUrl + "/v1/products/789",
        quantity: 40
      }
    ]
  }
];

const products = [
  {
    _links: {
      self: {
        href: dependencies.sergeProductsUrl + "/v1/products/123"
      }
    },
    source: "http://www.example.com/v1/sources/1",
    minimumOrderableQuantity: 10,
    batchQuantity: 30
  },
  {
    _links: {
      self: {
        href: dependencies.sergeProductsUrl + "/v1/products/456"
      }
    },
    source: "http://www.example.com/v1/sources/2",
    minimumOrderableQuantity: 5,
    batchQuantity: 40
  },
  {
    _links: {
      self: {
        href: dependencies.sergeProductsUrl + "/v1/products/789"
      }
    },
    source: "http://www.example.com/v1/sources/1",
    minimumOrderableQuantity: 15,
    batchQuantity: 40
  }
];

const expectedDeficits = {
  [dependencies.sergeProductsUrl + "/v1/products/123"]: {
    date: new Date('2018-01-04T00:00:00.000Z'),
    quantity: 50
  },
  [dependencies.sergeProductsUrl + "/v1/products/789"]: {
    date: new Date('2018-01-04T00:00:00.000Z'),
    quantity: 50
  }
};

let shipmentsClient = {
  getAll: async () => shipments
};

let ordersClient = {
  getAll: async () => orders
};

let productsClient = {
  getAll: async () => products
};

describe("plan.js", () => {
  describe("for calculateDeficits()", () => {
    it("calculates deficits", async () => {
      let deficits = await calculateDeficits(shipmentsClient, ordersClient);

      assert.deepEqual(deficits, expectedDeficits);
    });
  });

  describe("for getShipmentsFromDeficits()", () => {
    it("returns shipments", async () => {
      let shipments = await getShipmentsFromDeficits(shipmentsClient, ordersClient, productsClient, expectedDeficits);

      assert(shipments.length, 0);
      assert(shipments[0].products.length, 4);
    });
  });
});
