import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useLocation } from '../../context/LocationContext';
import { COUPONS } from '../../data/mockData';
import { Icon } from '../common/Icons';

export const CartDrawer = ({ onProceedCheckout }) => {
  const {
    items,
    itemCount,
    subtotal,
    itemSavings,
    deliveryFee,
    handlingFee,
    coupon,
    couponDiscount,
    couponError,
    grandTotal,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { selectedArea } = useLocation();
  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const success = applyCoupon(couponInput);
    if (success) setCouponInput('');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 7, 13, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 200,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div 
        className="glass-panel cart-drawer-panel"
      >
        {/* Drawer Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--surface)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/womup-logo.png" alt="WOMUP" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>My Cart</h2>
                <span className="badge-tag">({itemCount} items)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                <Icon name="mapPin" size={12} color="var(--fresh-green)" />
                <span>Delivering to <strong>{selectedArea.name}</strong> • {selectedArea.eta}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                style={{ background: 'none', color: 'var(--text-muted)', fontSize: '12px', padding: '4px' }}
                title="Clear Cart"
              >
                <Icon name="trash" size={15} />
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
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
        </div>

        {/* Drawer Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <span style={{ fontSize: '54px', display: 'block', marginBottom: '16px' }}>🥦</span>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Your cart is empty
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Explore freshly picked veggies and fruits from your local dark store.
              </p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="btn-primary"
                style={{ fontSize: '13px' }}
              >
                Browse Vegetables
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Delivery ETA pill */}
              <div style={{
                background: 'rgba(74, 99, 240, 0.08)',
                border: '1px solid rgba(74, 99, 240, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '12px',
                color: 'var(--womup-blue)'
              }}>
                <Icon name="bike" size={18} />
                <div>
                  <strong>Delivery in {selectedArea.eta}</strong> from {selectedArea.storeName}
                </div>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {items.map(item => (
                  <div
                    key={`${item.id}-${item.variant}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--surface)',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 12px',
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {item.variant} • ₹{item.price}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Quantity Stepper */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        color: 'var(--fresh-green)',
                        fontWeight: 800
                      }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.variant, -1)}
                          style={{ background: 'none', color: 'var(--fresh-green)', padding: '4px 6px' }}
                        >
                          <Icon name="minus" size={12} />
                        </button>
                        <span style={{ fontSize: '12px', minWidth: '16px', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 700 }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.variant, 1)}
                          style={{ background: 'none', color: 'var(--fresh-green)', padding: '4px 6px' }}
                        >
                          <Icon name="plus" size={12} />
                        </button>
                      </div>

                      <div style={{ fontSize: '13px', fontWeight: 800, minWidth: '45px', textAlign: 'right', color: 'var(--text-primary)' }}>
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupons Section */}
              <div style={{
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
                  <Icon name="tag" size={14} color="var(--womup-violet)" />
                  <span>Avail Coupons & Offers</span>
                </div>

                {coupon ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--fresh-green-soft)',
                    border: '1px solid var(--fresh-green)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    <div>
                      <span style={{ fontWeight: 800, color: 'var(--fresh-green)', fontSize: '12px' }}>
                        {coupon.code} Applied
                      </span>
                      <p style={{ fontSize: '11px', color: 'var(--text-primary)' }}>You saved ₹{couponDiscount}</p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      style={{ background: 'none', color: 'var(--error-red)', fontSize: '11px', fontWeight: 700 }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <button type="submit" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                        Apply
                      </button>
                    </form>
                    {couponError && (
                      <div style={{ fontSize: '11px', color: 'var(--error-red)', marginBottom: '8px' }}>
                        {couponError}
                      </div>
                    )}
                    {/* Quick suggestion pills */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {COUPONS.map(c => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => applyCoupon(c.code)}
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: 'rgba(142, 92, 247, 0.1)',
                            border: '1px dashed var(--womup-violet)',
                            color: 'var(--womup-violet)'
                          }}
                        >
                          {c.code}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Bill Summary */}
              <div style={{
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
                  Bill Details
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Items Subtotal</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{subtotal}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Handling Charge</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{handlingFee}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Delivery Fee ({selectedArea.name})</span>
                      {subtotal > 299 && <span className="badge-fresh" style={{ fontSize: '9px', padding: '1px 4px' }}>FREE</span>}
                    </div>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {deliveryFee === 0 ? <span style={{ color: 'var(--fresh-green)', fontWeight: 700 }}>FREE</span> : `₹${deliveryFee}`}
                    </span>
                  </div>

                  {couponDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--fresh-green)' }}>
                      <span>Coupon Discount ({coupon.code})</span>
                      <span style={{ fontWeight: 700 }}>-₹{couponDiscount}</span>
                    </div>
                  )}

                  {itemSavings > 0 && (
                    <div style={{
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--fresh-green-soft)',
                      color: 'var(--fresh-green)',
                      fontSize: '11px',
                      fontWeight: 700,
                      marginTop: '4px'
                    }}>
                      🎉 You saved ₹{itemSavings + couponDiscount} on MRP in this order!
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '10px',
                    marginTop: '6px',
                    borderTop: '1px solid var(--border)',
                    fontSize: '14px',
                    fontWeight: 800,
                    color: 'var(--text-primary)'
                  }}>
                    <span>To Pay</span>
                    <span style={{ fontSize: '16px', color: 'var(--fresh-green)', fontWeight: 800 }}>₹{grandTotal}</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Drawer Bottom CTA */}
        {items.length > 0 && (
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--border)',
            background: 'var(--surface)'
          }}>
            <button
              onClick={() => {
                setIsCartOpen(false);
                onProceedCheckout();
              }}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '14px',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '11px', opacity: 0.85, display: 'block' }}>TOTAL AMOUNT</span>
                <span style={{ fontSize: '16px', fontWeight: 800 }}>₹{grandTotal}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}>
                <span>Select Address & Pay</span>
                <Icon name="chevronRight" size={16} />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
