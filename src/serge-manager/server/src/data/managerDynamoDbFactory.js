"use strict";

const ManagerDynamoDb = require("./managerDynamoDb");

let ManagerDynamoDbFactory = configuration => () => {
  return new ManagerDynamoDb(configuration);
};

module.exports = ManagerDynamoDbFactory;
