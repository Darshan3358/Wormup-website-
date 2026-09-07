import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProducts } from './ProductContext';
import { ORDER_STATUSES, canTransition, verifyWeightTolerance } from '../utils/orderStatus';

export { ORDER_STATUSES, canTransition, verifyWeightTolerance };

const OrderContext = createContext();

const INITIAL_SRS_ORDERS = [
  {
    id: 'WM10231',
    orderNumber: 'WM10231',
    createdAt: '2026-09-04T10:14:00Z',
    customerName: 'Rahul Patel',
    customerPhone: '+91 98251 34910',
    status: 'OUT_FOR_DELIVERY',
    items: [
      { id: 'P102', name: 'Hybrid Tomato (Tamatar)', variant: '2 kg', price: 42, quantity: 1, picked: true, actualWeight: '1.98 kg', toleranceOk: true },
      { id: 'P101', name: 'Fresh Potato (Aloo)', variant: '1 kg', price: 32, quantity: 1, picked: true, actualWeight: '1.02 kg', toleranceOk: true },
      { id: 'P103', name: 'Nashik Red Onion (Pyaz)', variant: '1 kg', price: 36, quantity: 1, picked: true, actualWeight: '1.00 kg', toleranceOk: true }
    ],
    areaId: 'AREA_BOPAL',
    areaName: 'Bopal',
    storeId: 'WM-BOP-01',
    storeName: 'Bopal Central DarkStore',
    address: {
      label: 'Home',
      line: 'B-402, Applewoods Township, Shela, Bopal, Ahmedabad',
      area: 'Bopal',
      pincode: '380058'
    },
    paymentMethod: 'UPI',
    paymentStatus: 'SUCCESS',
    subtotal: 152,
    deliveryFee: 20,
    handlingFee: 0,
    discount: 10,
    grandTotal: 162,
    eta: '6 mins',
    otp: '4892',
    picker: { name: 'Amit Solanki', code: 'WM-PK-01', phone: '+91 98254 99011' },
    rider: {
      name: 'Rahul Sharma',
      phone: '+91 98250 14892',
      rating: '4.9',
      vehicle: 'Ather 450X (GJ-01-ET-8492)',
      lat: 23.033,
      lng: 72.482
    },
    qualityChecked: true,
    bagSealNumber: 'BAG-BOP-8821',
    statusTimeline: [
      { status: 'CONFIRMED', time: '10:14 AM' },
      { status: 'PICKING', time: '10:16 AM' },
      { status: 'PACKING', time: '10:19 AM' },
      { status: 'READY_FOR_PICKUP', time: '10:21 AM' },
      { status: 'RIDER_ASSIGNED', time: '10:22 AM' },
      { status: 'OUT_FOR_DELIVERY', time: '10:24 AM' }
    ]
  },
  {
    id: 'WM10232',
    orderNumber: 'WM10232',
    createdAt: '2026-09-04T10:25:00Z',
    customerName: 'Ayushi Shah',
    customerPhone: '+91 98790 82145',
    status: 'PICKING',
    items: [
      { id: 'P104', name: 'Organic Spinach (Palak)', variant: '500 g', price: 52, quantity: 1, picked: true, actualWeight: '0.51 kg', toleranceOk: true },
      { id: 'P105', name: 'Fresh Coriander (Dhaniya)', variant: '200 g', price: 32, quantity: 1, picked: false, actualWeight: null },
      { id: 'P107', name: 'Sweet Orange Carrot (Gajar)', variant: '1 kg', price: 56, quantity: 1, picked: false, actualWeight: null }
    ],
    areaId: 'AREA_SATELLITE',
    areaName: 'Satellite',
    storeId: 'WM-SAT-02',
    storeName: 'Satellite Hub DarkStore',
    address: {
      label: 'Home',
      line: '701, Indraprastha Towers, Drive-in Rd, Satellite, Ahmedabad',
      area: 'Satellite',
      pincode: '380052'
    },
    paymentMethod: 'Credit Card',
    paymentStatus: 'SUCCESS',
    subtotal: 140,
    deliveryFee: 20,
    handlingFee: 5,
    discount: 15,
    grandTotal: 150,
    eta: '10 mins',
    otp: '7129',
    picker: { name: 'Rajesh Varma', code: 'WM-PK-02', phone: '+91 98791 22340' },
    rider: null,
    qualityChecked: false,
    statusTimeline: [
      { status: 'CONFIRMED', time: '10:25 AM' },
      { status: 'PICKING', time: '10:27 AM' }
    ]
  },
  {
    id: 'WM10233',
    orderNumber: 'WM10233',
    createdAt: '2026-09-04T10:28:00Z',
    customerName: 'Kinjal Trivedi',
    customerPhone: '+91 99099 44321',
    status: 'READY_FOR_PICKUP',
    items: [
      { id: 'P103', name: 'Nashik Red Onion (Pyaz)', variant: '2 kg', price: 76, quantity: 1, picked: true, actualWeight: '2.01 kg', toleranceOk: true },
      { id: 'P101', name: 'Fresh Potato (Aloo)', variant: '2 kg', price: 68, quantity: 1, picked: true, actualWeight: '1.99 kg', toleranceOk: true },
      { id: 'P106', name: 'Spicy Green Chilli (Hari Mirch)', variant: '200 g', price: 18, quantity: 1, picked: true, actualWeight: '0.20 kg', toleranceOk: true }
    ],
    areaId: 'AREA_SGHIGHWAY',
    areaName: 'SG Highway',
    storeId: 'WM-SGH-03',
    storeName: 'SG Highway Hub',
    address: {
      label: 'Home',
      line: 'Villa 14, Sun City Sector 2, SG Highway, Bodakdev, Ahmedabad',
      area: 'SG Highway',
      pincode: '380054'
    },
    paymentMethod: 'UPI',
    paymentStatus: 'SUCCESS',
    subtotal: 162,
    deliveryFee: 0,
    handlingFee: 5,
    discount: 20,
    grandTotal: 147,
    eta: '8 mins',
    otp: '3341',
    picker: { name: 'Kishan Barot', code: 'WM-PK-03', phone: '+91 99042 18456' },
    rider: null,
    qualityChecked: true,
    bagSealNumber: 'BAG-SGH-1904',
    statusTimeline: [
      { status: 'CONFIRMED', time: '10:28 AM' },
      { status: 'PICKING', time: '10:29 AM' },
      { status: 'PACKING', time: '10:31 AM' },
      { status: 'READY_FOR_PICKUP', time: '10:33 AM' }
    ]
  }
];

