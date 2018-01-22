"use strict";

const HttpStatus = require("http-status-codes");
const winston = require("winston");
const uuid = require("uuid");

const SergeError = require("serge-common").SergeError;

let get = (req, res) => {
  const client = req.dependencies.ISources();
  let id = req.params.id;

  client.get(id)
    .then(data => {
      if (!data) {
        res.status(HttpStatus.NOT_FOUND).end();
        return;
      }

      res.status(HttpStatus.OK).hal({
        data: data,
        links: {
          self: {
            href: `${req.fullUrl}/v1/sources/${id}`
          },
          up: {
            href: `${req.fullUrl}/v1/sources`
          }
        }
      });
    })
    .catch(err => {
      winston.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new SergeError(err.message));
    });
};

let put = (req, res) => {
  const client = req.dependencies.ISources();

  let id = req.params.id;

  client.put(id, req.body)
    .then(() => {
      res.status(HttpStatus.OK).hal({
        data: req.body,
        links: {
          self: `${req.fullUrl}/v1/sources/${id}`,
          up: `${req.fullUrl}/v1/sources`,
        }
      });
    })
    .catch(err => {
      winston.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new SergeError(err.message));
    });
};

let del = (req, res) => {
  const client = req.dependencies.ISources();

  let id = req.params.id;

  client.get(id)
    .then(data => {
      data.archived = true;

      return client.put(id, data)
        .then(() => {
          res.status(HttpStatus.NO_CONTENT).end();
        });
    })
    .catch(err => {
      winston.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new SergeError(err.message));
    });
};

module.exports = {
  get: get,
  put: put,
  delete: del
};
