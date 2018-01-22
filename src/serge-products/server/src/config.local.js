"use strict";

const dependencies = {
  IProducts: require("./data/productsDynamoDbFactory")({
    endpoint: "http://localhost:4102"
  }),
  ISergeSourcesClient: require("serge-sources-client").SergeSourcesClient,
  host: "localhost:4002",
  sergeSourcesUrl: "http://localhost:4001"
};

module.exports = dependencies;
