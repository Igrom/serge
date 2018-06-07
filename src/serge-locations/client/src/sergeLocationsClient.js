"use strict";

const url = require("url");
const rp = require("request-promise-native");
const SergeClient = require("serge-common").SergeClient;
const httpStatus = require("http-status-codes");

const _api = {
  getAll: "/v1/locations",
  get: "/v1/locations/{id}",
  update: "/v1/locations/{id}",
  add: "/v1/locations",
  delete: "/v1/locations/{id}"
};

class SergeLocationsClient extends SergeClient {
  constructor(baseUrl, auth) {
    if (!baseUrl) {
      baseUrl = SergeLocationsClient._defaultUrl;
    }
    super(baseUrl, auth);
  }

  getAll(showArchived) {
    return this.getAuth()
      .then(auth => {
        let options = {
          uri: this._baseUrl + SergeLocationsClient._api.getAll,
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
          .then(resp => resp._embedded.locations)
      });
  }

  add(obj) {
    let url = this._baseUrl + SergeLocationsClient._api.add;

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
    let url = this._baseUrl + SergeLocationsClient._api.get;

    if (!id) {
      return Promise.resolve(null);
    }

    if (SergeLocationsClient.isResourceUrl(id, url)) {
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

  update(id, obj) {
    let url = this._baseUrl + SergeLocationsClient._api.update;

    if (SergeLocationsClient.isResourceUrl(id, url)) {
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
    let url = this._baseUrl + SergeLocationsClient._api.delete;

    if (!id) {
      return Promise.resolve(false);
    }

    if (SergeLocationsClient.isResourceUrl(id, url)) {
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

SergeLocationsClient._api = _api;
SergeLocationsClient._defaultUrl = "https://locations.serge.sowinski.blue";

module.exports = SergeLocationsClient;
