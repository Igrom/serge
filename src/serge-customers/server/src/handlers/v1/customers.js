"use strict";

const HttpStatus = require("http-status-codes");
const winston = require("winston");
const uuid = require("uuid");

const SergeError = require("serge-common").SergeError;

let get = (req, res) => {
  const client = req.dependencies.ICustomers();
      console.log(req.resource);

  client.getAll()
    .then(data => {
      if (req.query.showArchived && req.query.showArchived.toLowerCase() === "true") {
        data = data.filter(el => el.archived);
      }
      
      let hal = data.map(el => Object.assign({
        links: {
          self: {
            href: `${req.fullUrl}/v1/customers/${el.id}`
          },
          up: {
            href: `${req.fullUrl}/v1/customers`
          }
        }
      }, el));

      res.status(HttpStatus.OK).hal({
        links: {
          self: {
            href: `${req.fullUrl}/v1/customers`
          },
        },
        embeds: {
          customers: hal
        }
      });
    })
    .catch(err => {
      winston.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new SergeError(err.message));
    });
};

let post = (req, res) => {
  const client = req.dependencies.ICustomers();

  let id = uuid();

  client.put(id, req.body)
    .then(() => {
      res.status(HttpStatus.OK).hal({
        data: req.body,
        links: {
          self: `${req.fullUrl}/v1/customers/${id}`,
          up: `${req.fullUrl}/v1/customers`,
        }
      });
    });
};

module.exports = {
  get: get,
  post: post
};
