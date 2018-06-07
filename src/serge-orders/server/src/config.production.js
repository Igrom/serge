"use strict";

const dependencies = {
  IOrders: require("./data/ordersDynamoDbFactory")(),
  ISergeCustomersClient: require("serge-customers-client").SergeCustomersClient,
  ISergeProductsClient: require("serge-products-client").SergeProductsClient,
  host: "example.com",
  sergeProductsUrl: "https://products.serge.sowinski.blue"
  sergeCustomersUrl: "https://customers.serge.sowinski.blue"
};

module.exports = dependencies;
