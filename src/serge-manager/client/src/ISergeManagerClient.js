"use strict";

const SergeClient = require("serge-common").SergeClient;

class ISergeManagerClient extends SergeClient {
  planShipments() {
    throw new Error("Not implemented");
  }
}

module.exports = ISergeManagerClient;
