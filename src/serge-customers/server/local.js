"use strict";

const app = require("./src/app");
const portNumber = 3000;

app.listen(portNumber, () => {
  console.log(`Development: Listening on port ${portNumber}`);
});
