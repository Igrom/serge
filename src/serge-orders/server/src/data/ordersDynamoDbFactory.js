"use strict";

const OrdersDynamoDb = require("./ordersDynamoDb");

let OrdersDynamoDbFactory = configuration => () => {
  return new OrdersDynamoDb(configuration);
};

module.exports = OrdersDynamoDbFactory;
