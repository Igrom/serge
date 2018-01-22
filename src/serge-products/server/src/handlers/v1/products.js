"use strict";

const HttpStatus = require("http-status-codes");
const winston = require("winston");
const uuid = require("uuid");
const SergeSourcesClient = require("serge-sources-client");

const SergeError = require("serge-common").SergeError;

let get = (req, res) => {
  const client = req.dependencies.IProducts();

  client.getAll()
    .then(data => {
      if (!req.query.showArchived || req.query.showArchived.toLowerCase() !== "true") {
        data = data.filter(el => !el.archived);
      }
      
      let hal = data.map(el => Object.assign({
        links: {
          self: {
            href: `${req.fullUrl}/v1/products/${el.id}`
          },
          up: {
            href: `${req.fullUrl}/v1/products`
          }
        }
      }, el));

      res.status(HttpStatus.OK).hal({
        links: {
          self: {
            href: `${req.fullUrl}/v1/products`
          },
        },
        embeds: {
          products: hal
        }
      });
    })
    .catch(err => {
      winston.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new SergeError(err.message));
    });
};

let post = (req, res) => {
  const client = req.dependencies.IProducts();

  let id = uuid();

  client.put(id, req.body)
    .then(() => {
      res.status(HttpStatus.OK).hal({
        data: req.body,
        links: {
          self: `${req.fullUrl}/v1/products/${id}`,
          up: `${req.fullUrl}/v1/products`,
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
