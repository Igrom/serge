"use strict";

const dependencies = {
  IOrders: require("./data/ordersDynamoDbFactory")(),
  ISergeProductsClient: require("serge-products-client").SergeProductsClient,
  host: "example.com",
  sergeProductsUrl: "https://products.serge.sowinski.blue"
};

module.exports = dependencies;
