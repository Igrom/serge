"use strict";

const url = require("url");
const rp = require("request-promise-native");
const SergeClient = require("serge-common").SergeClient;
const httpStatus = require("http-status-codes");

const _api = {
  planShipments: "/v1/shipments/plan",
  get: "/v1/shipments/plan"
};

class SergeManagerClient extends SergeClient {
  constructor(baseUrl, auth) {
    if (!baseUrl) {
      baseUrl = SergeManagerClient._defaultUrl;
    }
    super(baseUrl, auth);
  }

  planShipments() {
    let url = this._baseUrl + SergeManagerClient._api.planShipments;

    return this.getAuth()
      .then(auth => {
        let options = {
          uri: url,
          headers: {
            Authorization: auth
          },
          json: true
        };

        return rp.post(options);
      });
  }

  get(id) {
    let url = this._baseUrl + SergeManagerClient._api.get;

    if (!id) {
      return Promise.resolve(null);
    }

    if (SergeManagerClient.isResourceUrl(id, url)) {
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
}

SergeManagerClient._api = _api;
SergeManagerClient._defaultUrl = "https://manager.serge.sowinski.blue";

module.exports = SergeManagerClient;
