"use strict";

const modeToPlace = (text) => text.match(/place/);

const chooseStock = async (employee, text, stockClient, ordersClient, locationsClient) => {
  let allStock = await stockClient.getAll();

  let stockItem = allStock.find(s => s._links.self.href.match(new RegExp(`stock/${text}`)));
  if (!stockItem) { return; }

  let locations = locationsClient.getAll();
  let allOrders = ordersClient.getAll();
  let locationsWhoseOrdersRequireThisItem = locations
    .filter(location => allOrders.find(order => order._links.self.href === location.order)
      .products.find(product => product.product === stockItem.product));

  let aboveLocationsThatAreUnsatisfiedForThisItem = locationsWhoseOrdersRequireThisItem
    .filter(location => {
      let storedQuantity = location.stock
        .filter(stock => allStock.find(s => s._links.self.href === stock.stock).product === stockItem.product)
        .reduce((acc, val) => acc + val.quantity, 0);

      let expectedQuantity = allOrders.find(o => o._links.self.href === location.order).products
        .find(p => p.product === stockItem.product).quantity;

      return expectedQuantity > storedQuantity;
    });

  aboveLocationsThatAreUnsatisfiedForThisItem.sort((a, b) => {
    let orderA = allOrders.find(o => o._links.self.href === a.order);
    let orderB = allOrders.find(o => o._links.self.href === b.order);

    return orderA.expectedBy > orderB.expectedBy;
  });

  employee.state.currentStock = stockItem._links.self.href;
  employee.state.currentLocation = aboveLocationsThatAreUnsatisfiedForThisItem[0]._links.self.href;

  return true;
};

module.exports = {
  chooseStock
};
