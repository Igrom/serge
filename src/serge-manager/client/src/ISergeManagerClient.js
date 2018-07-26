"use strict";

const SergeClient = require("serge-common").SergeClient;

class ISergeManagerClient extends SergeClient {
  planShipments() {
    throw new Error("Not implemented");
  }

  addEmployee() {
    throw new Error("Not implemented");
  }

  getAllEmployees() {
    throw new Error("Not implemented");
  }

  getEmployee() {
    throw new Error("Not implemented");
  }

  postAction() {
    throw new Error("Not implemented");
  }
}

module.exports = ISergeManagerClient;
