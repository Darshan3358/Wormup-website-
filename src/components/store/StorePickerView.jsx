import React, { useState } from 'react';
import { useOrders, ORDER_STATUSES } from '../../context/OrderContext';
import { useLocation } from '../../context/LocationContext';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icons';

export const StorePickerView = () => {
  const { 
    orders, 
    startPicking,
    startPacking,
    markReady,
    toggleItemPicked, 
    recordItemWeight, 
    suggestSubstitution 
  } = useOrders();
  const { areas } = useLocation();
  const { showToast } = useApp();

  const [activeStoreId, setActiveStoreId] = useState(areas[0]?.storeId || 'WM-BOP-01');
  const [activeQueueTab, setActiveQueueTab] = useState('ALL'); // 'ALL' | 'NEW' | 'PICKING' | 'PACKING' | 'READY'
  const [toleranceThreshold, setToleranceThreshold] = useState(5); // Configurable tolerance % (SRS Section 15)
  
  // Modals
  const [weightModalItem, setWeightModalItem] = useState(null); // { orderId, item }
  const [inputWeight, setInputWeight] = useState('');
  
  const [substituteModalItem, setSubstituteModalItem] = useState(null); // { orderId, item }
  const [substituteName, setSubstituteName] = useState('');

  const currentStore = areas.find(a => a.storeId === activeStoreId) || areas[0];

  // Filter orders for this specific dark store
  const storeOrders = orders.filter(o => o.storeId === activeStoreId || !o.storeId);

  const filteredOrders = storeOrders.filter(o => {
    if (activeQueueTab === 'NEW') return o.status === 'CONFIRMED';
    if (activeQueueTab === 'PICKING') return o.status === 'PICKING';
    if (activeQueueTab === 'PACKING') return o.status === 'PACKING';
    if (activeQueueTab === 'READY') return o.status === 'READY_FOR_PICKUP' || o.status === 'OUT_FOR_DELIVERY' || o.status === 'DELIVERED';
    return true;
  });

  const handleStartPicking = (orderId) => {
    const res = startPicking(orderId);
    if (res.success) {
      showToast(`Order #${orderId} picking started! Follow warehouse sequence.`, 'info');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleStartPacking = (orderId) => {
    const res = startPacking(orderId);
    if (res.success) {
      showToast(`Order #${orderId} moved to packing & quality check!`, 'info');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleOpenWeightModal = (orderId, item) => {
    setWeightModalItem({ orderId, item });
    setInputWeight(item.actualWeight ? item.actualWeight.replace(/[^0-9.]/g, '') : '');
  };

  const handleSaveWeight = (e) => {
    e.preventDefault();
    if (!weightModalItem || !inputWeight) return;

    const unitSuffix = weightModalItem.item.variant.includes('g') && !weightModalItem.item.variant.includes('kg') ? 'g' : 'kg';
    const formatted = `${parseFloat(inputWeight)} ${unitSuffix}`;

    recordItemWeight(weightModalItem.orderId, weightModalItem.item.id, weightModalItem.item.variant, formatted, toleranceThreshold);
    showToast(`Weighed ${weightModalItem.item.name}: ${formatted} recorded ✓`, 'success');
    setWeightModalItem(null);
  };

  const handleOpenSubstituteModal = (orderId, item) => {
    setSubstituteModalItem({ orderId, item });
    setSubstituteName('');
  };

  const handleSaveSubstitution = (e) => {
    e.preventDefault();
    if (!substituteModalItem || !substituteName) return;

    suggestSubstitution(
      substituteModalItem.orderId, 
      substituteModalItem.item.id, 
      substituteModalItem.item.variant, 
      substituteName, 
      'Fresh farm batch substitution'
    );
    showToast(`Substituted ${substituteModalItem.item.name} with ${substituteName}. Customer notified!`, 'info');
    setSubstituteModalItem(null);
  };

  const handleCompletePacking = (orderId) => {
    const sealCode = `BAG-${activeStoreId.split('-')[1] || 'BOP'}-${Math.floor(1000 + Math.random() * 9000)}`;
    const res = markReady(orderId, sealCode);
    if (res.success) {
      showToast(`Order #${orderId} sealed with label ${sealCode}! Ready for rider dispatch.`, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '24px 16px 60px 16px', color: '#12101B' }}>
      
      {/* RBAC Governance Notice Banner (SRS Section 34 & 38) */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(142, 92, 247, 0.12) 0%, rgba(232, 67, 147, 0.12) 100%)',
        border: '1.5px solid rgba(142, 92, 247, 0.3)',
        borderRadius: '12px',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7C3AED', fontWeight: 700 }}>
          <Icon name="shield" size={16} />
          <span>Role: Store Picker (In-Store Warehouse Fulfillment)</span>
        </div>
        <span style={{ color: '#6B6878', fontSize: '11px', fontWeight: 600 }}>
          🔒 Area selling prices are strictly governed by Admin & backend calculation.
        </span>
      </div>

      {/* Picker Header & Store Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
        background: '#FFFFFF',
        padding: 'clamp(14px, 4vw, 20px)',
        borderRadius: '16px',
        border: '1px solid #ECEAF2',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3px',
            boxShadow: '0 4px 14px rgba(232, 67, 147, 0.35)',
            flexShrink: 0
          }}>
            <img src="/womup-logo.png" alt="Womup" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 800, color: '#12101B', margin: 0, letterSpacing: '-0.3px' }}>
                Store Picking & Packing Station
              </h1>
              <span style={{
                background: 'rgba(31, 175, 110, 0.15)',
                color: '#1FAF6E',
                border: '1px solid rgba(31, 175, 110, 0.3)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 800
              }}>
                Picker: Amit Solanki (WM-PK-01)
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#6B6878', margin: '3px 0 0 0', fontWeight: 500 }}>
              Fulfillment DarkStore: <strong style={{ color: '#12101B' }}>{currentStore.storeName}</strong> ({currentStore.name}) • Target Pick Time: &lt; 3.5 mins
            </p>
          </div>
        </div>

        {/* Controls: Store Selector & Configurable Tolerance */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#6B6878', fontWeight: 600 }}>DarkStore:</span>
            <select
              value={activeStoreId}
              onChange={(e) => setActiveStoreId(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                background: '#FAF9FC',
                border: '1.5px solid #8E5CF7',
                color: '#12101B',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {areas.map(a => (
                <option key={a.storeId} value={a.storeId}>
                  {a.storeName} ({a.name})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#6B6878', fontWeight: 600 }}>Tolerance:</span>
            <select
              value={toleranceThreshold}
              onChange={(e) => setToleranceThreshold(Number(e.target.value))}
              style={{
                padding: '7px 10px',
                borderRadius: '8px',
                background: '#FAF9FC',
                border: '1.5px solid #1FAF6E',
                color: '#12101B',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <option value={3}>±3% (Strict)</option>
              <option value={5}>±5% (Standard)</option>
              <option value={8}>±8% (Flexible)</option>
              <option value={10}>±10% (Bulk)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Picker Queue Tabs as Swipeable Rail on Mobile (SRS Section 13) */}
      <div className="picker-queue-rail" style={{
        marginBottom: '20px',
        borderBottom: '1px solid #ECEAF2',
        paddingBottom: '12px'
      }}>
        {[
          { id: 'ALL', label: 'All Store Orders', count: storeOrders.length },
          { id: 'NEW', label: 'New Orders (Pending)', count: storeOrders.filter(o => o.status === 'CONFIRMED').length },
          { id: 'PICKING', label: 'Picking in Progress', count: storeOrders.filter(o => o.status === 'PICKING').length },
          { id: 'PACKING', label: 'Quality & Packing', count: storeOrders.filter(o => o.status === 'PACKING').length },
          { id: 'READY', label: 'Ready for Pickup / Out', count: storeOrders.filter(o => ['READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'].includes(o.status)).length }
        ].map(tab => {
          const isSelected = activeQueueTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveQueueTab(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: isSelected ? 'var(--gradient-brand)' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#6B6878',
                border: `1px solid ${isSelected ? 'transparent' : '#ECEAF2'}`,
                fontWeight: isSelected ? 800 : 600,
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 4px 12px rgba(232, 67, 147, 0.3)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }}
            >
              <span>{tab.label}</span>
              <span style={{
                background: isSelected ? 'rgba(255, 255, 255, 0.25)' : '#F0EEF6',
                color: isSelected ? '#FFFFFF' : '#12101B',
                fontSize: '11px',
                padding: '1px 6px',
                borderRadius: '9999px',
                fontWeight: 700
              }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #ECEAF2'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#12101B', marginBottom: '6px' }}>
            No orders in this queue right now
          </h3>
          <p style={{ fontSize: '13px', color: '#6B6878', margin: 0 }}>
            New customer orders placed for {currentStore.name} will automatically sync into this queue in real-time.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredOrders.map(order => {
            const allItemsPicked = order.items.every(i => i.picked);
            const pickedCount = order.items.filter(i => i.picked).length;
            const statusMeta = ORDER_STATUSES[order.status] || { color: '#8E5CF7', label: order.status };

            return (
              <div
                key={order.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1.5px solid #ECEAF2',
                  padding: 'clamp(14px, 3.5vw, 22px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                }}
              >
                {/* Order Top Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: '#12101B' }}>
                        Order #{order.id}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        padding: '3px 9px',
                        borderRadius: '9999px',
                        fontWeight: 800,
                        background: `${statusMeta.color}15`,
                        border: `1px solid ${statusMeta.color}40`,
                        color: statusMeta.color
                      }}>
                        {statusMeta.label}
                      </span>
                      {order.bagSealNumber && (
                        <span style={{ fontSize: '11px', background: '#E4F8ED', color: '#1FAF6E', padding: '3px 8px', borderRadius: '6px', fontWeight: 700, fontFamily: 'monospace' }}>
                          🏷️ {order.bagSealNumber}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B6878', marginTop: '3px' }}>
                      Customer: <strong>{order.customerName}</strong> • Delivery: <strong>{order.areaName}</strong> • Target: {order.eta}
                    </div>
                  </div>

                  {/* Progress Counter */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#12101B' }}>
                      Items Picked: <span style={{ color: allItemsPicked ? '#1FAF6E' : '#7C3AED' }}>{pickedCount} / {order.items.length}</span>
                    </div>
                    <div style={{ width: '120px', height: '6px', background: '#F0EEF6', borderRadius: '3px', marginTop: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(pickedCount / order.items.length) * 100}%`, height: '100%', background: allItemsPicked ? '#1FAF6E' : 'var(--gradient-brand)', transition: 'width 0.2s' }} />
                    </div>
                  </div>
                </div>

                {/* Items Picking Sequence (SRS Section 15) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '10px',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: item.picked ? '#F4FBF7' : '#FAF9FC',
                        border: `1px solid ${item.picked ? 'rgba(31, 175, 110, 0.4)' : '#ECEAF2'}`
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 200px' }}>
                        <button
                          onClick={() => toggleItemPicked(order.id, item.id, item.variant)}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            background: item.picked ? '#1FAF6E' : '#FFFFFF',
                            border: `2px solid ${item.picked ? '#1FAF6E' : '#D1CDDC'}`,
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            flexShrink: 0
                          }}
                        >
                          {item.picked && <Icon name="check" size={14} />}
                        </button>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#12101B' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#6B6878' }}>
                            Required: <strong style={{ color: '#7C3AED' }}>{item.variant}</strong>
                            {item.actualWeight && (
                              <span style={{ color: '#1FAF6E', marginLeft: '8px', fontWeight: 700 }}>
                                • Weighed: {item.actualWeight} ✓
                              </span>
                            )}
                            {item.substituted && (
                              <span style={{ color: '#F5A524', marginLeft: '8px', fontWeight: 700 }}>
                                • Substituted: {item.substituteName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Weight Verification & Substitution buttons (SRS Section 15 & 16) */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleOpenWeightModal(order.id, item)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            background: item.actualWeight ? '#E4F8ED' : '#FFFFFF',
                            border: `1px solid ${item.actualWeight ? '#1FAF6E' : '#8E5CF7'}`,
                            color: item.actualWeight ? '#1FAF6E' : '#7C3AED',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          ⚖️ {item.actualWeight ? 'Re-Weigh' : 'Weigh Produce'}
                        </button>
                        <button
                          onClick={() => handleOpenSubstituteModal(order.id, item)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            background: '#FFFFFF',
                            border: '1px solid #D1CDDC',
                            color: '#6B6878',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                          title="Out of stock? Suggest substitute"
                        >
                          Substitute
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Operational Action Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #ECEAF2', paddingTop: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#6B6878' }}>
                    Order Total: <strong>₹{order.grandTotal}</strong> • Payment: <strong>{order.paymentMethod} (SUCCESS)</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {order.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleStartPicking(order.id)}
                        style={{
                          background: 'var(--gradient-brand)',
                          color: '#FFFFFF',
                          padding: '8px 18px',
                          borderRadius: '8px',
                          border: 'none',
                          fontWeight: 800,
                          fontSize: '12px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(232, 67, 147, 0.3)'
                        }}
                      >
                        Start Picking Order
                      </button>
                    )}

                    {order.status === 'PICKING' && (
                      <button
                        onClick={() => handleStartPacking(order.id)}
                        disabled={!allItemsPicked}
                        style={{
                          background: allItemsPicked ? '#8E5CF7' : '#D1CDDC',
                          color: '#FFFFFF',
                          padding: '8px 18px',
                          borderRadius: '8px',
                          border: 'none',
                          fontWeight: 800,
                          fontSize: '12px',
                          cursor: allItemsPicked ? 'pointer' : 'not-allowed'
                        }}
                      >
                        Move to Quality & Packing
                      </button>
                    )}

                    {order.status === 'PACKING' && (
                      <button
                        onClick={() => handleCompletePacking(order.id)}
                        style={{
                          background: '#1FAF6E',
                          color: '#FFFFFF',
                          padding: '8px 20px',
                          borderRadius: '8px',
                          border: 'none',
                          fontWeight: 800,
                          fontSize: '12px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(31, 175, 110, 0.35)'
                        }}
                      >
                        ✓ Seal Bag & Mark READY_FOR_PICKUP
                      </button>
                    )}

                    {order.status === 'READY_FOR_PICKUP' && (
                      <span style={{ fontSize: '12px', color: '#7C3AED', fontWeight: 800 }}>
                        ⏳ Waiting for Delivery Rider Pickup
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 1. Weight Verification Modal (SRS Section 15) */}
      {weightModalItem && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10, 8, 20, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <form
            onSubmit={handleSaveWeight}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '420px',
              boxShadow: '0 12px 36px rgba(0,0,0,0.2)'
            }}
          >
            <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 6px 0', color: '#12101B' }}>
              Weigh Produce: {weightModalItem.item.name}
            </h3>
            <p style={{ fontSize: '12px', color: '#6B6878', margin: '0 0 16px 0' }}>
              Customer ordered: <strong style={{ color: '#7C3AED' }}>{weightModalItem.item.variant}</strong> (Target tolerance ±5%)
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#12101B', display: 'block', marginBottom: '6px' }}>
                Actual Digital Scale Reading
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 0.98 or 2.02"
                value={inputWeight}
                onChange={(e) => setInputWeight(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '2px solid #8E5CF7', borderRadius: '8px', fontSize: '16px', fontWeight: 800 }}
                required
                autoFocus
              />
              <span style={{ fontSize: '11px', color: '#1FAF6E', marginTop: '4px', display: 'block' }}>
                ✓ Normal tolerance permitted as per Womup Store Rules
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setWeightModalItem(null)}
                style={{ padding: '8px 14px', borderRadius: '6px', background: 'transparent', border: '1px solid #D1CDDC', cursor: 'pointer', fontSize: '12px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ padding: '8px 18px', borderRadius: '6px', background: '#1FAF6E', color: '#FFFFFF', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '12px' }}
              >
                Confirm Weighed Weight
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Substitution Modal (SRS Section 16) */}
      {substituteModalItem && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10, 8, 20, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <form
            onSubmit={handleSaveSubstitution}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '420px',
              boxShadow: '0 12px 36px rgba(0,0,0,0.2)'
            }}
          >
            <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 6px 0', color: '#12101B' }}>
              Suggest Substitute: {substituteModalItem.item.name}
            </h3>
            <p style={{ fontSize: '12px', color: '#EF4444', margin: '0 0 16px 0', fontWeight: 600 }}>
              Mark original item as Out of Stock and propose an alternative
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#12101B', display: 'block', marginBottom: '6px' }}>
                Replacement Item Name & Variant
              </label>
              <input
                type="text"
                placeholder="e.g. Organic Country Tomato (1 kg)"
                value={substituteName}
                onChange={(e) => setSubstituteName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #8E5CF7', borderRadius: '8px', fontSize: '13px' }}
                required
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSubstituteModalItem(null)}
                style={{ padding: '8px 14px', borderRadius: '6px', background: 'transparent', border: '1px solid #D1CDDC', cursor: 'pointer', fontSize: '12px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ padding: '8px 18px', borderRadius: '6px', background: 'var(--gradient-brand)', color: '#FFFFFF', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '12px' }}
              >
                Notify Customer
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
