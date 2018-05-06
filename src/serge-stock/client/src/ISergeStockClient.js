"use strict";

const SergeClient = require("serge-common").SergeClient;

class ISergeStockClient extends SergeClient {
  getAll(showArchived) {
    throw new Error("Not implemented");
  }

  add(obj) {
    throw new Error("Not implemented");
  }

  get(id) {
    throw new Error("Not implemented");
  }

  delete(id) {
    throw new Error("Not implemented");
  }
}

module.exports = ISergeStockClient;
