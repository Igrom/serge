"use strict";

const ProductsDynamoDb = require("./productsDynamoDb");

let ProductsDynamoDbFactory = configuration => () => {
  return new ProductsDynamoDb(configuration);
};

module.exports = ProductsDynamoDbFactory;
