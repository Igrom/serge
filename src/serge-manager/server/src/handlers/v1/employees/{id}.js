"use strict";

const HttpStatus = require("http-status-codes");
const winston = require("winston");
const uuid = require("uuid");

const employees = require("../../../operations/employees");

const SergeError = require("serge-common").SergeError;

let get = async (req, res) => {
  let id = req.params.id;

  try {
    let employee = await employees.get(id);

    if (!employee) {
      res.status(HttpStatus.NOT_FOUND).end();
    }

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
  get: get
};
