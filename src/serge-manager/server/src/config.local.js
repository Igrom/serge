"use strict";

const dependencies = {
  IManager: require("./data/managerDynamoDbFactory")({
    endpoint: "http://localhost:4107"
  }),
  ISergeProductsClient: require("serge-products-client").SergeProductsClient,
  ISergeOrdersClient: require("serge-orders-client").SergeOrdersClient,
  ISergeStockClient: require("serge-stock-client").SergeStockClient,
  ISergeShipmentsClient: require("serge-shipments-client").SergeShipmentsClient,
  ISergeLocationsClient: require("serge-locations-client").SergeLocationsClient,
  host: "localhost:4007",
  sergeProductsUrl: "http://localhost:4002",
  sergeOrdersUrl: "http://localhost:4003",
  sergeStockUrl: "http://localhost:4004",
  sergeShipmentsUrl: "http://localhost:4005",
  sergeLocationsUrl: "http://localhost:4006"
};

module.exports = dependencies;
