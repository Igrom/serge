"use strict";

const LocationsDynamoDb = require("./locationsDynamoDb");

let LocationsDynamoDbFactory = configuration => () => {
  return new LocationsDynamoDb(configuration);
};

module.exports = LocationsDynamoDbFactory;
