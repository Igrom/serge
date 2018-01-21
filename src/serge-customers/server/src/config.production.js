"use strict";

const dependencies = {
  ICustomers: require("./data/customersDynamoDbFactory")(),
  host: "example.com"
};

module.exports = dependencies;
