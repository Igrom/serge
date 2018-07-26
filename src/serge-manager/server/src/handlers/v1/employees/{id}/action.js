"use strict";

const HttpStatus = require("http-status-codes");
const winston = require("winston");
const uuid = require("uuid");

const employees = require("../../../../operations/employees");

const SergeError = require("serge-common").SergeError;

let post = async (req, res) => {
  let id = req.params.id;

  try {
    let employee = await employees.get(id);
    let text = req.body.text;

    if (!employee) {
      res.status(HttpStatus.NOT_FOUND).end();
    }

    let response = await employee.fsm.move(text);

    res.status(HttpStatus.OK).json({
      text: response
    });
  } catch (err) {
    winston.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new SergeError(err.message));
  }
};

module.exports = {
  post
};
