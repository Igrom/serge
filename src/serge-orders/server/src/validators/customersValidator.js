"use strict";

const check = require("express-validator/check");

const validate = (value, params) => {
  let req = params.req;

  if (value) {
    let client = new req.dependencies.ISergeCustomersClient(req.dependencies.sergeCustomersUrl, req.get("Authorization"));

    return client.get(value)
      .then(data => {
        if (!data || data.archived) {
          throw new Error("No such customer");
        }

        return true;
      });
  }

  return true;
};

module.exports = validate;
