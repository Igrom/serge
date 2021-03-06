"use strict";
const assert = require("assert");
const cloneDeep = require("lodash.clonedeep");

const {
  chooseStock,
  checkLocation,
  placeSufficientMoreLocations,
} = require("../../src/operations/operations");

const stock = [
  {
    _links: { self: { href: "stock/1"} },
    product: "1",
    quantity: 50
  },
  {
    _links: { self: { href: "stock/2"} },
    product: "1",
    quantity: 30
  },
  {
    _links: { self: { href: "stock/3"} },
    product: "2",
    quantity: 50
  },
  {
    _links: { self: { href: "stock/4"} },
    product: "3",
    quantity: 40
  }
];

const orders = [
  {
    _links: { self: { href: "orders/1"} },
    expectedBy: new Date("2018-01-01T00:00:00.000Z"),
    products: [
      {
        product: "1",
        quantity: 30
      },
      {
        product: "2",
        quantity: 50
      }
    ]
  },
  {
    _links: { self: { href: "orders/2"} },
    expectedBy: new Date("2018-01-02T00:00:00.000Z"),
    products: [
      {
        product: "1",
        quantity: 50
      },
      {
        product: "3",
        quantity: 40
      }
    ]
  }
];

const locations = [
  {
    _links: { self: { href: "locations/1"} },
    code: "123",
    order: "orders/1",
    stock: [
      {
        stock: "stock/1",
        quantity: 30
      },
      {
        stock: "stock/3",
        quantity: 30
      }
    ]
  },
  {
    _links: { self: { href: "locations/2"} },
    code: "456",
    order: "orders/2",
    stock: [
      {
        stock: "stock/1",
        quantity: 10
      },
      {
        stock: "stock/4",
        quantity: 20
      }
    ]
  }
]

const stockClient = { getAll: () => cloneDeep(stock), get: (id) => cloneDeep(stock.find(s => s._links.self.href === id)) };
const ordersClient = { getAll: () => cloneDeep(orders), get: (id) => cloneDeep(orders.find(s => s._links.self.href === id)) };
const locationsClient = {
  getAll: () => cloneDeep(locations),
  get: (id) => cloneDeep(locations.find(l => l._links.self.href === id)),
  update: () => {}
};

describe("for operations", () => {
  describe("for chooseStock()", () => {
    it("works", async () => {
      let employee = { state: {} };

      await chooseStock(employee, "1", stockClient, ordersClient, locationsClient);
      assert.equal(employee.state.currentStock, "stock/1");
      assert.equal(employee.state.currentLocation, "locations/2");

      await chooseStock(employee, "2", stockClient, ordersClient, locationsClient);
      assert.equal(employee.state.currentStock, "stock/2");
      assert.equal(employee.state.currentLocation, "locations/2");

      await chooseStock(employee, "3", stockClient, ordersClient, locationsClient);
      assert.equal(employee.state.currentStock, "stock/3");
      assert.equal(employee.state.currentLocation, "locations/1");

      await chooseStock(employee, "4", stockClient, ordersClient, locationsClient);
      assert.equal(employee.state.currentStock, "stock/4");
      assert.equal(employee.state.currentLocation, "locations/2");
    });
  });
  
  describe("for checkLocation()", () => {
    it("works", async () => {
      let employee = { state: {
        currentStock: "stock/1",
        currentLocation: "locations/2"
      } };

      await checkLocation(employee, "456", stockClient, ordersClient, locationsClient);
      assert.equal(employee.state.quantityToPlace, 10);
    });
  });

  describe("for placeSufficientMoreLocations()", () => {
    it("works", async () => {
      let employee = { state: {
        currentStock: "stock/1",
        currentLocation: "locations/2",
        quantityToPlace: 10
      } };

      await placeSufficientMoreLocations(employee, "10", stockClient, ordersClient, locationsClient);
    });
  });
});
