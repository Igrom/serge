"use strict";

const check = require("express-validator/check");

const validate = (value, params) => {
  let req = params.req;

  if (value) {
    let client = new req.dependencies.ISergeStockClient(req.dependencies.sergeStockUrl, req.get("Authorization"));

    let checks = value.map(v => client.get(v));

    return Promise.all(checks)
      .then(data => {
        if (data.some(e => !e || e.archived)) {
          throw new Error("Some of the stock does not exist");
        }

        return true;
      });
  }

  return true;
};

module.exports = validate;
