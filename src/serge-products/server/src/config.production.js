"use strict";

const dependencies = {
  IProducts: require("./data/productsDynamoDbFactory")(),
  ISergeSourcesClient: require("serge-sources-client").SergeSourcesClient,
  host: "example.com",
  sergeSourcesUrl: "https://sources.serge.sowinski.blue"
};

module.exports = dependencies;
