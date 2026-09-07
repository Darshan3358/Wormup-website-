import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icons';

export const StaffManager = () => {
  const { pickers, riders, toggleStaffStatus } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('pickers'); // 'pickers' | 'riders'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Bar */}
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
              Store Pickers & Delivery Riders Management
            </h2>
            <span style={{
              background: 'rgba(232, 67, 147, 0.2)',
              border: '1px solid rgba(232, 67, 147, 0.4)',
              color: '#FF6FA5',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              SRS Section 12, 19, 20 & 32
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#9C97AE', margin: '4px 0 0 0' }}>
            Manage in-store picking performance, fleet online availability, vehicle assignments, and daily payout metrics.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div style={{
          display: 'flex',
          background: '#151224',
          borderRadius: '10px',
          padding: '4px',
          border: '1px solid #2E2949'
        }}>
          <button
            onClick={() => setActiveSubTab('pickers')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              background: activeSubTab === 'pickers' ? 'var(--gradient-brand)' : 'transparent',
              color: activeSubTab === 'pickers' ? '#FFFFFF' : '#9C97AE',
              fontWeight: 800,
              fontSize: '12px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            📦 Store Pickers ({pickers.length})
          </button>
          <button
            onClick={() => setActiveSubTab('riders')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              background: activeSubTab === 'riders' ? 'var(--gradient-brand)' : 'transparent',
              color: activeSubTab === 'riders' ? '#FFFFFF' : '#9C97AE',
              fontWeight: 800,
              fontSize: '12px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            🚴 Delivery Fleet ({riders.length})
          </button>
        </div>
      </div>

      {/* 1. Pickers Table & Performance Metrics (SRS Section 12 & 19) */}
      {activeSubTab === 'pickers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Pickers KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#1C1930', border: '1px solid #2E2949', borderRadius: '14px', padding: '16px' }}>
              <span style={{ fontSize: '11px', color: '#9C97AE', fontWeight: 700, textTransform: 'uppercase' }}>Avg Pick Time</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#1FAF6E', marginTop: '4px' }}>4.4 min</div>
              <span style={{ fontSize: '11px', color: '#9C97AE' }}>Target: &lt; 5.0 mins</span>
            </div>
            <div style={{ background: '#1C1930', border: '1px solid #2E2949', borderRadius: '14px', padding: '16px' }}>
              <span style={{ fontSize: '11px', color: '#9C97AE', fontWeight: 700, textTransform: 'uppercase' }}>Fulfillment Accuracy</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#C084FC', marginTop: '4px' }}>98.5%</div>
              <span style={{ fontSize: '11px', color: '#9C97AE' }}>Weight & quality tolerance</span>
            </div>
            <div style={{ background: '#1C1930', border: '1px solid #2E2949', borderRadius: '14px', padding: '16px' }}>
              <span style={{ fontSize: '11px', color: '#9C97AE', fontWeight: 700, textTransform: 'uppercase' }}>Today Packed Orders</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>221</div>
              <span style={{ fontSize: '11px', color: '#1FAF6E' }}>Across 5 Dark Stores</span>
            </div>
          </div>

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
                  <th style={{ padding: '14px 18px' }}>Picker ID</th>
                  <th style={{ padding: '14px 18px' }}>Staff Name / Phone</th>
                  <th style={{ padding: '14px 18px' }}>Assigned Dark Store</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Orders Fulfilled</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Avg Pick Time</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Accuracy Rate</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pickers.map((p, idx) => (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: idx === pickers.length - 1 ? 'none' : '1px solid #2E2949',
                      background: idx % 2 === 0 ? '#1C1930' : '#19162B'
                    }}
                  >
                    <td style={{ padding: '14px 18px', fontFamily: 'monospace', fontWeight: 700, color: '#C084FC' }}>
                      {p.employeeCode}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{p.name}</div>
                      <div style={{ fontSize: '11px', color: '#9C97AE' }}>{p.phone} • {p.email}</div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '12px' }}>{p.storeName}</div>
                      <div style={{ fontSize: '10px', color: '#9C97AE', fontFamily: 'monospace' }}>{p.storeId}</div>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 700, color: '#FFFFFF' }}>
                      {p.ordersCompleted}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 800, color: '#1FAF6E' }}>
                      {p.avgPickTime}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 800, color: '#C084FC' }}>
                      {p.accuracy}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 800,
                        background: p.status === 'Active' ? 'rgba(31, 175, 110, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: p.status === 'Active' ? '#1FAF6E' : '#EF4444',
                        border: `1px solid ${p.status === 'Active' ? 'rgba(31, 175, 110, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                      }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <button
                        onClick={() => toggleStaffStatus('picker', p.id)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid #2E2949',
                          color: '#FFFFFF',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        {p.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Delivery Riders Table & Performance Metrics (SRS Section 20, 21 & 32) */}
      {activeSubTab === 'riders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Riders Fleet KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#1C1930', border: '1px solid #2E2949', borderRadius: '14px', padding: '16px' }}>
              <span style={{ fontSize: '11px', color: '#9C97AE', fontWeight: 700, textTransform: 'uppercase' }}>Fleet Online</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#1FAF6E', marginTop: '4px' }}>
                {riders.filter(r => r.onlineStatus === 'ONLINE' || r.onlineStatus === 'BUSY').length} / {riders.length} Active
              </div>
              <span style={{ fontSize: '11px', color: '#9C97AE' }}>GPS tracking enabled</span>
            </div>
            <div style={{ background: '#1C1930', border: '1px solid #2E2949', borderRadius: '14px', padding: '16px' }}>
              <span style={{ fontSize: '11px', color: '#9C97AE', fontWeight: 700, textTransform: 'uppercase' }}>Avg Delivery Time</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#38BDF8', marginTop: '4px' }}>11.0 min</div>
              <span style={{ fontSize: '11px', color: '#9C97AE' }}>Store-to-door transit</span>
            </div>
            <div style={{ background: '#1C1930', border: '1px solid #2E2949', borderRadius: '14px', padding: '16px' }}>
              <span style={{ fontSize: '11px', color: '#9C97AE', fontWeight: 700, textTransform: 'uppercase' }}>Fleet Avg Rating</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#F5A524', marginTop: '4px' }}>★ 4.87</div>
              <span style={{ fontSize: '11px', color: '#9C97AE' }}>From 1,380+ customer reviews</span>
            </div>
          </div>

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
                  <th style={{ padding: '14px 18px' }}>Rider Name / Contact</th>
                  <th style={{ padding: '14px 18px' }}>Vehicle Info</th>
                  <th style={{ padding: '14px 18px' }}>Assigned Dark Store</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center' }}>Online Availability</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Today's Deliveries</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Today's Payout</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center' }}>Rating</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {riders.map((r, idx) => (
                  <tr
                    key={r.id}
                    style={{
                      borderBottom: idx === riders.length - 1 ? 'none' : '1px solid #2E2949',
                      background: idx % 2 === 0 ? '#1C1930' : '#19162B'
                    }}
                  >
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{r.name}</div>
                      <div style={{ fontSize: '11px', color: '#9C97AE' }}>{r.phone}</div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '12px' }}>{r.vehicleType}</div>
                      <div style={{ fontSize: '10px', color: '#9C97AE', fontFamily: 'monospace' }}>{r.vehicleNumber}</div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '12px' }}>{r.assignedStore}</div>
                      <div style={{ fontSize: '10px', color: '#C084FC' }}>Zones: {r.serviceAreas.join(', ')}</div>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 800,
                        background: r.onlineStatus === 'ONLINE' ? 'rgba(31, 175, 110, 0.15)' : r.onlineStatus === 'BUSY' ? 'rgba(245, 165, 36, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: r.onlineStatus === 'ONLINE' ? '#1FAF6E' : r.onlineStatus === 'BUSY' ? '#F5A524' : '#EF4444',
                        border: `1px solid ${r.onlineStatus === 'ONLINE' ? 'rgba(31, 175, 110, 0.3)' : r.onlineStatus === 'BUSY' ? 'rgba(245, 165, 36, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                      }}>
                        {r.onlineStatus === 'ONLINE' ? '🟢 ONLINE' : r.onlineStatus === 'BUSY' ? '🟡 ON TRANSIT' : '🔴 OFFLINE'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 700, color: '#FFFFFF' }}>
                      {r.todayDeliveries} ({r.totalDeliveries} total)
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 800, color: '#1FAF6E' }}>
                      ₹{r.todayEarnings}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 800, color: '#F5A524' }}>
                      ★ {r.rating}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <button
                        onClick={() => toggleStaffStatus('rider', r.id)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid #2E2949',
                          color: '#FFFFFF',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        {r.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
