import AreaPrice from '../models/AreaPrice.js';
import Inventory from '../models/Inventory.js';

/**
 * Validates and calculates order prices from the database for a specific area.
 * NEVER trust prices sent by the frontend client.
 */
export const calculateOrderTotal = async (items, areaId, storeId) => {
  let subtotal = 0;
  const verifiedItems = [];

  for (const item of items) {
    // 1. Fetch official Area Price
    const areaPriceRecord = await AreaPrice.findOne({
      productId: item.productId,
      areaId: areaId,
      status: 'ACTIVE'
    });

    if (!areaPriceRecord) {
      throw new Error(`Price not configured for product ${item.productId} in area ${areaId}`);
    }

    // 2. Check current store inventory
    const inventoryRecord = await Inventory.findOne({
      storeId: storeId,
      productId: item.productId
    });

    const availableStock = inventoryRecord ? inventoryRecord.availableQuantity : 0;
    if (availableStock < item.quantity) {
      throw new Error(`Insufficient stock for product ${item.productId}. Available: ${availableStock}`);
    }

    const itemPrice = areaPriceRecord.sellingPrice;
    const itemSubtotal = itemPrice * item.quantity;
    subtotal += itemSubtotal;

    verifiedItems.push({
      productId: item.productId,
      productName: item.name || 'Vegetable',
      quantity: item.quantity,
      unit: item.unit || '1 kg',
      variant: item.variant,
      price: itemPrice, // Frozen snapshot price
      subtotal: itemSubtotal
    });
  }

  return {
    verifiedItems,
    subtotal
  };
};
