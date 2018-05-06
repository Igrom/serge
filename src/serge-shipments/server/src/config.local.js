"use strict";

const dependencies = {
  IShipments: require("./data/shipmentsDynamoDbFactory")({
    endpoint: "http://localhost:4105"
  }),
  ISergeStockClient: require("serge-stock-client").SergeStockClient,
  host: "localhost:4005",
  sergeStockUrl: "http://localhost:4004"
};

module.exports = dependencies;
