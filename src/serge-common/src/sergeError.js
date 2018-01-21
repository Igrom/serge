"use strict";

class SergeError extends Error {
  constructor(message, details) {
    super(arguments);
    this.message = message;
    this.details = details;
  }

  toJSON() {
    return {
      message: this.message,
      details: this.details
    }
  }
}

module.exports = SergeError;
