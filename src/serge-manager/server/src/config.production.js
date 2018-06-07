"use strict";

const dependencies = {
  IManager: require("./data/managerDynamoDbFactory")(),
  ISergeProductsClient: require("serge-products-client").SergeProductsClient,
  ISergeOrdersClient: require("serge-orders-client").SergeOrdersClient,
  ISergeStockClient: require("serge-stock-client").SergeStockClient,
  ISergeShipmentsClient: require("serge-shipments-client").SergeShipmentsClient,
  ISergeLocationsClient: require("serge-locations-client").SergeLocationsClient,
  host: "example.com",
  sergeProductsUrl: "https://products.serge.sowinski.blue",
  sergeOrdersUrl: "https://orders.serge.sowinski.blue",
  sergeStockUrl: "https://stock.serge.sowinski.blue",
  sergeShipmentsUrl: "https://shipments.serge.sowinski.blue",
  sergeLocationsUrl: "https://locations.serge.sowinski.blue",
};

module.exports = dependencies;
