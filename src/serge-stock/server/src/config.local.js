"use strict";

const dependencies = {
  IStock: require("./data/stockDynamoDbFactory")({
    endpoint: "http://localhost:4104"
  }),
  ISergeProductsClient: require("serge-products-client").SergeProductsClient,
  host: "localhost:4004",
  sergeProductsUrl: "http://localhost:4002"
};

module.exports = dependencies;
