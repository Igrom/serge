"use strict";

const dynalite = require("dynalite");
const AWS = require("aws-sdk");

const app = require("./src/app.local.js");

const portNumber = 4003;
const dynalitePortNumber = 4103;
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
  console.log(`serge-orders Development: Local DynamoDB provisioned using Dynalite on port ${dynalitePortNumber}`);
  
  await dependencies.IOrders().createTable();

  app.listen(portNumber, err => {
    if (err) {
      throw err;
    }
    console.log(`serge-orders Development: Listening on port ${portNumber}`);
  });
});
