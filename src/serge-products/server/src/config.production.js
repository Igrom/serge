"use strict";

const dependencies = {
  IProducts: require("./data/productsDynamoDbFactory")(),
  ISergeSourcesClient: require("serge-sources-client").SergeSourceClient,
  host: "example.com",
  sergeSourcesUrl: "https://sources.serge.sowinski.blue"
};

module.exports = dependencies;
