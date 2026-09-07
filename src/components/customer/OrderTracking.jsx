import React, { useState, useEffect } from 'react';
import { useOrders, ORDER_STATUSES } from '../../context/OrderContext';
import { useRouter } from '../../navigation/RouterContext';
import { Icon } from '../common/Icons';
import { LiveTrackingMap } from './LiveTrackingMap';

export const OrderTracking = () => {
  const { orders, activeTrackingOrderId, setActiveTrackingOrderId, getActiveOrder } = useOrders();
  const { currentPath, navigate } = useRouter();
  
  // Extract orderId from URL if path is /orders/:orderId
  const urlOrderId = currentPath.startsWith('/orders/') 
    ? currentPath.replace('/orders/', '').split('/')[0].split('?')[0] 
    : null;

  const order = (urlOrderId ? orders.find(o => o.id === urlOrderId || o.orderNumber === urlOrderId) : null) || getActiveOrder();

  if (!order) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <span style={{ fontSize: '48px' }}>📦</span>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '12px', color: 'var(--text-primary)' }}>Order Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '8px 0 20px 0' }}>
          We could not find an order with this ID.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button onClick={() => navigate('/orders')} className="btn-secondary">
            View My Orders
          </button>
          <button onClick={() => navigate('/')} className="btn-primary">
            Shop Fresh Vegetables
          </button>
        </div>
      </div>
    );
  }

  const canonicalSteps = [
    { key: 'CONFIRMED', title: 'Confirmed', desc: 'Order placed & dark store notified', icon: 'checkCircle' },
    { key: 'PICKING', title: 'Picking', desc: 'Picker gathering produce', icon: 'package' },
    { key: 'PACKING', title: 'Weighed & Packed', desc: '±5% tolerance check passed', icon: 'boxes' },
    { key: 'READY_FOR_PICKUP', title: 'Ready at Store', desc: 'Tamper seal applied', icon: 'shield' },
    { key: 'RIDER_ASSIGNED', title: 'Rider Assigned', desc: 'Heading to dark store', icon: 'bike' },
    { key: 'OUT_FOR_DELIVERY', title: 'On the Way', desc: 'Fast delivery to doorstep', icon: 'navigation' },
    { key: 'DELIVERED', title: 'Delivered', desc: 'Handover verified via OTP', icon: 'sparkles' }
  ];

  const statusKeys = canonicalSteps.map(s => s.key);
  const currentStepIndex = statusKeys.indexOf(order.status);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 0 60px 0' }}>
      
      {/* Top back & Multi-Order Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => navigate('/orders')}
            className="btn-secondary"
            style={{ fontSize: '13px', padding: '8px 14px' }}
          >
            ← My Orders
          </button>
          <button 
            onClick={() => navigate('/')}
            className="btn-secondary"
            style={{ fontSize: '13px', padding: '8px 14px' }}
          >
            🥬 Fresh Market
          </button>
        </div>

        {/* Live synchronized order switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface)', padding: '6px 12px', borderRadius: '10px', border: '1.5px solid #ECEAF2', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1FAF6E', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: '12px', color: '#12101B', fontWeight: 700 }}>Order:</span>
          <select
            value={order.id}
            onChange={(e) => {
              setActiveTrackingOrderId(e.target.value);
              navigate(`/orders/${e.target.value}`);
            }}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              background: '#F8F7FB',
              border: '1px solid #D9D6E5',
              fontSize: '12px',
              fontWeight: 700,
              color: '#12101B',
              cursor: 'pointer'
            }}
          >
            {orders.map(o => (
              <option key={o.id} value={o.id}>
                #{o.id} — {o.customerName} ({o.status.replace(/_/g, ' ')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Real-Time Synchronization Banner (Phase 5 SRS requirement) */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(31, 175, 110, 0.08) 0%, rgba(142, 92, 247, 0.08) 100%)',
        border: '1px solid rgba(31, 175, 110, 0.25)',
        borderRadius: '12px',
        padding: '10px 16px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', fontWeight: 700 }}>
          <span>🛰️ Live Delivery Telemetry:</span>
          <span style={{ fontWeight: 500, color: '#374151' }}>
            Broadcasting live GPS coordinates from Rider App via WebSocket/BroadcastChannel.
          </span>
        </div>
        <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600 }}>
          DarkStore: {order.storeName}
        </span>
      </div>

      {/* Main Tracking Card */}
      <div 
        className="glass-panel"
        style={{
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(14px, 4vw, 28px)',
          border: '1px solid var(--border)',
          marginBottom: '24px'
        }}
      >
        {/* Order Header & ETA */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: '#FFFFFF',
              border: '1px solid var(--border)',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-subtle)',
              flexShrink: 0
            }}>
              <img src="/womup-logo.png" alt="WOMUP" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span className="badge-eta" style={{ fontSize: '13px', padding: '4px 12px' }}>
                  <Icon name="clock" size={14} /> {order.status === 'DELIVERED' ? 'Delivered Fresh' : (order.status === 'CANCELLED' ? 'Cancelled' : `Target ${order.eta}`)}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Order #{order.orderNumber}
                </span>
                {order.bagSealNumber && (
                  <span style={{ fontSize: '11px', background: 'rgba(142, 92, 247, 0.12)', color: '#7C3AED', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    Seal: {order.bagSealNumber}
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 800, marginTop: '4px', color: 'var(--text-primary)' }}>
                {ORDER_STATUSES[order.status]?.label || order.status}
              </h1>
            </div>
          </div>

          {/* Secure Delivery OTP Box */}
          <div style={{
            background: 'var(--fresh-green-soft)',
            border: '1.5px solid var(--fresh-green)',
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-subtle)',
            flexShrink: 0
          }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--fresh-green)', fontWeight: 800, display: 'block' }}>
              Delivery OTP
            </span>
            <span style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '4px', color: 'var(--text-primary)' }}>
              {order.otp}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>
              Share with rider only
            </span>
          </div>
        </div>

        {/* Real-time Google Maps & Road Route Visualizer with Real Rider GPS */}
        <div style={{ margin: '24px 0' }}>
          <LiveTrackingMap 
            orderId={order.id}
            orderStatus={order.status}
            rider={order.rider}
            storeLocation={{ 
              lat: order.storeLat || (order.storeId === 'WM-SAT-02' ? 23.0298 : order.storeId === 'WM-SGH-03' ? 23.0487 : 23.0338), 
              lng: order.storeLng || (order.storeId === 'WM-SAT-02' ? 72.5273 : order.storeId === 'WM-SGH-03' ? 72.5085 : 72.4633) 
            }}
            customerLocation={{ 
              lat: order.address?.lat || (order.areaId === 'AREA_SATELLITE' ? 23.0345 : order.areaId === 'AREA_SGHIGHWAY' ? 23.0542 : 23.0385), 
              lng: order.address?.lng || (order.areaId === 'AREA_SATELLITE' ? 72.5182 : order.areaId === 'AREA_SGHIGHWAY' ? 72.5015 : 72.4925) 
            }}
          />
        </div>

        {/* 7-Stage Canonical Progress Stepper (SRS Section: Canonical Order Lifecycle) */}
        <div style={{ margin: '24px 0' }}>
          <div className="tracking-stepper-grid">
            {canonicalSteps.map((step) => {
              const stepIdx = statusKeys.indexOf(step.key);
              const isCompleted = currentStepIndex >= stepIdx && order.status !== 'CANCELLED';
              const isCurrent = order.status === step.key;

              return (
                <div
                  key={step.key}
                  className="tracking-stepper-step"
                  style={{
                    background: isCurrent ? 'var(--fresh-green-soft)' : 'var(--surface)',
                    border: `1.5px solid ${isCurrent ? 'var(--fresh-green)' : isCompleted ? 'rgba(31, 175, 110, 0.4)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '10px',
                    position: 'relative',
                    boxShadow: isCurrent ? '0 4px 12px rgba(31, 175, 110, 0.15)' : 'var(--shadow-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: isCompleted ? 'var(--fresh-green)' : 'var(--bg-elevated)',
                      color: isCompleted ? '#FFFFFF' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      {isCompleted ? '✓' : stepIdx + 1}
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: isCompleted ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {step.title}
                    </span>
                  </div>
                  <p style={{ fontSize: '10px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.3 }}>
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Status Timeline Trail */}
        {order.statusTimeline && order.statusTimeline.length > 0 && (
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              🕒 Live Status Log:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {order.statusTimeline.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--fresh-green)' }} />
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.status.replace(/_/g, ' ')}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>({item.time})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Operational Staff Partner Card (Picker & Rider Handshake) */}
        <div className="partner-handshake-grid">
          {/* Store Picker Handshake */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(142, 92, 247, 0.15)',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0
            }}>
              🏬
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>DarkStore Fulfillment Partner</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {order.picker?.name || 'Assigned Store Picker'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {order.storeName} • Quality Checked
              </div>
            </div>
          </div>

          {/* Delivery Rider Partner Handshake */}
          <div className="partner-rider-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            {order.rider ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'var(--gradient-brand)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    boxShadow: '0 2px 10px rgba(142, 92, 247, 0.3)',
                    flexShrink: 0
                  }}>
                    🚴
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{order.rider.name}</span>
                      <span className="badge-fresh" style={{ fontSize: '10px', padding: '1px 5px' }}>★ {order.rider.rating || '4.9'}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {order.rider.vehicle}
                    </div>
                  </div>
                </div>
                <button
                  className="btn-secondary"
                  onClick={() => alert(`Connecting secure call to rider ${order.rider.name} (${order.rider.phone})...`)}
                  style={{ fontSize: '11px', padding: '6px 12px', flexShrink: 0 }}
                >
                  <Icon name="phone" size={13} color="var(--fresh-green)" /> Call
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>⏳</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {order.status === 'READY_FOR_PICKUP' ? 'Awaiting Rider Handover' : 'Fulfilling at Store'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Rider will be assigned as soon as the dark store seals the bag.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Ordered Items Snapshot with Weight & Tolerance Verification */}
      <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '20px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Items in this Order ({order.items.length})
          </h3>
          <span style={{ fontSize: '11px', color: '#1FAF6E', fontWeight: 700 }}>
            🔒 Prices frozen at order confirmation
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {order.items.map(item => (
            <div
              key={`${item.id}-${item.variant}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'var(--surface)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>🥦</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>({item.variant})</span>
                  </div>
                  {item.actualWeight && (
                    <span style={{ fontSize: '11px', color: '#1FAF6E', fontWeight: 600 }}>
                      Actual Weighed: {item.actualWeight} {item.toleranceOk && '✓ (Within ±5% tolerance)'}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Qty: {item.quantity}</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹{item.price * item.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border)', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Total Paid ({order.paymentMethod}):</span>
          <span style={{ fontWeight: 800, color: 'var(--fresh-green)', fontSize: '16px' }}>₹{order.grandTotal}</span>
        </div>
      </div>

    </div>
  );
};
