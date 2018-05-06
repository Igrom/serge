"use strict";

const dependencies = {
  IShipments: require("./data/shipmentsDynamoDbFactory")(),
  ISergeStockClient: require("serge-stock-client").SergeStockClient,
  host: "example.com",
  sergeStockUrl: "https://stock.serge.sowinski.blue"
};

module.exports = dependencies;
