import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useLocation } from '../../context/LocationContext';
import { useOrders } from '../../context/OrderContext';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icons';

export const CheckoutModal = ({ isOpen, onClose, onOrderPlaced }) => {
  const { items, subtotal, deliveryFee, handlingFee, couponDiscount, grandTotal, clearCart } = useCart();
  const { selectedArea } = useLocation();
  const { createOrder } = useOrders();
  const { userProfile } = useApp();

  const [selectedAddressId, setSelectedAddressId] = useState(userProfile.addresses[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentAddress = userProfile.addresses.find(a => a.id === selectedAddressId) || userProfile.addresses[0];

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const order = createOrder({
        items,
        area: selectedArea,
        address: currentAddress,
        paymentMethod,
        subtotal,
        deliveryFee,
        handlingFee,
        discount: couponDiscount,
        grandTotal,
        eta: selectedArea.eta
      });
      clearCart();
      setIsSubmitting(false);
      onClose();
      onOrderPlaced(order.id);
    }, 800);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 7, 13, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 210,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px'
    }}>
      <div 
        className="glass-panel checkout-modal-card"
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#FFFFFF',
              border: '1px solid var(--border)',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-subtle)'
            }}>
              <img src="/womup-logo.png" alt="WOMUP" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>Checkout & Delivery</h2>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                 Dispatching from <strong>{selectedArea.storeName}</strong> ({selectedArea.eta})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* 1. Address Section */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
            1. Select Delivery Address
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {userProfile.addresses.map(addr => {
              const isSelected = selectedAddressId === addr.id;
              return (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--fresh-green-soft)' : 'var(--surface)',
                    border: `1px solid ${isSelected ? 'var(--fresh-green)' : 'var(--border)'}`,
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', minWidth: 0 }}>
                    <div style={{ color: isSelected ? 'var(--fresh-green)' : 'var(--text-secondary)', marginTop: '2px', flexShrink: 0 }}>
                      <Icon name="mapPin" size={15} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{addr.label}</span>
                        {addr.isDefault && <span className="badge-fresh" style={{ fontSize: '8px', padding: '1px 4px' }}>Default</span>}
                      </div>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', wordBreak: 'break-word' }}>
                        {addr.line}, {addr.area} - {addr.pincode}
                      </p>
                    </div>
                  </div>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? 'var(--fresh-green)' : 'var(--border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--fresh-green)' }} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Payment Method */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
            2. Payment Method
          </div>
          <div className="checkout-payment-grid">
            {[
              { id: 'UPI', label: 'Instant UPI', desc: 'GPay/PhonePe', icon: '⚡' },
              { id: 'CARD', label: 'Card', desc: 'Debit/Credit', icon: '💳' },
              { id: 'COD', label: 'Cash', desc: 'Doorstep', icon: '💵' }
            ].map(m => {
              const isSelected = paymentMethod === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className="checkout-payment-card"
                  style={{
                    padding: '10px 8px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(142, 92, 247, 0.12)' : 'var(--surface)',
                    border: `1.5px solid ${isSelected ? 'var(--womup-violet)' : 'var(--border)'}`,
                    cursor: 'pointer',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-subtle)'
                  }}
                >
                  <span style={{ fontSize: '18px', display: 'block', marginBottom: '2px' }}>{m.icon}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>{m.label}</span>
                  <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>{m.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Order Items Summary */}
        <div style={{
          background: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          marginBottom: '20px',
          border: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>Order Items ({items.length})</span>
            <span style={{ fontSize: '12px', color: 'var(--fresh-green)', fontWeight: 700 }}>Area: {selectedArea.name}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {items.map(item => (
              <div
                key={`${item.id}-${item.variant}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--surface)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap',
                  fontSize: '11px',
                  border: '1px solid var(--border)'
                }}
              >
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.name}</span>
                <span style={{ color: 'var(--fresh-green)', fontWeight: 700 }}>x{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Place Order CTA */}
        <button
          onClick={handlePlaceOrder}
          disabled={isSubmitting}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            opacity: isSubmitting ? 0.7 : 1
          }}
        >
          <span>{isSubmitting ? 'Confirming with DarkStore...' : `Pay ₹${grandTotal} & Place Order`}</span>
          <span>{selectedArea.eta} Delivery</span>
        </button>
      </div>
    </div>
  );
};
