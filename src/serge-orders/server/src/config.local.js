"use strict";

const dependencies = {
  IOrders: require("./data/ordersDynamoDbFactory")({
    endpoint: "http://localhost:4103"
  }),
  ISergeCustomersClient: require("serge-customers-client").SergeCustomersClient,
  ISergeProductsClient: require("serge-products-client").SergeProductsClient,
  host: "localhost:4003",
  sergeCustomersUrl: "http://localhost:4000",
  sergeProductsUrl: "http://localhost:4002"
};

module.exports = dependencies;
