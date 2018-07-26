"use strict";

const HttpStatus = require("http-status-codes");
const winston = require("winston");
const uuid = require("uuid");

const serializeDate = require("../../common/serializeDate");
const { calculateDeficits, getShipmentsFromDeficits, assignOrdersToLocations } = require("../../plan");
const SergeError = require("serge-common").SergeError;

let post = async (req, res) => {
  const shipmentsClient = new req.dependencies.ISergeShipmentsClient(req.dependencies.sergeShipmentsUrl);
  const ordersClient = new req.dependencies.ISergeOrdersClient(req.dependencies.sergeOrdersUrl);
  const productsClient = new req.dependencies.ISergeProductsClient(req.dependencies.sergeProductsUrl);
  const stockClient = new req.dependencies.ISergeStockClient(req.dependencies.sergeStockUrl);
  const locationsClient = new req.dependencies.ISergeLocationsClient(req.dependencies.sergeLocationsUrl);

  const deficits = await calculateDeficits(shipmentsClient, ordersClient);
  const shipments = await getShipmentsFromDeficits(shipmentsClient, ordersClient, productsClient, deficits);
  const locations = await assignOrdersToLocations(locationsClient, ordersClient);

  for (let i = 0; i < shipments.length; i++) {
    let shipment = shipments[i];
    shipment.stock = [];

    for (let j = 0; j < shipment.products.length; j++) {
      let product = shipment.products[j];
      let stockItem = await stockClient.add({
        product: product.product,
        quantity: product.quantity
      });

      shipment.stock.push(stockItem._links.self.href);
    }

    delete shipment.products;
  };

  let promises = shipments.map(shipment => shipmentsClient.add(shipment));
  promises.concat(locations.map(location => {
    let id = location._links.self.href;
    delete location._links;
    delete location.id;
    return locationsClient.update(id, location);
  }));

  Promise.all(promises)
    .then(() => res.status(HttpStatus.NO_CONTENT).end())
    .catch(err => {
      winston.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new SergeError(err.message));
    });
};

module.exports = {
  post
};
