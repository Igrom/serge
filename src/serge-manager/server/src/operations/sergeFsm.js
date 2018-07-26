"use strict";

const {
  cancel,
  modeToPlace,
  chooseStock,
  checkLocation,
  placeInsufficientQuantity,
  placeSufficientMoreLocations,
  placeSufficientNoMoreLocations,
  confirmInsufficientQuantity
} = require("./operations");

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
  let locationsClient = new req.dependencies.ISergeLocationsClient(req.dependencies.sergeLocationsUrl);
  let ordersClient = new req.dependencies.ISergeOrdersClient(req.dependencies.sergeOrdersUrl);

  let fsm = new EmployeeFSM(employee);

  fsm.addState(states.CHOOSE_MODE, () => `Choose mode`);
  fsm.addState(states.START_PLACE, () => `Scan a pallet`);
  fsm.addState(states.GO_TO_LOCATION, () => `Go to location ${employee.state.currentLocation.match(/[0-9]+$/)[0]}`);
  fsm.addState(states.PLACE, () => `Place ${employee.state.quantityToPlace} cases`);
  fsm.addState(states.CONFIRM_PLACE, () => `Confirm ${employee.state.statedQuantity} cases`);

  fsm.addTransition(states.CHOOSE_MODE, (text) => modeToPlace(text), states.START_PLACE);

  fsm.addTransition(states.START_PLACE, (text) => chooseStock(employee, text, stockClient, ordersClient, locationsClient), states.GO_TO_LOCATION);
  fsm.addTransition(states.START_PLACE, (text) => cancel(text), states.CHOOSE_MODE);

  fsm.addTransition(states.GO_TO_LOCATION, (text) => checkLocation(employee, text, stockClient, ordersClient, locationsClient), states.PLACE);
  fsm.addTransition(states.GO_TO_LOCATION, (text) => cancel(text), states.CHOOSE_MODE);

  fsm.addTransition(states.PLACE, (text) => placeInsufficientQuantity(employee, text), states.CONFIRM_PLACE);
  fsm.addTransition(states.PLACE, (text) => placeSufficientMoreLocations(employee, text, stockClient, ordersClient, locationsClient), states.GO_TO_LOCATION);
  fsm.addTransition(states.PLACE, (text) => placeSufficientNoMoreLocations(employee, text), states.START_PLACE);
  fsm.addTransition(states.PLACE, (text) => cancel(text), states.CHOOSE_MODE);

  fsm.addTransition(states.CONFIRM_PLACE, (text) => confirmInsufficientQuantity(employee, text, stockClient, ordersClient, locationsClient), states.START_PLACE);
  fsm.addTransition(states.CONFIRM_PLACE, (text) => cancel(text), states.PLACE);

  fsm.initialize(states.CHOOSE_MODE);

  return fsm;
};

module.exports = {
  createFSM
};