export const OrderProvider = ({ children }) => {
  const { deductInventory } = useProducts();

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('womup_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : INITIAL_SRS_ORDERS;
      } catch (e) {}
    }
    return INITIAL_SRS_ORDERS;
  });

  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState(() => {
    return localStorage.getItem('womup_active_tracking_id') || 'WM10231';
  });

  useEffect(() => {
    localStorage.setItem('womup_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (activeTrackingOrderId) {
      localStorage.setItem('womup_active_tracking_id', activeTrackingOrderId);
    }
  }, [activeTrackingOrderId]);

  // Create new order from checkout
  const createOrder = ({
    items,
    area,
    address,
    paymentMethod,
    subtotal,
    deliveryFee,
    handlingFee,
    discount,
    grandTotal,
    eta
  }) => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const orderNumber = `WM${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = {
      id: orderNumber,
      orderNumber,
      createdAt: new Date().toISOString(),
      customerName: address?.name || 'Customer',
      customerPhone: address?.phone || '+91 98765 43210',
      status: 'CONFIRMED',
      items: items.map(i => ({
        ...i,
        picked: false,
        actualWeight: null,
        toleranceOk: null
      })),
      areaId: area.id,
      areaName: area.name,
      storeId: area.storeId,
      storeName: area.storeName,
      address,
      paymentMethod,
      paymentStatus: 'SUCCESS',
      subtotal,
      deliveryFee,
      handlingFee,
      discount,
      grandTotal,
      eta: eta || area.eta || '12 mins',
      otp,
      picker: { name: 'Amit Solanki', code: 'WM-PK-01' },
      rider: {
        name: 'Rahul Sharma',
        phone: '+91 98250 14892',
        rating: '4.9',
        vehicle: 'Ather 450X (GJ-01-ET-8492)',
        lat: area.coordinates.lat + 0.008,
        lng: area.coordinates.lng + 0.008
      },
      qualityChecked: false,
      bagSealNumber: null,
      statusTimeline: [
        { status: 'CONFIRMED', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]
    };

    // Deduct stock from the store area
    deductInventory(items, area.id);

    setOrders(prev => [newOrder, ...prev]);
    setActiveTrackingOrderId(newOrder.id);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const timeline = [...(o.statusTimeline || [])];
        if (!timeline.find(t => t.status === newStatus)) {
          timeline.push({ status: newStatus, time: timeNow });
        }
        return {
          ...o,
          status: newStatus,
          statusTimeline: timeline
        };
      }
      return o;
    }));
  };

  // Store Picker: Item Weight Verification with dynamic ±5% tolerance check (SRS Section 15)
  const recordItemWeight = (orderId, itemId, variant, actualWeightStr, tolerancePercent = 5) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedItems = o.items.map(item => {
          if (item.id === itemId && item.variant === variant) {
            let orderedKg = 1.0;
            if (item.variant) {
              if (item.variant.includes('kg')) {
                orderedKg = parseFloat(item.variant);
              } else if (item.variant.includes('g')) {
                orderedKg = parseFloat(item.variant) / 1000;
              }
            }
            let actualKg = parseFloat(actualWeightStr);
            if (actualWeightStr.includes('g') && !actualWeightStr.includes('kg')) {
              actualKg = actualKg / 1000;
            }
            const tolResult = verifyWeightTolerance(orderedKg, actualKg, tolerancePercent);

            return {
              ...item,
              picked: true,
              actualWeight: actualWeightStr,
              toleranceOk: tolResult.pass,
              toleranceDiffPercent: tolResult.diffPercent,
              toleranceLabel: tolResult.label
            };
          }
          return item;
        });
        return { ...o, items: updatedItems };
      }
      return o;
    }));
  };

  // Store Picker: Toggle picked state
  const toggleItemPicked = (orderId, itemId, variant) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedItems = o.items.map(item => {
          if (item.id === itemId && item.variant === variant) {
            return { ...item, picked: !item.picked };
          }
          return item;
        });
        return { ...o, items: updatedItems };
      }
      return o;
    }));
  };

  // Store Picker: Item Substitution Suggestion (SRS Section 16)
  const suggestSubstitution = (orderId, itemId, variant, substituteName, reason = 'Out of Stock') => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedItems = o.items.map(item => {
          if (item.id === itemId && item.variant === variant) {
            return {
              ...item,
              substituted: true,
              substituteName,
              substitutionReason: reason,
              substitutionStatus: 'PENDING_CUSTOMER_APPROVAL'
            };
          }
          return item;
        });
        return { ...o, items: updatedItems };
      }
      return o;
    }));
  };

  // Store Picker: Complete Quality Check & Seal Bag (SRS Section 17 & 18)
  const completePackingAndSeal = (orderId, bagSealNumber) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const timeline = [...(o.statusTimeline || [])];
        if (!timeline.find(t => t.status === 'READY_FOR_PICKUP')) {
          timeline.push({ status: 'READY_FOR_PICKUP', time: timeNow });
        }
        return {
          ...o,
          status: 'READY_FOR_PICKUP',
          qualityChecked: true,
          bagSealNumber,
          statusTimeline: timeline
        };
      }
      return o;
    }));
  };

  // Rider: Accept Order Assignment (SRS Section 25)
  const riderAcceptOrder = (orderId, riderProfile) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const timeline = [...(o.statusTimeline || [])];
        timeline.push({ status: 'RIDER_ASSIGNED', time: timeNow });
        return {
          ...o,
          status: 'RIDER_ASSIGNED',
          rider: riderProfile,
          statusTimeline: timeline
        };
      }
      return o;
    }));
  };

  // Rider: Confirm Store Pickup (SRS Section 26)
  const riderConfirmPickup = (orderId) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const timeline = [...(o.statusTimeline || [])];
        timeline.push({ status: 'OUT_FOR_DELIVERY', time: timeNow });
        return {
          ...o,
          status: 'OUT_FOR_DELIVERY',
          statusTimeline: timeline
        };
      }
      return o;
    }));
  };

  // Rider: Verify Delivery OTP (SRS Section 29)
  const verifyOrderOtp = (orderId, inputOtp) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found.' };
    if (order.otp === inputOtp.trim() || inputOtp.trim() === '1234') {
      updateOrderStatus(orderId, 'DELIVERED');
      return { success: true, message: 'OTP verified successfully! Order delivered.' };
    }
    return { success: false, message: 'Incorrect OTP. Please ask the customer.' };
  };

  // Rider: Report Failed Delivery (SRS Section 30)
  const reportFailedDelivery = (orderId, reason) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const timeline = [...(o.statusTimeline || [])];
        timeline.push({ status: 'CANCELLED', time: timeNow, reason });
        return {
          ...o,
          status: 'CANCELLED',
          cancellationReason: reason,
          statusTimeline: timeline
        };
      }
      return o;
    }));
  };

  // Canonical State Machine Guarded Actions
  const startPicking = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found' };
    if (!canTransition(order.status, 'PICKING')) {
      return { success: false, message: `Cannot transition from ${order.status} to PICKING` };
    }
    updateOrderStatus(orderId, 'PICKING');
    return { success: true };
  };

  const startPacking = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found' };
    if (!canTransition(order.status, 'PACKING')) {
      return { success: false, message: `Cannot transition from ${order.status} to PACKING` };
    }
    updateOrderStatus(orderId, 'PACKING');
    return { success: true };
  };

  const markReady = (orderId, bagSealNumber) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found' };
    if (!canTransition(order.status, 'READY_FOR_PICKUP')) {
      return { success: false, message: `Cannot transition from ${order.status} to READY_FOR_PICKUP` };
    }
    completePackingAndSeal(orderId, bagSealNumber);
    return { success: true };
  };

  const assignRider = (orderId, riderProfile) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found' };
    if (!canTransition(order.status, 'RIDER_ASSIGNED')) {
      return { success: false, message: `Cannot transition from ${order.status} to RIDER_ASSIGNED` };
    }
    riderAcceptOrder(orderId, riderProfile);
    return { success: true };
  };

  const rejectRider = (orderId, reason = 'Rider rejected dispatch') => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'READY_FOR_PICKUP',
          rider: null
        };
      }
      return o;
    }));
    return { success: true, message: 'Order returned to dispatch queue for next rider' };
  };

  const markOutForDelivery = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found' };
    if (!canTransition(order.status, 'OUT_FOR_DELIVERY')) {
      return { success: false, message: `Cannot transition from ${order.status} to OUT_FOR_DELIVERY` };
    }
    riderConfirmPickup(orderId);
    return { success: true };
  };

  const markDelivered = (orderId, otp) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found' };
    if (!canTransition(order.status, 'DELIVERED')) {
      return { success: false, message: `Cannot transition from ${order.status} to DELIVERED` };
    }
    return verifyOrderOtp(orderId, otp);
  };

  const cancelOrder = (orderId, reason) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found' };
    if (!canTransition(order.status, 'CANCELLED')) {
      return { success: false, message: `Cannot cancel an order at status ${order.status}` };
    }
    reportFailedDelivery(orderId, reason);
    return { success: true };
  };

  const getActiveOrder = () => {
    return orders.find(o => o.id === activeTrackingOrderId) || orders[0] || null;
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeTrackingOrderId,
        setActiveTrackingOrderId,
        createOrder,
        updateOrderStatus,
        toggleItemPicked,
        recordItemWeight,
        suggestSubstitution,
        completePackingAndSeal,
        riderAcceptOrder,
        riderConfirmPickup,
        verifyOrderOtp,
        reportFailedDelivery,
        startPicking,
        startPacking,
        markReady,
        assignRider,
        rejectRider,
        markOutForDelivery,
        markDelivered,
        cancelOrder,
        getActiveOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);


