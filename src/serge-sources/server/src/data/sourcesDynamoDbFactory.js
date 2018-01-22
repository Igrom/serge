"use strict";

const SourcesDynamoDb = require("./sourcesDynamoDb");

let SourcesDynamoDbFactory = configuration => () => {
  return new SourcesDynamoDb(configuration);
};

module.exports = SourcesDynamoDbFactory;
