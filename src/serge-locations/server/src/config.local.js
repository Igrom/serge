"use strict";

const dependencies = {
  ILocations: require("./data/locationsDynamoDbFactory")({
    endpoint: "http://localhost:4106"
  }),
  ISergeOrdersClient: require("serge-orders-client").SergeOrdersClient,
  ISergeStockClient: require("serge-stock-client").SergeStockClient,
  host: "localhost:4006",
  sergeOrdersUrl: "http://localhost:4003",
  sergeStockUrl: "http://localhost:4004"
};

module.exports = dependencies;
