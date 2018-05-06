"use strict";

const url = require("url");
const rp = require("request-promise-native");
const SergeClient = require("serge-common").SergeClient;
const httpStatus = require("http-status-codes");

const _api = {
  getAll: "/v1/shipments",
  get: "/v1/shipments/{id}",
  update: "/v1/shipments/{id}",
  add: "/v1/shipments",
  delete: "/v1/shipments/{id}"
};

const deserializeDate = entry => {
  entry.expectedBy = new Date(entry.expectedBy);
  return entry;
};

class SergeShipmentsClient extends SergeClient {
  constructor(baseUrl, auth) {
    if (!baseUrl) {
      baseUrl = SergeShipmentsClient._defaultUrl;
    }
    super(baseUrl, auth);
  }

  getAll(showArchived) {
    return this.getAuth()
      .then(auth => {
        let options = {
          uri: this._baseUrl + SergeShipmentsClient._api.getAll,
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
          .then(resp => resp._embedded.shipments.map(deserializeDate))
      });
  }

  add(obj) {
    let url = this._baseUrl + SergeShipmentsClient._api.add;

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
    let url = this._baseUrl + SergeShipmentsClient._api.get;

    if (!id) {
      return Promise.resolve(null);
    }

    if (SergeShipmentsClient.isResourceUrl(id, url)) {
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
    let url = this._baseUrl + SergeShipmentsClient._api.update;

    if (SergeShipmentsClient.isResourceUrl(id, url)) {
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
    let url = this._baseUrl + SergeShipmentsClient._api.delete;

    if (!id) {
      return Promise.resolve(false);
    }

    if (SergeShipmentsClient.isResourceUrl(id, url)) {
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

SergeShipmentsClient._api = _api;
SergeShipmentsClient._defaultUrl = "https://shipments.serge.sowinski.blue";

module.exports = SergeShipmentsClient;
