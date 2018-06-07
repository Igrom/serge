"use strict";

const winston = require("winston");

let authorize = (req, res, next) => {
  winston.log("API Key authorization scheme not implemented - passing through");
  next();
};

module.exports = authorize;
