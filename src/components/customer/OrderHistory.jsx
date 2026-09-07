import React from 'react';
import { useOrders, ORDER_STATUSES } from '../../context/OrderContext';
import { useCart } from '../../context/CartContext';
import { useRouter } from '../../navigation/RouterContext';
import { Icon } from '../common/Icons';

export const OrderHistory = () => {
  const { orders } = useOrders();
  const { addToCart, setIsCartOpen } = useCart();
  const { navigate } = useRouter();

  const handleReorder = (items) => {
    items.forEach(item => {
      // Re-add to cart
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        variant: item.variant,
        image: item.image
      });
    });
    setIsCartOpen(true);
  };

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', padding: '16px 8px 60px 8px' }}>
      
      {/* Header & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>My Orders</span>
          </div>
          <h1 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.5px' }}>
            My Orders & Delivery History
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Track active 10-minute deliveries and view past farm-fresh orders
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="btn-secondary"
          style={{ fontSize: '12px', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span>🥬</span> Continue Shopping
        </button>
      </div>

      {orders.length === 0 ? (
        /* Empty State */
        <div style={{
          background: 'var(--surface)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          padding: '50px 16px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '14px' }}>🧺</span>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            No Orders Placed Yet
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '420px', margin: '8px auto 20px auto' }}>
            Your basket is waiting for farm-fresh vegetables and fruits delivered in 10 minutes.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '10px 24px', fontSize: '13px' }}>
            Shop Fresh Market
          </button>
        </div>
      ) : (
        /* Orders List */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => {
            const statusMeta = ORDER_STATUSES[order.status] || { label: order.status, color: '#8E5CF7' };
            const isActive = !['DELIVERED', 'CANCELLED'].includes(order.status);
            const orderDate = order.createdAt 
              ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
              : 'Today, 10:14 AM';

            return (
              <div
                key={order.id}
                style={{
                  background: 'var(--surface)',
                  borderRadius: '14px',
                  border: isActive ? '1.5px solid var(--fresh-green)' : '1px solid var(--border)',
                  padding: '16px',
                  boxShadow: isActive ? '0 6px 20px rgba(31, 175, 110, 0.12)' : 'var(--shadow-subtle)',
                  transition: 'transform 0.15s, box-shadow 0.15s'
                }}
              >
                {/* Order Top Bar */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', paddingBottom: '14px', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                        Order #{order.orderNumber || order.id}
                      </span>
                      <span
                        style={{
                          background: isActive ? 'rgba(31, 175, 110, 0.12)' : 'var(--bg-elevated)',
                          color: isActive ? 'var(--fresh-green)' : 'var(--text-secondary)',
                          border: `1px solid ${isActive ? 'rgba(31, 175, 110, 0.3)' : 'var(--border)'}`,
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '20px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: statusMeta.color }} />
                        {statusMeta.label}
                      </span>
                      {isActive && (
                        <span className="badge-eta" style={{ fontSize: '10px', padding: '2px 7px' }}>
                          <Icon name="clock" size={11} /> {order.eta || '10 mins'}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Placed on {orderDate} • DarkStore: <strong>{order.storeName}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: 'var(--text-primary)' }}>
                      ₹{order.grandTotal}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • {order.paymentMethod}
                    </div>
                  </div>
                </div>

                {/* Items Preview */}
                <div style={{ padding: '12px 0', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'var(--bg-elevated)',
                        padding: '5px 10px',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        fontSize: '11px'
                      }}
                    >
                      <span>🥦</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>({item.variant})</span>
                      <span style={{ color: 'var(--fresh-green)', fontWeight: 700 }}>x{item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span>📍</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Delivered to: <strong>{order.address?.line || order.areaName}</strong></span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', width: '100%', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleReorder(order.items)}
                      style={{
                        background: 'transparent',
                        border: '1.5px solid var(--border)',
                        borderRadius: '8px',
                        padding: '7px 12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      Reorder Items
                    </button>

                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      style={{
                        background: isActive ? 'var(--gradient-brand)' : 'var(--bg-elevated)',
                        border: isActive ? 'none' : '1px solid var(--border)',
                        color: isActive ? '#FFFFFF' : 'var(--text-primary)',
                        borderRadius: '8px',
                        padding: '7px 16px',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: isActive ? '0 3px 10px rgba(232, 67, 147, 0.3)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>{isActive ? '⚡ Track Live Delivery' : 'Order Details'}</span>
                      <span>➔</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default OrderHistory;
