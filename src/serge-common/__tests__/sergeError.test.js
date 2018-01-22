"use strict";

const assert = require("assert");
const paths = {
  SergeError: "../src/sergeError"
};
const SergeError = require(paths.SergeError);

describe("SergeError", () => {
  it("serializes to a JSON with message and details", () => {
    let error = new SergeError("An error occured", "abc");

    let reserialized = JSON.parse(JSON.stringify(error));
    assert.deepEqual(Object.keys(reserialized), ["message", "details"]);
  });
});
