"use strict";

const dependencies = {
  ISources: require("./data/sourcesDynamoDbFactory")({
    endpoint: "http://localhost:4101"
  }),
  host: "localhost:4001"
};

module.exports = dependencies;
