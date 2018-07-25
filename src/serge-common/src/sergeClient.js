"use strict";

const rp = require("request-promise-native");
const url = require("url");
const paramRegex = /^{.*}$/;

class SergeClient {
  constructor(baseUrl, auth) {
    if (!SergeClient.isPermittedUrl(baseUrl)) {
      throw new Error("Base URL must be an HTTP or HTTPS URL.");
    }

    this._baseUrl = baseUrl;
    this._auth = auth;
  }

  static isPermittedUrl(value) {
    return ["http:", "https:"].indexOf(url.parse(value).protocol) !== -1;
  }

  getAuth() {
    if (!this._auth) {
      return Promise.resolve(null);
    }

    if (typeof this._auth === "function") {
      return Promise.resolve(this._auth());
    }

    return Promise.resolve(this._auth);
  }

  static isResourceUrl(url, match) {
    if (typeof url !== "string") {
      return false;
    }

    if (!SergeClient.isPermittedUrl(url)) {
      return false;
    }

    let urlSplit = url.split("/");
    let matchSplit = match.split("/");
    if (urlSplit.length < matchSplit.length) {
      return false;
    }

    matchSplit = matchSplit
      .map((el, index) => {
        if (el.match(paramRegex)) {
          urlSplit[index] = "";
          return "";
        }
        return el;
    });

    return urlSplit.join() === matchSplit.join();
  }

  getResourceDefinitions () {
    let url = this._baseUrl = "/api"
    return rp.get(url)
      .then(data => data.definitions);
  }
}

module.exports = SergeClient;
