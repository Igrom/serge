"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const swaggerize = require("swaggerize-express");
const yaml = require("yaml");

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(awsServerlessExpressMiddleware.eventContext());

app.use(swaggerize({
  api: yaml.sync(__dirname + "api.yaml"),
  docsPath: "/swagger"
}));

app.use((err, req, res, next) => {
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json();
});

module.exports = app;
