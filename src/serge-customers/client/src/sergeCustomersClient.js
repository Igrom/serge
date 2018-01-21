"use strict";

const url = require("url");
const rp = require("request-promise-native");
const SergeClient = require("serge-common").SergeClient;

const _api = {
  getAll: "/v1/customers",
  get: "/v1/customers/{id}",
  create: "/v1/customers",
  delete: "/v1/customers/{id}"
};

class SergeCustomersClient extends SergeClient {
  constructor(baseUrl, auth) {
    super(baseUrl, auth);
  }

  getAll() {
    return this._getAuth()
      .then(auth => {
        let options = {
          uri: this._baseUrl + SergeCustomersClient._api.getAll,
          headers: {
            Authorization: auth
          },
          json: true
        };
        console.log(options);

        return rp.get(options);
      });
  }

  get(id) {
    let url = this._baseUrl + SergeCustomersClient._api.get;

    if (SergeCustomersClient.isResourceUrl(id, url)) {
      url = id;
    } else {
      url = url.replace("{id}", id);
    }
 
    return this._getAuth()
      .then(auth => {
        let options = {
          uri: url,
          headers: {
            Authorization: auth
          },
          json: true
        };

        return rp.get(options);
      });
  }

  add(obj) {
    let url = this._baseUrl + SergeCustomersClient._api.create;

    return this._getAuth()
      .then(auth => {
        let options = {
          uri: url,
          headers: {
            Authorization: auth
          },
          body: obj,
          json: true
        };

        return rp.post(options);
      });
  }

  delete(id) {
    let url = this._baseUrl + SergeCustomersClient._api.delete;

    if (SergeCustomersClient.isResourceUrl(id, url)) {
      url = id;
    } else {
      url = url.replace("{id}", id);
    }
 
    return this._getAuth()
      .then(auth => {
        let options = {
          uri: url,
          headers: {
            Authorization: auth
          },
          json: true
        };

        return rp.get(options);
      });
  }
}

SergeCustomersClient._api = _api;

module.exports = SergeCustomersClient;
