import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminDashboard } from './AdminDashboard';
import { AreaPriceManager } from './AreaPriceManager';
import { ScheduledEmailCampaigns } from './ScheduledEmailCampaigns';
import { Icon } from '../common/Icons';

export const AdminPanel = () => {
  const { adminTab, setAdminTab } = useApp();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 0 60px 0' }}>
      
      {/* Admin Title & Sub-tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            ⚙️
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF' }}>Womup Admin Console</h1>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Quick-Commerce Operations & Pricing Control</span>
          </div>
        </div>

        {/* Sub tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-surface)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          {[
            { id: 'dashboard', label: 'Dashboard & KPI', icon: 'barChart' },
            { id: 'area-prices', label: 'Area-Wise Prices', icon: 'tag' },
            { id: 'email-campaigns', label: 'Scheduled Emails', icon: 'mail' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                background: adminTab === tab.id ? 'var(--accent-primary)' : 'transparent',
                color: adminTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              <Icon name={tab.icon} size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Render selected view */}
      {adminTab === 'dashboard' && <AdminDashboard onNavigateTab={setAdminTab} />}
      {adminTab === 'area-prices' && <AreaPriceManager />}
      {adminTab === 'email-campaigns' && <ScheduledEmailCampaigns />}

    </div>
  );
};
