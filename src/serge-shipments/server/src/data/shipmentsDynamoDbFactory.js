"use strict";

const ShipmentsDynamoDb = require("./shipmentsDynamoDb");

let ShipmentsDynamoDbFactory = configuration => () => {
  return new ShipmentsDynamoDb(configuration);
};

module.exports = ShipmentsDynamoDbFactory;
