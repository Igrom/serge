"use strict";

const states = {
  CHOOSE_MODE: "CHOOSE_MODE",
  START_PLACE: "START_PLACE",
  GO_TO_LOCATION: "GO_TO_LOCATION",
  PLACE: "PLACE",
  CONFIRM_PLACE: "CONFIRM_PLACE"
};

const EmployeeFSM = require("./fsm");

const createFSM = (req, employee) => {
  let stockClient = new req.dependencies.ISergeStockClient(req.dependencies.sergeStockUrl);

  let fsm = new EmployeeFSM(employee);

  fsm.addTransition(states.CHOOSE_MODE, (employee, text) => text.match(/place/), states.START_PLACE);

  fsm.addTransition(states.START_PLACE, async (employee, text) => {
    let stock = await stockClient.getAll();

    let stockItem = stock.find(s => s._links.self.href.match(new RegExp(`stock/${text}`)));
    if (!stockItem) { return; }

    employee.state.currentStock = stockItem._links.self.href;

    return true;
  }, states.GO_TO_LOCATION);

  fsm.addTransition(states.);
};

module.exports = {
  createFSM
};
