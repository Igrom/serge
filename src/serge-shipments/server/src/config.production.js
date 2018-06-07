"use strict";

const dependencies = {
  IShipments: require("./data/shipmentsDynamoDbFactory")(),
  ISergeSourcesClient: require("serge-sources-client").SergeSourcesClient,
  ISergeStockClient: require("serge-stock-client").SergeStockClient,
  host: "example.com",
  sergeSourcesUrl: "https://sources.serge.sowinski.blue",
  sergeStockUrl: "https://stock.serge.sowinski.blue"
};

module.exports = dependencies;
