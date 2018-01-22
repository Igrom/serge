"use strict";

const check = require("express-validator/check");

const validate = (value, params) => {
  let req = params.req;

  if (value) {
    let client = new req.dependencies.ISergeSourcesClient(req.dependencies.sergeSourcesUrl, req.get("Authorization"));

    return client.get(value)
      .then(data => {
        if (!data || data.archived) {
          throw new Error("No such source");
        }
        return true;
      });
  }

  return true;
};

module.exports = validate;
