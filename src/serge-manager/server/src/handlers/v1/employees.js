"use strict";

const HttpStatus = require("http-status-codes");
const winston = require("winston");
const uuid = require("uuid");
const serializeDate = require("../../common/serializeDate");

const employees = require("../../operations/employees");

const SergeError = require("serge-common").SergeError;

let get = async (req, res) => {
  try {
    let allEmployees = await employees.getAll();

    let hal = allEmployees.map(employee => ({
      state: employee.state,
      status: employee.fsm.state,
      _links: {
        self: {
          href: `${req.fullUrl}/v1/employees/${employee.id}`
        },
        up: {
          href: `${req.fullUrl}/v1/employees`
        }
      }
    }));

    res.status(HttpStatus.OK).hal({
      links: {
        self: {
          href: `${req.fullUrl}/v1/employees`
        },
      },
      embeds: {
        employees: hal
      }
    });
  } catch (err) {
    winston.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new SergeError(err.message));
  }
};

let post = (req, res) => {
  try {
    let employee = employees.add(req);

    res.status(HttpStatus.OK).hal({
      data: {
        state: employee.state,
        status: employee.fsm.state
      },
      links: {
        self: `${req.fullUrl}/v1/employees/${employee.id}`,
        up: `${req.fullUrl}/v1/employees`,
      }
    });
  } catch (err) {
    winston.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new SergeError(err.message));
  }
};

module.exports = {
  get: get,
  post: post
};
