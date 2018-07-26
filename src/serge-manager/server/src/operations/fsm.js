"use strict";

class EmployeeFSM {
  constructor(employee) {
    this.employee = employee;
    this.state = null;
    this.states = {};
  }

  initialize(state) {
    this.state = state;
  }

  async move(text) {
    let currentState = this.states[this.state];

    for (let i = 0; i < currentState.transitions.length; i++) {
      console.log(this.state, ': trying transition', i);
      let funcResult = await currentState.transitions[i].func(text);
      if (funcResult) {
        this.state = currentState.transitions[i].end;
        break;
      }
    }

    return await this.states[this.state].message();
  }

  addState(state, func) {
    this.states[state] = {
      transitions: [],
      message: func || (() => state)
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
