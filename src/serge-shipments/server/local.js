"use strict";

const dynalite = require("dynalite");
const AWS = require("aws-sdk");

const app = require("./src/app.local.js");

const portNumber = 4005;
const dynalitePortNumber = 4105;
const dependencies = require("./src/config.local.js");

const dynaliteServer = dynalite({
  createTableMs: 0,
  updateTableMs: 0,
  deleteTableMs: 0
});

dynaliteServer.listen(dynalitePortNumber, async err => {
  if (err) {
    throw err;
  }
  console.log(`serge-shipments Development: Local DynamoDB provisioned using Dynalite on port ${dynalitePortNumber}`);
  
  await dependencies.IShipments().createTable();

  app.listen(portNumber, err => {
    if (err) {
      throw err;
    }
    console.log(`serge-shipments Development: Listening on port ${portNumber}`);
  });
});
