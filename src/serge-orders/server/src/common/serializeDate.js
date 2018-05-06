"use strict";

module.exports = entry => {
  entry.expectedBy = entry.expectedBy.toJSON();
  return entry;
};
