"use strict";

const StockDynamoDb = require("./stockDynamoDb");

let StockDynamoDbFactory = configuration => () => {
  return new StockDynamoDb(configuration);
};

module.exports = StockDynamoDbFactory;
