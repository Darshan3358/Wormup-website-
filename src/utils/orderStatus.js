/**
 * Womup Canonical Order Lifecycle State Machine & Tolerance Engine
 */

export const ORDER_STATUSES = {
  CONFIRMED: { 
    key: 'CONFIRMED',
    label: 'Order Confirmed', 
    step: 1, 
    color: '#10B981',
    desc: 'Order received and inventory allocated'
  },
  PICKING: { 
    key: 'PICKING',
    label: 'Gathering Produce', 
    step: 2, 
    color: '#F59E0B',
    desc: 'Store picker gathering fresh vegetables'
  },
  PACKING: { 
    key: 'PACKING',
    label: 'Weighing & Quality Check', 
    step: 3, 
    color: '#8E5CF7',
    desc: 'Weighing accuracy and freshness verification'
  },
  READY_FOR_PICKUP: { 
    key: 'READY_FOR_PICKUP',
    label: 'Packed at DarkStore', 
    step: 4, 
    color: '#7C3AED',
    desc: 'Bag sealed and waiting for rider handover'
  },
  RIDER_ASSIGNED: { 
    key: 'RIDER_ASSIGNED',
    label: 'Rider Dispatched', 
    step: 5, 
    color: '#06B6D4',
    desc: 'Rider accepted order and heading to dark store'
  },
  OUT_FOR_DELIVERY: { 
    key: 'OUT_FOR_DELIVERY',
    label: 'Out for Delivery (<10 mins)', 
    step: 6, 
    color: '#3B82F6',
    desc: 'Rider on electric scooter with your order'
  },
  DELIVERED: { 
    key: 'DELIVERED',
    label: 'Delivered Fresh', 
    step: 7, 
    color: '#10B981',
    desc: 'Handed over with 4-digit OTP verification'
  },
  CANCELLED: { 
    key: 'CANCELLED',
    label: 'Cancelled', 
    step: -1, 
    color: '#EF4444',
    desc: 'Order cancelled'
  }
};

/**
 * Strict Allowed Transitions State Machine Guards
 */
export const ALLOWED_TRANSITIONS = {
  CONFIRMED: ['PICKING', 'CANCELLED'],
  PICKING: ['PACKING', 'CANCELLED'],
  PACKING: ['READY_FOR_PICKUP', 'CANCELLED'],
  READY_FOR_PICKUP: ['RIDER_ASSIGNED', 'CANCELLED'],
  RIDER_ASSIGNED: ['OUT_FOR_DELIVERY', 'READY_FOR_PICKUP', 'CANCELLED'], // Reassignment if rider rejects
  OUT_FOR_DELIVERY: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: []
};

/**
 * Validates if transition from currentStatus to targetStatus is valid
 * @param {string} currentStatus 
 * @param {string} targetStatus 
 * @returns {boolean}
 */
export const canTransition = (currentStatus, targetStatus) => {
  if (!currentStatus || !targetStatus) return false;
  if (currentStatus === targetStatus) return true;
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  return allowed.includes(targetStatus);
};

/**
 * Produces tolerance calculation for weight-based produce (SRS Section 15)
 * e.g., ordered = 1.00 kg, actual = 0.98 kg => 2% diff <= 5% tolerance => PASS
 * @param {number} orderedQty 
 * @param {number} actualQty 
 * @param {number} tolerancePercent 
 * @returns {{ pass: boolean, diffPercent: number, label: string }}
 */
export const verifyWeightTolerance = (orderedQty, actualQty, tolerancePercent = 5) => {
  const ord = parseFloat(orderedQty);
  const act = parseFloat(actualQty);

  if (isNaN(ord) || isNaN(act) || ord <= 0) {
    return { pass: true, diffPercent: 0, label: 'Standard' };
  }

  const diff = Math.abs(act - ord);
  const diffPercent = (diff / ord) * 100;
  const pass = diffPercent <= tolerancePercent;

  return {
    pass,
    diffPercent: Math.round(diffPercent * 10) / 10,
    label: pass ? `Within tolerance (${Math.round(diffPercent)}%) ✓` : `Needs review (${Math.round(diffPercent)}% > ${tolerancePercent}%) ⚠️`
  };
};
