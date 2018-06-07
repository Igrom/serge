"use strict";

const express = require("express");
const hal = require("express-hal");
const bodyParser = require("body-parser");
const cors = require("cors");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const swaggerize = require("swaggerize-express");
const httpStatus = require("http-status-codes");
const winston = require("winston");
const checkBody = require("express-validator/check").body;
const validationResult = require("express-validator/check").validationResult;

const SergeError = require("serge-common").SergeError;
const stockValidator = require("./validators/stockValidator");
const ordersValidator = require("./validators/ordersValidator");

let buildApp = depPath => {
  const app = express();

  app.use(cors());

  app.use(hal.middleware);

  app.use(bodyParser.json());

  app.use(awsServerlessExpressMiddleware.eventContext());

  // dependency injection
  app.use((req, res, next) => {
    req.dependencies = require(depPath);
    next();
  });

  // construct protocol, (sub)domain and port for later linking
  app.use((req, res, next) => {
    req.fullUrl = req.protocol + '://' + req.dependencies.host;
    next();
  });

  // request validation
  app.use(checkBody("stock")
    .custom(stockValidator)
  );
  app.use(checkBody("order")
    .custom(ordersValidator)
  );

  //validation results
  app.use((req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).json(new SergeError("There have been validation errors.", errors.mapped()));
    }
    next();
  });

  app.use(swaggerize({
    api: require("./api/swagger.json"),
    security: "./security",
    docspath: "/api"
  }));

  app.use((err, req, res, next) => {
    winston.error(err.message);

    // Swaggerize - unauthorized
    if (err.message === "Unauthorized.") {
      res.status(httpStatus.UNAUTHORIZED).json();
    }

    // Swaggerize - validation error
    if (err.name === "ValidationError") {
      res.status(httpStatus.BAD_REQUEST).json(new SergeError(err.message));
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json();
  });

  return app;
};

module.exports = buildApp;
