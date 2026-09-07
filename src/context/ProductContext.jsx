import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, INITIAL_AREA_PRICES, CATEGORIES } from '../data/mockData';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('womup_products');
    return saved ? JSON.parse(saved) : PRODUCTS;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('womup_categories');
    return saved ? JSON.parse(saved) : CATEGORIES;
  });

  const [areaPrices, setAreaPrices] = useState(() => {
    const saved = localStorage.getItem('womup_area_prices');
    return saved ? JSON.parse(saved) : INITIAL_AREA_PRICES;
  });

  useEffect(() => {
    localStorage.setItem('womup_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('womup_area_prices', JSON.stringify(areaPrices));
  }, [areaPrices]);

  // Helper to fetch area-specific pricing and stock for a given product
  const getProductAreaPrice = (productId, areaId) => {
    const productPriceObj = areaPrices[productId] || {};
    const areaData = productPriceObj[areaId];

    if (areaData) {
      const discount = areaData.mrp > areaData.price 
        ? Math.round(((areaData.mrp - areaData.price) / areaData.mrp) * 100) 
        : 0;
      return {
        price: areaData.price,
        mrp: areaData.mrp,
        stock: areaData.stock,
        discount,
        available: areaData.stock > 0
      };
    }

    // Default fallback if area price not explicitly defined
    return {
      price: 30,
      mrp: 40,
      stock: 20,
      discount: 25,
      available: true
    };
  };

  // Admin function: update single product price & stock for an area
  const updateAreaPrice = (productId, areaId, newPrice, newMrp, newStock) => {
    setAreaPrices(prev => {
      const currentProd = prev[productId] || {};
      const currentArea = currentProd[areaId] || {};
      return {
        ...prev,
        [productId]: {
          ...currentProd,
          [areaId]: {
            ...currentArea,
            price: Number(newPrice),
            mrp: Number(newMrp),
            stock: Number(newStock)
          }
        }
      };
    });
  };

  // Bulk update area prices (e.g. adjust all prices in an area by a percentage or batch)
  const bulkUpdateArea = (areaId, adjustmentPercent) => {
    setAreaPrices(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(prodId => {
        if (updated[prodId][areaId]) {
          const current = updated[prodId][areaId];
          const factor = 1 + (adjustmentPercent / 100);
          updated[prodId][areaId] = {
            ...current,
            price: Math.max(1, Math.round(current.price * factor)),
            mrp: Math.max(1, Math.round(current.mrp * factor))
          };
        }
      });
      return { ...updated };
    });
  };

  // Inventory reservation / reduction when order confirmed
  const deductInventory = (items, areaId) => {
    setAreaPrices(prev => {
      const updated = { ...prev };
      items.forEach(item => {
        if (updated[item.id] && updated[item.id][areaId]) {
          const cur = updated[item.id][areaId];
          updated[item.id][areaId] = {
            ...cur,
            stock: Math.max(0, cur.stock - item.quantity)
          };
        }
      });
      return { ...updated };
    });
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        areaPrices,
        getProductAreaPrice,
        updateAreaPrice,
        bulkUpdateArea,
        deductInventory
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
