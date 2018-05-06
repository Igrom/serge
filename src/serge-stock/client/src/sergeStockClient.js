"use strict";

const url = require("url");
const rp = require("request-promise-native");
const SergeClient = require("serge-common").SergeClient;
const httpStatus = require("http-status-codes");

const _api = {
  getAll: "/v1/stock",
  get: "/v1/stock/{id}",
  add: "/v1/stock",
  delete: "/v1/stock/{id}"
};

class SergeStockClient extends SergeClient {
  constructor(baseUrl, auth) {
    if (!baseUrl) {
      baseUrl = SergeStockClient._defaultUrl;
    }
    super(baseUrl, auth);
  }

  getAll(showArchived) {
    return this.getAuth()
      .then(auth => {
        let options = {
          uri: this._baseUrl + SergeStockClient._api.getAll,
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
          .then(resp => resp._embedded.stock);
      });
  }

  add(obj) {
    let url = this._baseUrl + SergeStockClient._api.add;

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
    let url = this._baseUrl + SergeStockClient._api.get;

    if (!id) {
      return Promise.resolve(null);
    }

    if (SergeStockClient.isResourceUrl(id, url)) {
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
          })
      });
  }

  delete(id) {
    let url = this._baseUrl + SergeStockClient._api.delete;

    if (!id) {
      return Promise.resolve(false);
    }

    if (SergeStockClient.isResourceUrl(id, url)) {
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

SergeStockClient._api = _api;
SergeStockClient._defaultUrl = "https://stock.serge.sowinski.blue";

module.exports = SergeStockClient;
