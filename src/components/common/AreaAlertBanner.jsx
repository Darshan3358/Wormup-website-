import React from 'react';
import { useCart } from '../../context/CartContext';
import { Icon } from './Icons';

export const AreaAlertBanner = () => {
  const { areaChangeAlert, dismissAreaAlert, setIsCartOpen } = useCart();

  if (!areaChangeAlert) return null;

  return (
    <div style={{
      background: 'var(--surface-secondary)',
      borderBottom: '1px solid var(--border-cyan)',
      padding: '12px 20px',
      position: 'relative',
      zIndex: 90
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: 'var(--warning)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon name="alertTriangle" size={16} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
              Area Changed
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Prices and product availability have been updated for your selected area.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {
              setIsCartOpen(true);
              dismissAreaAlert();
            }}
            className="btn-primary"
            style={{
              padding: '6px 14px',
              fontSize: '12px'
            }}
          >
            View Updated Products
          </button>
          <button
            onClick={dismissAreaAlert}
            style={{
              background: 'transparent',
              color: 'var(--text-secondary)',
              padding: '4px'
            }}
          >
            <Icon name="x" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
