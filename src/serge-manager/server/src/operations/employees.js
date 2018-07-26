"use strict";
const uuid = require("uuid");

const { createFSM } = require("./sergeFsm");

const employees = {};

const add = (req) => {
  let id = uuid();
  let employee = {
    id: id,
    state: {}
  };

  employee.fsm = createFSM(req, employee);
  employees[id] = employee;
  return employee;
};

const get = (id) => {
  return Object.keys(employees)
    .map(k => employees[k])
    .find(employee => employee.id.match(id));
};

const getAll = () => {
  return Object.keys(employees)
    .map(k => employees[k]);
}

module.exports = {
  add,
  getAll,
  get
};
