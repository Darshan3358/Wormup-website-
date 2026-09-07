import React, { useState } from 'react';
import { useOrders, ORDER_STATUSES } from '../../context/OrderContext';
import { useLocation } from '../../context/LocationContext';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icons';

export const AdminOrderManager = () => {
  const { 
    orders, 
    startPicking, 
    startPacking, 
    markReady, 
    assignRider, 
    markOutForDelivery, 
    markDelivered, 
    cancelOrder 
  } = useOrders();
  const { areas } = useLocation();
  const { showToast } = useApp();

  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedArea, setSelectedArea] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const selectedOrder = selectedOrderId ? orders.find(o => o.id === selectedOrderId) : null;

  const filteredOrders = orders.filter(o => {
    const matchesStatus = selectedStatus === 'ALL' || o.status === selectedStatus;
    const matchesArea = selectedArea === 'ALL' || o.areaId === selectedArea;
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customerName && o.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.storeName && o.storeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.picker?.name && o.picker.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.rider?.name && o.rider.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesArea && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header card */}
      <div style={{
        background: '#1C1930',
        border: '1px solid #2E2949',
        borderRadius: '16px',
        padding: '22px 26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Live Order Management & Operations Lifecycle
            </h2>
            <span style={{
              background: 'rgba(142, 92, 247, 0.2)',
              border: '1px solid rgba(142, 92, 247, 0.4)',
              color: '#C084FC',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              {orders.length} Active DarkStore Orders
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#9C97AE', margin: '4px 0 0 0' }}>
            Monitor the unified 11-stage order lifecycle from confirmation to store picking, packing, rider assignment, and OTP delivery.
          </p>
        </div>

        {/* Quick Lifecycle Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['CONFIRMED', 'PICKING', 'PACKING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED'].map(st => {
            const count = orders.filter(o => o.status === st).length;
            const meta = ORDER_STATUSES[st] || {};
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(selectedStatus === st ? 'ALL' : st)}
                style={{
                  background: selectedStatus === st ? meta.color : '#151224',
                  color: selectedStatus === st ? '#FFFFFF' : '#9C97AE',
                  border: `1px solid ${selectedStatus === st ? meta.color : '#2E2949'}`,
                  borderRadius: '8px',
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {st.replace(/_/g, ' ')} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              placeholder="Search by Order #, Customer, Store, Picker, Rider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '8px',
                background: '#151224',
                border: '1.5px solid #2E2949',
                color: '#FFFFFF',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9C97AE' }}>
              <Icon name="search" size={15} />
            </div>
          </div>

          {/* Area Filter */}
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            style={{
              padding: '9px 12px',
              borderRadius: '8px',
              background: '#151224',
              border: '1.5px solid #2E2949',
              color: '#FFFFFF',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Dark Stores (Ahmedabad)</option>
            {areas.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.storeName})</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '9px 12px',
              borderRadius: '8px',
              background: '#151224',
              border: '1.5px solid #2E2949',
              color: '#FFFFFF',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Order Statuses</option>
            {Object.keys(ORDER_STATUSES).map(key => (
              <option key={key} value={key}>{ORDER_STATUSES[key].label}</option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: '12px', color: '#9C97AE' }}>
          Showing <strong>{filteredOrders.length}</strong> of {orders.length} orders
        </div>
      </div>

      {/* Orders Table (SRS Section 10) */}
      <div className="table-responsive" style={{
        background: '#1C1930',
        border: '1px solid #2E2949',
        borderRadius: '16px',
        overflowX: 'auto',
        boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#14121F', borderBottom: '1.5px solid #2E2949', color: '#9C97AE', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              <th style={{ padding: '14px 16px' }}>Order No.</th>
              <th style={{ padding: '14px 16px' }}>Customer</th>
              <th style={{ padding: '14px 16px' }}>DarkStore / Area</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '14px 16px', textAlign: 'center' }}>Payment</th>
              <th style={{ padding: '14px 16px', textAlign: 'center' }}>Current Status</th>
              <th style={{ padding: '14px 16px' }}>Staff Assigned</th>
              <th style={{ padding: '14px 16px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#9C97AE' }}>
                  No orders match the selected filters.
                </td>
              </tr>
            ) : (
              filteredOrders.map((o, idx) => {
                const statusMeta = ORDER_STATUSES[o.status] || { color: '#8E5CF7', label: o.status };
                return (
                  <tr
                    key={o.id}
                    style={{
                      borderBottom: idx === filteredOrders.length - 1 ? 'none' : '1px solid #2E2949',
                      background: idx % 2 === 0 ? '#1C1930' : '#19162B'
                    }}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontFamily: 'monospace', fontWeight: 800, color: '#C084FC', fontSize: '13px' }}>
                        #{o.id}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9C97AE' }}>
                        {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{o.customerName || 'Customer'}</div>
                      <div style={{ fontSize: '11px', color: '#9C97AE' }}>{o.customerPhone || '+91 9825X XXXXX'}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '12px' }}>{o.areaName}</div>
                      <div style={{ fontSize: '11px', color: '#9C97AE' }}>{o.storeName}</div>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: '#1FAF6E', fontSize: '14px' }}>
                        ₹{o.grandTotal}
                      </div>
                      <div style={{ fontSize: '10px', color: '#9C97AE' }}>
                        {o.items.length} item(s)
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 700,
                        background: 'rgba(31, 175, 110, 0.15)',
                        color: '#1FAF6E',
                        border: '1px solid rgba(31, 175, 110, 0.3)'
                      }}>
                        {o.paymentMethod || 'UPI'} • {o.paymentStatus || 'SUCCESS'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 800,
                        background: `${statusMeta.color}20`,
                        border: `1px solid ${statusMeta.color}50`,
                        color: statusMeta.color
                      }}>
                        {statusMeta.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '11px', color: '#9C97AE' }}>
                      <div>Picker: <strong style={{ color: '#FFFFFF' }}>{o.picker?.name || 'Unassigned'}</strong></div>
                      <div>Rider: <strong style={{ color: '#FFFFFF' }}>{o.rider?.name || 'Unassigned'}</strong></div>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => setSelectedOrderId(o.id)}
                        style={{
                          background: 'var(--gradient-brand)',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Inspect Order
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Detailed Order Modal / Drawer (SRS Section 11) */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10, 8, 20, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#1C1930',
            border: '1.5px solid #2E2949',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '660px',
            padding: '28px',
            color: '#FFFFFF',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#C084FC', fontFamily: 'monospace', fontWeight: 800 }}>
                  WOMUP QUICK-COMMERCE FULFILLMENT
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '2px 0 0 0' }}>
                  Order #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderId(null)}
                style={{ background: 'none', border: 'none', color: '#9C97AE', cursor: 'pointer' }}
              >
                <Icon name="x" size={22} />
              </button>
            </div>

            {/* Quick Summary Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '20px' }}>
              <div style={{ background: '#14121F', padding: '10px 12px', borderRadius: '8px', border: '1px solid #2E2949' }}>
                <span style={{ fontSize: '10px', color: '#9C97AE', textTransform: 'uppercase' }}>Customer</span>
                <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>{selectedOrder.customerName}</div>
              </div>
              <div style={{ background: '#14121F', padding: '10px 12px', borderRadius: '8px', border: '1px solid #2E2949' }}>
                <span style={{ fontSize: '10px', color: '#9C97AE', textTransform: 'uppercase' }}>Area & Store</span>
                <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>{selectedOrder.areaName}</div>
              </div>
              <div style={{ background: '#14121F', padding: '10px 12px', borderRadius: '8px', border: '1px solid #2E2949' }}>
                <span style={{ fontSize: '10px', color: '#9C97AE', textTransform: 'uppercase' }}>Status</span>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#C084FC', marginTop: '2px' }}>{selectedOrder.status}</div>
              </div>
              <div style={{ background: '#14121F', padding: '10px 12px', borderRadius: '8px', border: '1px solid #2E2949' }}>
                <span style={{ fontSize: '10px', color: '#9C97AE', textTransform: 'uppercase' }}>Delivery OTP</span>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#1FAF6E', fontFamily: 'monospace', marginTop: '2px' }}>{selectedOrder.otp || '4892'}</div>
              </div>
            </div>

            {/* Items Breakdown Table with Variants */}
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#9C97AE', textTransform: 'uppercase', marginBottom: '10px' }}>
              Basket Items & Picked Weights
            </h4>
            <div style={{ background: '#14121F', borderRadius: '10px', border: '1px solid #2E2949', padding: '12px 16px', marginBottom: '20px' }}>
              {selectedOrder.items.map((it, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: idx === selectedOrder.items.length - 1 ? 'none' : '1px solid #221F38',
                    fontSize: '13px'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{it.name}</span>
                    <span style={{ color: '#9C97AE', fontSize: '11px', marginLeft: '6px' }}>({it.variant})</span>
                    {it.actualWeight && (
                      <span style={{ marginLeft: '8px', fontSize: '10px', color: '#1FAF6E', background: 'rgba(31, 175, 110, 0.15)', padding: '1px 6px', borderRadius: '4px' }}>
                        Weighed: {it.actualWeight} ✓
                      </span>
                    )}
                  </div>
                  <div style={{ fontWeight: 800, color: '#FFFFFF' }}>
                    ₹{it.price * it.quantity}
                  </div>
                </div>
              ))}

              <div style={{ borderTop: '1px dashed #2E2949', marginTop: '10px', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#9C97AE' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal:</span>
                  <span style={{ color: '#FFFFFF' }}>₹{selectedOrder.subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Delivery Fee:</span>
                  <span style={{ color: '#FFFFFF' }}>₹{selectedOrder.deliveryFee}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#1FAF6E' }}>
                    <span>Discount:</span>
                    <span>-₹{selectedOrder.discount}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 800, color: '#FFFFFF', paddingTop: '6px', borderTop: '1px solid #2E2949' }}>
                  <span>Grand Total:</span>
                  <span style={{ color: '#1FAF6E' }}>₹{selectedOrder.grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Lifecycle Timeline (SRS Section 11) */}
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#9C97AE', textTransform: 'uppercase', marginBottom: '10px' }}>
              Status Lifecycle Timeline
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#14121F', borderRadius: '10px', border: '1px solid #2E2949', padding: '14px', marginBottom: '24px' }}>
              {selectedOrder.statusTimeline?.map((st, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1FAF6E' }} />
                  <span style={{ fontWeight: 700, color: '#FFFFFF', minWidth: '150px' }}>{st.status.replace(/_/g, ' ')}</span>
                  <span style={{ color: '#9C97AE' }}>{st.time}</span>
                </div>
              ))}
            </div>

            {/* Controlled Lifecycle Actions (SRS Section: State Machine Guarded Actions) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '16px',
              background: '#14121F',
              borderRadius: '12px',
              border: '1px solid #2E2949'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: '#9C97AE', fontWeight: 600 }}>Controlled Workflow Actions:</span>

                {selectedOrder.status === 'CONFIRMED' && (
                  <button
                    onClick={() => {
                      const res = startPicking(selectedOrder.id);
                      if (res.success) showToast(`Order #${selectedOrder.id} picking started!`, 'success');
                      else showToast(res.message, 'error');
                    }}
                    style={{
                      background: 'var(--gradient-brand)',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    ▶ Start Store Picking
                  </button>
                )}

                {selectedOrder.status === 'PICKING' && (
                  <button
                    onClick={() => {
                      const res = startPacking(selectedOrder.id);
                      if (res.success) showToast(`Order #${selectedOrder.id} moved to packing & QC!`, 'success');
                      else showToast(res.message, 'error');
                    }}
                    style={{
                      background: '#8E5CF7',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    ▶ Move to Quality & Packing
                  </button>
                )}

                {selectedOrder.status === 'PACKING' && (
                  <button
                    onClick={() => {
                      const sealCode = `BAG-${selectedOrder.id.slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;
                      const res = markReady(selectedOrder.id, sealCode);
                      if (res.success) showToast(`Order #${selectedOrder.id} sealed (${sealCode}) & ready!`, 'success');
                      else showToast(res.message, 'error');
                    }}
                    style={{
                      background: '#1FAF6E',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    ✓ Seal Bag & Mark READY_FOR_PICKUP
                  </button>
                )}

                {selectedOrder.status === 'READY_FOR_PICKUP' && (
                  <button
                    onClick={() => {
                      const res = assignRider(selectedOrder.id, {
                        id: 'RDR_01',
                        name: 'Rahul Sharma',
                        phone: '+91 98250 14892',
                        rating: '4.9',
                        vehicle: 'Ather 450X (GJ-01-ET-8492)'
                      });
                      if (res.success) showToast(`Assigned rider Rahul Sharma to Order #${selectedOrder.id}!`, 'success');
                      else showToast(res.message, 'error');
                    }}
                    style={{
                      background: '#06B6D4',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    🚴 Dispatch & Assign Rider
                  </button>
                )}

                {selectedOrder.status === 'RIDER_ASSIGNED' && (
                  <button
                    onClick={() => {
                      const res = markOutForDelivery(selectedOrder.id);
                      if (res.success) showToast(`Order #${selectedOrder.id} picked up & out for delivery!`, 'success');
                      else showToast(res.message, 'error');
                    }}
                    style={{
                      background: '#3B82F6',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    🚀 Confirm Store Pickup & Out for Delivery
                  </button>
                )}

                {selectedOrder.status === 'OUT_FOR_DELIVERY' && (
                  <button
                    onClick={() => {
                      const res = markDelivered(selectedOrder.id, selectedOrder.otp || '1234');
                      if (res.success) showToast(`Order #${selectedOrder.id} delivered via OTP verification!`, 'success');
                      else showToast(res.message, 'error');
                    }}
                    style={{
                      background: '#1FAF6E',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    ✓ Complete Delivery (OTP: {selectedOrder.otp})
                  </button>
                )}

                {!['DELIVERED', 'CANCELLED'].includes(selectedOrder.status) && (
                  <button
                    onClick={() => {
                      const reason = window.prompt('Enter cancellation audit reason:', 'Customer requested cancellation');
                      if (reason) {
                        const res = cancelOrder(selectedOrder.id, reason);
                        if (res.success) showToast(`Order #${selectedOrder.id} cancelled.`, 'info');
                        else showToast(res.message, 'error');
                      }
                    }}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#EF4444',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    ✕ Cancel Order
                  </button>
                )}

                {selectedOrder.status === 'DELIVERED' && (
                  <span style={{ color: '#10B981', fontWeight: 800, fontSize: '13px' }}>
                    ✓ Order Delivered & Fulfilled
                  </span>
                )}

                {selectedOrder.status === 'CANCELLED' && (
                  <span style={{ color: '#EF4444', fontWeight: 800, fontSize: '13px' }}>
                    ✕ Order Cancelled: {selectedOrder.cancellationReason || 'Admin cancelled'}
                  </span>
                )}
              </div>

              <button
                onClick={() => setSelectedOrderId(null)}
                style={{
                  background: '#2E2949',
                  color: '#FFFFFF',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '12px'
                }}
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
