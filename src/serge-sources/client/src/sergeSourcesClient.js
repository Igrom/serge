"use strict";

const url = require("url");
const rp = require("request-promise-native");
const SergeClient = require("serge-common").SergeClient;

const _api = {
  getAll: "/v1/sources",
  get: "/v1/sources/{id}",
  update: "/v1/sources/{id}",
  add: "/v1/sources",
  delete: "/v1/sources/{id}"
};

class SergeSourcesClient extends SergeClient {
  constructor(baseUrl, auth) {
    if (!baseUrl) {
      baseUrl = SergeSourcesClient._defaultUrl;
    }
    super(baseUrl, auth);
  }

  getAll(showArchived) {
    return this.getAuth()
      .then(auth => {
        let options = {
          uri: this._baseUrl + SergeSourcesClient._api.getAll,
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
          .then(resp => resp._embedded.sources);
      });
  }

  add(obj) {
    let url = this._baseUrl + SergeSourcesClient._api.add;

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
    let url = this._baseUrl + SergeSourcesClient._api.get;

    if (SergeSourcesClient.isResourceUrl(id, url)) {
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

        return rp.get(options);
      });
  }

  update(id, obj) {
    let url = this._baseUrl + SergeSourcesClient._api.update;

    if (SergeSourcesClient.isResourceUrl(id, url)) {
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
    let url = this._baseUrl + SergeSourcesClient._api.delete;

    if (SergeSourcesClient.isResourceUrl(id, url)) {
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

SergeSourcesClient._api = _api;
SergeSourcesClient._defaultUrl = "https://sources.serge.sowinski.blue";

module.exports = SergeSourcesClient;
