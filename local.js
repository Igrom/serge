"use strict";
const fs = require("fs");
const localPath = "/server/local.js";

const localScripts = fs.readdirSync("src")
  .filter(service => [".", ".."].indexOf(service) === -1)
  .map(service => `./src/${service}${localPath}`)
  .filter(path => fs.existsSync(path));

localScripts.map(require);
