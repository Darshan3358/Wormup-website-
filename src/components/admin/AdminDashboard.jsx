import React from 'react';
import { useOrders } from '../../context/OrderContext';
import { useLocation } from '../../context/LocationContext';
import { Icon } from '../common/Icons';

export const AdminDashboard = ({ onNavigateTab }) => {
  const { orders } = useOrders();
  const { areas } = useLocation();

  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 125420);
  const totalOrdersCount = orders.length + 342;
  const totalCustomers = 4281;

  const areaPerformance = [
    { area: 'Bopal Central', revenue: '₹32,400', growth: '↑ 12%', orders: 112, status: 'Active' },
    { area: 'Satellite Hub', revenue: '₹28,500', growth: '↑ 8%', orders: 98, status: 'Active' },
    { area: 'Vastrapur Lake', revenue: '₹19,200', growth: '↑ 15%', orders: 74, status: 'Active' },
    { area: 'SG Highway', revenue: '₹24,800', growth: '↑ 10%', orders: 86, status: 'Active' },
    { area: 'Maninagar East', revenue: '₹20,520', growth: '↑ 7%', orders: 72, status: 'Active' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Metrics Row (#1C1930 Dark Card with Gradient Icons & Bright White Numbers) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {[
          { label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, change: '+14% this week', icon: 'barChart', changeColor: '#10B981' },
          { label: "Orders", value: totalOrdersCount, change: '+18% today', icon: 'package', changeColor: '#10B981' },
          { label: "Customers", value: totalCustomers.toLocaleString(), change: '+320 new this month', icon: 'users', changeColor: '#C084FC' },
          { label: "Active Fleet", value: '34 Online', change: 'Avg ETA: 10.4 mins', icon: 'bike', changeColor: '#F5A524' }
        ].map(card => (
          <div
            key={card.label}
            style={{
              padding: '22px',
              position: 'relative',
              background: '#1C1930',
              border: '1px solid #2E2949',
              borderRadius: '16px',
              boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#9C97AE', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  {card.label}
                </span>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: '4px 0 2px 0', letterSpacing: '-0.5px' }}>
                  {card.value}
                </div>
                <span style={{ fontSize: '11px', color: card.changeColor, fontWeight: 700 }}>
                  {card.change}
                </span>
              </div>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'var(--gradient-brand)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(232, 67, 147, 0.35)',
                flexShrink: 0
              }}>
                <Icon name={card.icon} size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Area Performance Section from User Specification */}
      <div style={{ 
        padding: '24px', 
        background: '#1C1930', 
        border: '1px solid #2E2949', 
        borderRadius: '16px', 
        boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF' }}>Area Performance</h3>
            <span style={{ fontSize: '12px', color: '#9C97AE' }}>Revenue & volume distribution by Ahmedabad dark store zones</span>
          </div>
          <button 
            onClick={() => onNavigateTab('area-prices')}
            style={{ 
              fontSize: '12px', 
              fontWeight: 700,
              padding: '8px 18px', 
              borderRadius: '9999px',
              background: '#FFFFFF',
              color: '#14121F',
              border: 'none',
              boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
              cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.25)';
            }}
          >
            Manage Area Prices →
          </button>
        </div>

        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ color: '#9C97AE', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #2E2949', background: '#25213F' }}>
                <th style={{ padding: '12px 16px', borderRadius: '8px 0 0 8px' }}>Zone / DarkStore</th>
                <th style={{ padding: '12px 16px' }}>Revenue Today</th>
                <th style={{ padding: '12px 16px' }}>Orders</th>
                <th style={{ padding: '12px 16px' }}>Growth</th>
                <th style={{ padding: '12px 16px', borderRadius: '0 8px 8px 0' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {areaPerformance.map(p => (
                <tr key={p.area} style={{ borderBottom: '1px solid #2E2949' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon name="mapPin" size={14} color="#8E5CF7" />
                    <span>{p.area}</span>
                  </td>
                  {/* Violet/Blue Accent for Scannable Revenue */}
                  <td style={{ padding: '14px 16px', fontWeight: 800, color: '#C084FC', fontSize: '14px', letterSpacing: '-0.2px' }}>
                    {p.revenue}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#B8B3C8' }}>{p.orders} delivered</td>
                  <td style={{ padding: '14px 16px', color: '#10B981', fontWeight: 700 }}>{p.growth}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 700, 
                      padding: '3px 10px', 
                      borderRadius: '9999px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10B981',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Launchpad to USP Modules */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <div
          onClick={() => onNavigateTab('area-prices')}
          style={{
            padding: '24px',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #1C1930 0%, rgba(142, 92, 247, 0.15) 100%)',
            border: '1px solid #2E2949',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#8E5CF7';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#2E2949';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              🎯
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF' }}>Area Dynamic Pricing Matrix</h3>
          </div>
          <p style={{ fontSize: '13px', color: '#B8B3C8', lineHeight: 1.5, marginBottom: '14px' }}>
            Configure distinct selling prices, margins and dark store stock levels across Tragad, Bopal, Satellite, and SG Highway.
          </p>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#C084FC', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            Open Price Matrix <Icon name="chevronRight" size={14} />
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('email-campaigns')}
          style={{
            padding: '24px',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #1C1930 0%, rgba(232, 67, 147, 0.15) 100%)',
            border: '1px solid #2E2949',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#E84393';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#2E2949';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              📬
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF' }}>Scheduled Email Campaigns</h3>
          </div>
          <p style={{ fontSize: '13px', color: '#B8B3C8', lineHeight: 1.5, marginBottom: '14px' }}>
            Schedule marketing notifications and morning harvest alerts by date and time with BullMQ queue dispatch.
          </p>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#FF6FA5', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            Open Email Scheduler <Icon name="chevronRight" size={14} />
          </span>
        </div>
      </div>

      {/* Live Operational Orders Table */}
      <div style={{ 
        padding: '24px', 
        background: '#1C1930', 
        border: '1px solid #2E2949', 
        borderRadius: '16px', 
        boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3)' 
      }}>
        <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px' }}>
          Live Orders ({orders.length})
        </h3>
        {orders.length === 0 ? (
          <p style={{ color: '#9C97AE', fontSize: '13px' }}>
            No live customer orders placed in this session yet. Place an order from the customer storefront!
          </p>
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ color: '#9C97AE', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #2E2949', background: '#25213F' }}>
                  <th style={{ padding: '12px 14px', borderRadius: '8px 0 0 8px' }}>Order #</th>
                  <th style={{ padding: '12px 14px' }}>Area & Store</th>
                  <th style={{ padding: '12px 14px' }}>Items</th>
                  <th style={{ padding: '12px 14px' }}>Total</th>
                  <th style={{ padding: '12px 14px' }}>OTP</th>
                  <th style={{ padding: '12px 14px', borderRadius: '0 8px 8px 0' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #2E2949' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#FFFFFF' }}>#{o.orderNumber}</td>
                    <td style={{ padding: '12px 14px', color: '#B8B3C8' }}>{o.area?.name || 'Tragad'} ({o.storeName})</td>
                    <td style={{ padding: '12px 14px', color: '#B8B3C8' }}>{o.items?.length || 0} items</td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#C084FC' }}>₹{o.grandTotal}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#10B981', background: 'rgba(16, 185, 129, 0.12)', padding: '2px 8px', borderRadius: '4px' }}>
                        {o.otp}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        padding: '3px 10px', 
                        borderRadius: '9999px',
                        background: 'rgba(142, 92, 247, 0.15)',
                        color: '#C084FC',
                        border: '1px solid rgba(142, 92, 247, 0.3)'
                      }}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
