import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from './LocationContext';
import { useProducts } from './ProductContext';
import { COUPONS, getVariantPricing } from '../data/mockData';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { selectedArea } = useLocation();
  const { getProductAreaPrice } = useProducts();

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('womup_cart_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [cartAreaId, setCartAreaId] = useState(() => {
    return localStorage.getItem('womup_cart_area_id') || selectedArea?.id || 'AREA_BOPAL';
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [areaChangeAlert, setAreaChangeAlert] = useState(null);

  // Save cart state
  useEffect(() => {
    localStorage.setItem('womup_cart_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('womup_cart_area_id', cartAreaId);
  }, [cartAreaId]);

  // CRITICAL FEATURE: Validate and Recalculate Cart when User Changes Area
  useEffect(() => {
    if (!selectedArea || items.length === 0) {
      if (selectedArea) setCartAreaId(selectedArea.id);
      return;
    }

    if (cartAreaId !== selectedArea.id) {
      const priceChanges = [];
      const updatedItems = items.map(item => {
        const basePricing = getProductAreaPrice(item.id, selectedArea.id);
        const variantPricing = getVariantPricing(basePricing.price, basePricing.mrp, item.unit, item.variant);
        if (variantPricing.price !== item.price) {
          priceChanges.push({
            name: `${item.name} (${item.variant})`,
            oldPrice: item.price,
            newPrice: variantPricing.price
          });
        }
        return {
          ...item,
          price: variantPricing.price,
          mrp: variantPricing.mrp,
          stock: basePricing.stock
        };
      });

      setItems(updatedItems);
      setCartAreaId(selectedArea.id);

      if (priceChanges.length > 0) {
        setAreaChangeAlert({
          message: `Delivery area switched to ${selectedArea.name}. Prices for ${priceChanges.length} item(s) updated.`,
          changes: priceChanges
        });
      }
    }
  }, [selectedArea, cartAreaId, getProductAreaPrice, items]);

  const addToCart = (product, variant = null) => {
    const basePricing = getProductAreaPrice(product.id, selectedArea.id);
    const chosenVariant = variant || product.unit;
    const variantPricing = getVariantPricing(basePricing.price, basePricing.mrp, product.unit, chosenVariant);

    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id && item.variant === chosenVariant);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            image: product.image,
            unit: product.unit,
            variant: chosenVariant,
            price: variantPricing.price,
            mrp: variantPricing.mrp,
            quantity: 1,
            stock: basePricing.stock
          }
        ];
      }
    });
    setCartAreaId(selectedArea.id);
  };

  const updateQuantity = (productId, variant, delta) => {
    setItems(prev => {
      return prev
        .map(item => {
          if (item.id === productId && item.variant === variant) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeItem = (productId, variant) => {
    setItems(prev => prev.filter(item => !(item.id === productId && item.variant === variant)));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setCouponError('');
  };

  const getItemQuantity = (productId, variant = null) => {
    if (variant) {
      const found = items.find(i => i.id === productId && i.variant === variant);
      return found ? found.quantity : 0;
    }
    const filtered = items.filter(i => i.id === productId);
    return filtered.reduce((acc, curr) => acc + curr.quantity, 0);
  };

  // Calculations
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalMrp = items.reduce((sum, item) => sum + (item.mrp || item.price) * item.quantity, 0);
  const itemSavings = Math.max(0, totalMrp - subtotal);

  const deliveryFee = subtotal > 299 ? 0 : (selectedArea?.deliveryFee || 20);
  const handlingFee = items.length > 0 ? 5 : 0;

  // Coupon application logic
  const applyCoupon = (code) => {
    setCouponError('');
    const match = COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!match) {
      setCouponError('Invalid coupon code.');
      return false;
    }

    if (subtotal < match.minOrder) {
      setCouponError(`Minimum order value of ₹${match.minOrder} required for ${match.code}.`);
      return false;
    }

    setCoupon(match);
    return true;
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError('');
  };

  let couponDiscount = 0;
  if (coupon) {
    if (coupon.type === 'FLAT') {
      couponDiscount = coupon.discount;
    } else if (coupon.type === 'PERCENTAGE') {
      const calc = Math.round((subtotal * coupon.percentage) / 100);
      couponDiscount = Math.min(calc, coupon.maxDiscount || calc);
    }
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee + handlingFee - couponDiscount);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        totalMrp,
        itemSavings,
        deliveryFee,
        handlingFee,
        coupon,
        couponDiscount,
        couponError,
        grandTotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        getItemQuantity,
        applyCoupon,
        removeCoupon,
        areaChangeAlert,
        dismissAreaAlert: () => setAreaChangeAlert(null)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
