"use strict";

const calculateDeficits = async (shipmentsClient, ordersClient) => {
  let [allShipments, allOrders] = await Promise.all([
    shipmentsClient.getAll(),
    ordersClient.getAll()
  ]);

  let allProductQuantityChanges = {};

  allShipments.map(currentShipment => {
    currentShipment.products.map(currentProduct => {
      let quantityEntry = {
        date: currentShipment.expectedBy,
        quantityDelta: currentProduct.quantity
      };

      if (!allProductQuantityChanges[currentProduct.product]) {
        allProductQuantityChanges[currentProduct.product] = [quantityEntry];
      } else {
        allProductQuantityChanges[currentProduct.product].push(quantityEntry);
      }
    });
  });

  allOrders.map(currentOrder => {
    currentOrder.products.map(currentProduct => {
      let quantityEntry = {
        date: currentOrder.expectedBy,
        quantityDelta: -currentProduct.quantity
      };

      if (!allProductQuantityChanges[currentProduct.product]) {
        allProductQuantityChanges[currentProduct.product] = [quantityEntry];
      } else {
        allProductQuantityChanges[currentProduct.product].push(quantityEntry);
      }
    });
  });

    let deficits = {};

  // oblicz deficyt produktów i zwróć datę, kiedy występuje pierwszy brak
  Object.keys(allProductQuantityChanges).map(productSku => {
    let quantityChanges = allProductQuantityChanges[productSku];

    // sortuj rosnąco zmiany w ilości towaru według daty
    quantityChanges.sort((a, b) => {a.date > b.date});

    let deficitTotal = 0;
    let runningTotal = 0;
    let firstDeficitDate = null;
    for (let i = 0; i < quantityChanges.length; i++) {
      runningTotal += quantityChanges[i].quantityDelta;
      if (runningTotal < 0) {
        deficitTotal -= runningTotal;
        runningTotal = 0;
        firstDeficitDate = firstDeficitDate || quantityChanges[i].date;
      }
    }
    if (deficitTotal > 0) {
      let deficitEntry = {
        date: firstDeficitDate,
        quantity: deficitTotal
      };

      deficits[productSku] = deficitEntry;
    }
  });

  return deficits;
};

const getShipmentsFromDeficits = async (shipmentsClient, ordersClient, productsClient, deficits) => {
  let products = await productsClient.getAll()
  products = products.filter(product => Object.keys(deficits).includes(product._links.self.href));

  const sourcesProductsMapping = products.reduce((acc, product) => {
    if (!acc[product.source]) {
      acc[product.source] = [product._links.self.href];
    } else {
      acc[product.source].push(product._links.self.href);
    }

    return acc;
  }, {});

  let shipments = [];
  Object.keys(sourcesProductsMapping)
    .map(source => {
      let shipment = {};

      shipment.source = source;
      shipment.expectedBy = Object.keys(deficits).filter(k => sourcesProductsMapping[source].includes(k))
        .map(k => deficits[k].date)
        .reduce((acc, val) => {
          if (acc > val) { return val; }
          return acc;
        }, Date.now());

      shipment.products = Object.keys(deficits).filter(k => sourcesProductsMapping[source].includes(k))
        .map(k => {
          let productDeficit = deficits[k];
          let productDefinition = products.find(product => product._links.self.href === k);
          let numberOfFullBatches = Math.floor(productDeficit.quantity / productDefinition.batchQuantity);
          let remainderBatchQuantity = Math.max(productDeficit.quantity - (productDefinition.batchQuantity * numberOfFullBatches), productDefinition.minimumOrderableQuantity);

          let productSet = [];
          for (let i = 0; i < numberOfFullBatches; i++) {
            productSet.push({
              product: k,
              quantity: productDefinition.batchQuantity
            });
          }

          productSet.push({
            product: k,
            quantity: remainderBatchQuantity
          });

          return productSet;
        })
        .reduce((acc, val) => acc.concat(val), []);

      shipments.push(shipment);
    });

  return shipments;
};

module.exports = {
  calculateDeficits,
  getShipmentsFromDeficits
};
