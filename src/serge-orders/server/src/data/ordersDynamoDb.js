"use strict";

const AWS = require("aws-sdk");

const IOrders = require("./IOrders");
const tableName = "serge-orders";

class OrdersDynamoDb {
  constructor(configuration) {
    this.client = new AWS.DynamoDB.DocumentClient(configuration);
    this.rawClient = new AWS.DynamoDB(configuration);
  }

  createTable() {
    let options = {
      TableName: tableName,
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S"
        }
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH"
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 100,
        WriteCapacityUnits: 100
      }
    };

    return this.rawClient.createTable(options)
      .promise()
      .then(() => true);
  }

  getAll() {
    return this.client
      .scan({
        TableName: tableName
      })
      .promise()
      .then(res => res.Items)
  }

  get(id) {
    return this.client
      .get({
        TableName: tableName,
        Key: {
          id: id
        }
      })
      .promise()
      .then(res => {
        return res.Item;
      });
  }

  put(id, payload) {
    return this.client
      .put({
        TableName: tableName,
        Item: Object.assign({
          id: id
        }, payload)
      })
      .promise()
      .then(() => true);
  }

  delete(id) {
    return this.client
      .delete({
        TableName: tableName,
        Key: {
          id: id
        }
      })
      .promise()
      .then(() => true);
  }
}

module.exports = OrdersDynamoDb;
