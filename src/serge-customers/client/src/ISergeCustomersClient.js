"use strict";

const SergeClient = require("serge-common").SergeClient;

class ISergeCustomersClient extends SergeClient {
  getAll(showArchived) {
    throw new Error("Not implemented");
  }

  add(obj) {
    throw new Error("Not implemented");
  }

  get(id) {
    throw new Error("Not implemented");
  }

  update(id, obj) {
    throw new Error("Not implemented");
  }

  delete(id) {
    throw new Error("Not implemented");
  }
}

module.exports = ISergeCustomersClient;
