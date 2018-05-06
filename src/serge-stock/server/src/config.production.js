"use strict";

const dependencies = {
  IStock: require("./data/stockDynamoDbFactory")(),
  ISergeProductsClient: require("serge-products-client").SergeProductsClient,
  host: "example.com",
  sergeProductsUrl: "https://products.serge.sowinski.blue"
};

module.exports = dependencies;
