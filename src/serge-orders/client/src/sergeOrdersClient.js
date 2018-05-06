"use strict";

const url = require("url");
const rp = require("request-promise-native");
const SergeClient = require("serge-common").SergeClient;
const httpStatus = require("http-status-codes");

const _api = {
  getAll: "/v1/orders",
  get: "/v1/orders/{id}",
  update: "/v1/orders/{id}",
  add: "/v1/orders",
  delete: "/v1/orders/{id}"
};

const deserializeDate = entry => {
  entry.expectedBy = new Date(entry.expectedBy);
  return entry;
};

class SergeOrdersClient extends SergeClient {
  constructor(baseUrl, auth) {
    if (!baseUrl) {
      baseUrl = SergeOrdersClient._defaultUrl;
    }
    super(baseUrl, auth);
  }

  getAll(showArchived) {
    return this.getAuth()
      .then(auth => {
        let options = {
          uri: this._baseUrl + SergeOrdersClient._api.getAll,
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
          .then(resp => resp._embedded.orders.map(deserializeDate))
      });
  }

  add(obj) {
    let url = this._baseUrl + SergeOrdersClient._api.add;

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

        return rp.post(options)
          .then(deserializeDate);
      });
  }

  get(id) {
    let url = this._baseUrl + SergeOrdersClient._api.get;

    if (!id) {
      return Promise.resolve(null);
    }

    if (SergeOrdersClient.isResourceUrl(id, url)) {
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
          .then(deserializeDate)
          .catch(err => {
            if (err.statusCode === httpStatus.NOT_FOUND) {
              return null;
            }
            throw err;
          })
      });
  }

  update(id, obj) {
    let url = this._baseUrl + SergeOrdersClient._api.update;

    if (SergeOrdersClient.isResourceUrl(id, url)) {
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

        return rp.put(options)
          .then(deserializeDate);
      });
  }

  delete(id) {
    let url = this._baseUrl + SergeOrdersClient._api.delete;

    if (!id) {
      return Promise.resolve(false);
    }

    if (SergeOrdersClient.isResourceUrl(id, url)) {
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

SergeOrdersClient._api = _api;
SergeOrdersClient._defaultUrl = "https://orders.serge.sowinski.blue";

module.exports = SergeOrdersClient;
