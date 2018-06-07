"use strict";

const dependencies = {
  IShipments: require("./data/shipmentsDynamoDbFactory")({
    endpoint: "http://localhost:4105"
  }),
  ISergeSourcesClient: require("serge-sources-client").SergeSourcesClient,
  ISergeStockClient: require("serge-stock-client").SergeStockClient,
  host: "localhost:4005",
  sergeSourcesUrl: "http://localhost:4001",
  sergeStockUrl: "http://localhost:4004"
};

module.exports = dependencies;
