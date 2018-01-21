"use strict";

const dependencies = {
  ICustomers: require("./data/customersDynamoDbFactory")({
    endpoint: "http://localhost:4100"
  }),
  host: "localhost:4000"
};

module.exports = dependencies;
