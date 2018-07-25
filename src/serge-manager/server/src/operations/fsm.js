"use strict";

class EmployeeFSM {
  constructor(employee) {
    this.employee = employee;
    this.state = null;
    this.states = {};
  }

  initialize() {
    if (!this.defaultState) {
      throw new Error("The default state is not set up.");
    }

    this.state = this.defaultState;
  }

  async move(text) {
    let currentState = this.states[this.state];

    for (let i = 0; i < currentState.transitions.length; i++) {
      let funcResult = currentState.transitions[i].func(text);
      if (funcResult) {
        this.state = currentState.transitions[i].end;
      }
    }
  }

  addState(state) {
    this.states[state] = {
      transitions: []
    };
  }

  addTransition(start, func, end) {
    if (!this.states[start]) {
      addState(start);
    }

    if (!this.states[end]) {
      addState(start);
    }

    this.states[start].transitions.push({
      func,
      end
    });
  }
};

module.exports = EmployeeFSM;
