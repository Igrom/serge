"use strict";

const dynalite = require("dynalite");
const AWS = require("aws-sdk");

const app = require("./src/app.local.js");

const portNumber = 4006;
const dynalitePortNumber = 4106;
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
  console.log(`serge-locations Development: Local DynamoDB provisioned using Dynalite on port ${dynalitePortNumber}`);
  
  await dependencies.ILocations().createTable();

  app.listen(portNumber, err => {
    if (err) {
      throw err;
    }
    console.log(`serge-locations Development: Listening on port ${portNumber}`);
  });
});
