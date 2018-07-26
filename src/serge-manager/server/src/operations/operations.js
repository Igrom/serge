"use strict";

const modeToPlace = (text) => text.match(/place/);

const cancel = (text) => text.match(/cancel/);

const chooseStock = async (employee, text, stockClient, ordersClient, locationsClient) => {
  let allStock = await stockClient.getAll();

  let stockItem = allStock.find(s => s._links.self.href.match(new RegExp(`stock/${text}`)));
  if (!stockItem) { return; }

  let locations = await locationsClient.getAll();
  let allOrders = await ordersClient.getAll();

  let totalDistributedQuantityForStock = locations
    .map(location => location.stock)
    .reduce((acc, val) => acc.concat(val), [])
    .filter(stock => stock.stock === stockItem._links.self.href)
    .reduce((acc, val) => acc + val.quantity, 0);

  if (totalDistributedQuantityForStock >= stockItem.quantity) {
    console.log("Stock expended.");
    return false;
  }


  let locationsWhoseOrdersRequireThisItem = locations
    .filter(location => location.order)
    .filter(location => allOrders.find(order => order._links.self.href === location.order)
      .products.find(product => product.product === stockItem.product));

  let aboveLocationsThatAreUnsatisfiedForThisItem = locationsWhoseOrdersRequireThisItem
    .filter(location => {
      let storedQuantity = location.stock
        .filter(stock => allStock.find(s => s._links.self.href === stock.stock).product === stockItem.product)
        .reduce((acc, val) => acc + val.quantity, 0);

      let expectedQuantity = allOrders.find(o => o._links.self.href === location.order).products
        .find(p => p.product === stockItem.product).quantity;

      console.log('The location', location);
      console.log('Expected quantity', expectedQuantity);
      console.log('Stored quantity', storedQuantity);

      return expectedQuantity > storedQuantity;
    });

  aboveLocationsThatAreUnsatisfiedForThisItem.sort((a, b) => {
    let orderA = allOrders.find(o => o._links.self.href === a.order);
    let orderB = allOrders.find(o => o._links.self.href === b.order);

    return orderA.expectedBy > orderB.expectedBy;
  });

  employee.state.currentStock = stockItem._links.self.href;

  console.log();

  if (!aboveLocationsThatAreUnsatisfiedForThisItem.length) { return false; }
  employee.state.currentLocation = aboveLocationsThatAreUnsatisfiedForThisItem[0]._links.self.href;

  return true;
};

const checkLocation = async (employee, text, stockClient, ordersClient, locationsClient) => {
  let location = await locationsClient.get(employee.state.currentLocation);
  let allLocations = await locationsClient.getAll();

  if (location.code !== text) {
    return;
  }

  let stockItem = await stockClient.get(employee.state.currentStock);
  let allStock = await stockClient.getAll();
  let order = await ordersClient.get(location.order);

  let expectedQuantity = order.products.find(p => p.product === stockItem.product).quantity;
  let storedQuantity = location.stock
    .filter(stock => allStock.find(s => s._links.self.href === stock.stock).product === stockItem.product)
    .reduce((acc, val) => acc + val.quantity, 0);
  let remainingStockQuantity = stockItem.quantity - allLocations
    .map(location => location.stock)
    .reduce((acc, val) => acc.concat(val), [])
    .filter(stock => stock.stock === employee.state.currentStock)
    .reduce((acc, val) => acc + val.quantity, 0);

  let quantityToPlace = Math.min(expectedQuantity - storedQuantity, remainingStockQuantity);
  employee.state.quantityToPlace = quantityToPlace;

  return true;
};

const placeInsufficientQuantity = async (employee, text) => {
  if (isNaN(Number(text)) || Number(text) >= employee.state.quantityToPlace) { return; }

  employee.state.statedQuantity = Number(text);
  return true;
};

const placeSufficientMoreLocations = async (employee, text, stockClient, ordersClient, locationsClient) => {
  if (isNaN(Number(text)) || Number(text) != employee.state.quantityToPlace) { return; }

  let location = await locationsClient.get(employee.state.currentLocation);
  location.stock.push({
    stock: employee.state.currentStock,
    quantity: employee.state.quantityToPlace
  });
  delete location._links;
  delete location.id;
  await locationsClient.update(employee.state.currentLocation, location);

  let stockId = employee.state.currentStock.split("/")[employee.state.currentStock.split("/").length - 1];

  return await chooseStock(employee, stockId, stockClient, ordersClient, locationsClient);
};

const placeSufficientNoMoreLocations = async (employee, text) => !isNaN(Number(text)) && Number(text) == employee.state.quantityToPlace;

const confirmInsufficientQuantity = async (employee, text, stockClient, ordersClient, locationsClient) => {
  if (isNaN(Number(text)) || Number(text) != employee.state.statedQuantity) { return; }

  let location = await locationsClient.get(employee.state.currentLocation);
  location.stock.push({
    stock: employee.state.currentStock,
    quantity: employee.state.statedQuantity
  });
  delete location._links;
  delete location.id;
  console.log(location);
  await locationsClient.update(employee.state.currentLocation, location);

  let stockId = employee.state.currentStock.split("/")[employee.state.currentStock.split("/").length - 1];
  return true;
};

module.exports = {
  cancel,
  modeToPlace,
  chooseStock,
  checkLocation,
  placeInsufficientQuantity,
  placeSufficientMoreLocations,
  placeSufficientNoMoreLocations,
  confirmInsufficientQuantity,
};
