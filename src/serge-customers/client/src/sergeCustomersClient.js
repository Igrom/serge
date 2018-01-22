"use strict";

const url = require("url");
const rp = require("request-promise-native");
const SergeClient = require("serge-common").SergeClient;
const httpStatus = require("http-status-codes");

const _api = {
  getAll: "/v1/customers",
  get: "/v1/customers/{id}",
  update: "/v1/customers/{id}",
  add: "/v1/customers",
  delete: "/v1/customers/{id}"
};

class SergeCustomersClient extends SergeClient {
  constructor(baseUrl, auth) {
    if (!baseUrl) {
      baseUrl = SergeCustomersClient._defaultUrl;
    }
    super(baseUrl, auth);
  }

  getAll(showArchived) {
    return this.getAuth()
      .then(auth => {
        let options = {
          uri: this._baseUrl + SergeCustomersClient._api.getAll,
          headers: {
            Authorization: auth
          },
          json: true
        };

        if (showArchived) {
          options.qs = Object.assign({}, options.qs, {
            showArchived: true
          });
        }

        return rp.get(options)
          .then(resp => resp._embedded.customers);
      });
  }

  add(obj) {
    let url = this._baseUrl + SergeCustomersClient._api.add;

    return this.getAuth()
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

    if (!id) {
      return Promise.resolve(null);
    }

    if (SergeCustomersClient.isResourceUrl(id, url)) {
      url = id;
    } else {
      url = url.replace("{id}", id);
    }
 
    return this.getAuth()
      .then(auth => {
        let options = {
          uri: url,
          headers: {
            Authorization: auth
          },
          json: true
        };

        return rp.get(options)
          .catch(err => {
            if (err.statusCode === httpStatus.NOT_FOUND) {
              return null;
            }
            throw err;
          });
      });
  }

  update(id, obj) {
    let url = this._baseUrl + SergeCustomersClient._api.update;

    if (SergeCustomersClient.isResourceUrl(id, url)) {
      url = id;
    } else {
      url = url.replace("{id}", id);
    }

    return this.getAuth()
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

    if (!id) {
      return Promise.resolve(false);
    }

    if (SergeCustomersClient.isResourceUrl(id, url)) {
      url = id;
    } else {
      url = url.replace("{id}", id);
    }
 
    return this.getAuth()
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
SergeCustomersClient._defaultUrl = "https://customers.serge.sowinski.blue";

module.exports = SergeCustomersClient;
