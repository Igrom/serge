"use strict";

const {
  sergeShipmentsClient,
  sergeStockClient,
  sergeOrdersClient
} = require("../preconfiguredClients");

/**
 * Funkcja calculateDeficit zwraca informację o brakach
 * na stanie towarów w oparciu o informacje na temat
 * ilości towarów na stanie, ilości towarów w zatwierdzonych
 * przyszłych dostawach oraz ilości towarów zamówionych.
 */
const calculateDeficit = () => {
  const currentDate = new Date();
  let allShipments = await sergeShipmentClient.getAll();
  let allOrders = await sergeOrdersClient.getAll();

  /**
   * Zmienna przechowująca informacje o zmianach ilości towarów w czasie.
   * Słownik o strukturze:
   *   {
   *   [product.sku]: [
   *      {
   *        date: <Date>,
   *        quantityDelta: <Number>
   *      }
   *    ]
   *  }
   *
   */
  let allProductQuantityChanges = {};

  // dodaj informacje o ilości towarów na stanie
  allStock.map(currentStockEntry => {
    let initialQuantityEntry = {
      date: new Date(0),
      quantityDelta: currentStockEntry.product.quantity
    };

    allProductQuantityChanges[currentStockEntry.product.sku] = [initialQuantityEntry];
  });

  // dodaj informacje o ilości towarów w zatwierdzonych przyszłych dostawach
  allShipments.map(currentShipment => {
    currentOrder.products.map(currentProduct => {
      let quantityEntry = {
        date: currentShipment.date,
        quantityDelta: currentShipment.quantity 
      };

      if (!allProductQuantityChanges[currentProduct.sku]) {
        allProductQuantityChanges[currentProduct.sku] = [quantityEntry];
      } else {
        allProductQuantityChanges[currentProduct.sku].push(quantityEntry);
      }
    });
  });

  // dodaj informacje o ilości towarów zamówionych
  allOrders.map(currentOrder => {
    currentOrder.products.map(currentProduct => {
      let quantityEntry = {
        date: currentOrder.date,
        quantityDelta: -currentOrder.quantity 
      };

      if (!allProductQuantityChanges[currentProduct.sku]) {
        allProductQuantityChanges[currentProduct.sku] = [quantityEntry];
      } else {
        allProductQuantityChanges[currentProduct.sku].push(quantityEntry);
      }
    });
  });

  /**
   * Zmienna przechowująca informację o deficytach.
   * Każdy wpis w słowniku przedstawia produkt, którego wystąpi deficyt
   * i datę prognozowanego pierwszego braku
   * Słownik o strukturze:
   *   {
   *   [product.sku]: [
   *      {
   *        date: <Date>,
   *        deficitQuantity: <Number>
   *      }
   *    ]
   *  }
   *
   */
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
        deficitQuantity: deficitTotal
      };

      deficits[productSku] = deficitEntry;
    }
  });

  return deficits;
};
