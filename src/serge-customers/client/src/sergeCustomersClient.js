"use strict";

const url = require("url");
const rp = require("request-promise-native");
const SergeClient = require("serge-common").SergeClient;

const _api = {
  getAll: "/v1/customers",
  get: "/v1/customers/{id}",
  update: "/v1/customers/{id}",
  add: "/v1/customers",
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

        return rp.get(options)
          .then(resp => resp._embedded.customers);
      });
  }

  add(obj) {
    let url = this._baseUrl + SergeCustomersClient._api.add;

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

  update(id, obj) {
    let url = this._baseUrl + SergeCustomersClient._api.update;

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
          body: obj,
          json: true
        };

        return rp.put(options);
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

        return rp.delete(options);
      });
  }
}

SergeCustomersClient._api = _api;

module.exports = SergeCustomersClient;
