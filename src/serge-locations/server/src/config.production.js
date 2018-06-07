"use strict";

const dependencies = {
  ILocations: require("./data/locationsDynamoDbFactory")(),
  ISergeStockClient: require("serge-stock-client").SergeStockClient,
  ISergeOrdersClient: require("serge-orders-client").SergeOrdersClient,
  host: "example.com",
  sergeStockUrl: "https://stock.serge.sowinski.blue",
  sergeOrdersUrl: "https://orders.serge.sowinski.blue"
};

module.exports = dependencies;
