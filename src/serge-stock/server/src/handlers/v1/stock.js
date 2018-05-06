"use strict";

const HttpStatus = require("http-status-codes");
const winston = require("winston");
const uuid = require("uuid");

const SergeError = require("serge-common").SergeError;

let get = (req, res) => {
  const client = req.dependencies.IStock();

  client.getAll()
    .then(data => {
      if (!req.query.showArchived || req.query.showArchived.toLowerCase() !== "true") {
        data = data.filter(el => !el.archived);
      }
      
      let hal = data.map(el => Object.assign({
        links: {
          self: {
            href: `${req.fullUrl}/v1/stock/${el.id}`
          },
          up: {
            href: `${req.fullUrl}/v1/stock`
          }
        }
      }, el));

      res.status(HttpStatus.OK).hal({
        links: {
          self: {
            href: `${req.fullUrl}/v1/stock`
          },
        },
        embeds: {
          stock: hal
        }
      });
    })
    .catch(err => {
      winston.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new SergeError(err.message));
    });
};

let post = (req, res) => {
  const client = req.dependencies.IStock();

  let id = uuid();

  client.put(id, req.body)
    .then(() => {
      res.status(HttpStatus.OK).hal({
        data: req.body,
        links: {
          self: `${req.fullUrl}/v1/stock/${id}`,
          up: `${req.fullUrl}/v1/stock`,
        }
      });
    })
    .catch(err => {
      winston.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new SergeError(err.message));
    });
};

module.exports = {
  get: get,
  post: post
};
