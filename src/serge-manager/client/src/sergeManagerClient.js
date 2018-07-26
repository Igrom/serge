"use strict";

const url = require("url");
const rp = require("request-promise-native");
const SergeClient = require("serge-common").SergeClient;
const httpStatus = require("http-status-codes");

const _api = {
  planShipments: "/v1/planshipments",
  getAllEmployees: "/v1/employees",
  addEmployee: "/v1/employees",
  getEmployee: "/v1/employees/{id}",
  postAction: "/v1/employees/{id}/action"
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

  addEmployee() {
    let url = this._baseUrl + SergeManagerClient._api.addEmployee;

    return this.getAuth()
      .then(auth => {
        let options = {
          uri: url,
          headers: {
            Authorization: auth
          },
          json: true
        };

        return rp.post(options)
          .catch(err => {
            if (err.statusCode === httpStatus.NOT_FOUND) {
              return null;
            }
            throw err;
          })
      });
  }

  getAllEmployees() {
    let url = this._baseUrl + SergeManagerClient._api.getAllEmployees;

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
          .then(resp => resp._embedded.employees)
      });
  }

  getEmployee(id) {
    let url = this._baseUrl + SergeManagerClient._api.getEmployee;

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

  postAction(id, text) {
    let url = this._baseUrl + SergeManagerClient._api.postAction;

    if (!id) {
      return Promise.resolve(null);
    }

    if (SergeManagerClient.isResourceUrl(id, url)) {
      url = `${id}/action`;
    } else {
      url = url.replace("{id}", id);
    }
 
    return this.getAuth()
      .then(auth => {
        let options = {
          uri: url,
          body: {
            text
          },
          headers: {
            Authorization: auth
          },
          json: true
        };

        return rp.post(options)
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
