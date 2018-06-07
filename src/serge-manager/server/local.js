"use strict";

const dynalite = require("dynalite");
const AWS = require("aws-sdk");

const app = require("./src/app.local.js");

const portNumber = 4007;
const dynalitePortNumber = 4107;
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
  console.log(`serge-manager Development: Local DynamoDB provisioned using Dynalite on port ${dynalitePortNumber}`);
  
  await dependencies.IManager().createTable();

  app.listen(portNumber, err => {
    if (err) {
      throw err;
    }
    console.log(`serge-manager Development: Listening on port ${portNumber}`);
  });
});
