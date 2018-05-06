"use strict";

const dependencies = {
  IOrders: require("./data/ordersDynamoDbFactory")({
    endpoint: "http://localhost:4103"
  }),
  ISergeProductsClient: require("serge-products-client").SergeProductsClient,
  host: "localhost:4003",
  sergeProductsUrl: "http://localhost:4002"
};

module.exports = dependencies;
