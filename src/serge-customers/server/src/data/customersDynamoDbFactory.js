"use strict";

const CustomersDynamoDb = require("./customersDynamoDb");

let CustomersDynamoDbFactory = configuration => () => {
  return new CustomersDynamoDb(configuration);
};

module.exports = CustomersDynamoDbFactory;
