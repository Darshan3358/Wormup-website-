import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../../navigation/RouterContext';
import { AdminDashboard } from '../../components/admin/AdminDashboard';
import { AreaPriceManager } from '../../components/admin/AreaPriceManager';
import { ScheduledEmailCampaigns } from '../../components/admin/ScheduledEmailCampaigns';
import { UserManager } from '../../components/admin/UserManager';
import { AdminInventoryManager } from '../../components/admin/AdminInventoryManager';
import { AdminOrderManager } from '../../components/admin/AdminOrderManager';
import { StaffManager } from '../../components/admin/StaffManager';
import { Icon } from '../../components/common/Icons';

export const AdminPortal = () => {
  const { currentPath, navigate } = useRouter();

  // Determine active tab from URL: /admin, /admin/users, /admin/prices, /admin/inventory, /admin/orders, /admin/staff, /admin/emails
  const [activeTab, setActiveTab] = useState(() => {
    if (currentPath.includes('/users')) return 'users';
    if (currentPath.includes('/prices')) return 'area-prices';
    if (currentPath.includes('/inventory')) return 'inventory';
    if (currentPath.includes('/orders')) return 'orders';
    if (currentPath.includes('/staff')) return 'staff';
    if (currentPath.includes('/emails')) return 'email-campaigns';
    return 'dashboard';
  });

  useEffect(() => {
    if (currentPath.includes('/users')) setActiveTab('users');
    else if (currentPath.includes('/prices')) setActiveTab('area-prices');
    else if (currentPath.includes('/inventory')) setActiveTab('inventory');
    else if (currentPath.includes('/orders')) setActiveTab('orders');
    else if (currentPath.includes('/staff')) setActiveTab('staff');
    else if (currentPath.includes('/emails')) setActiveTab('email-campaigns');
    else setActiveTab('dashboard');
  }, [currentPath]);

  const handleTabClick = (tabId, path) => {
    setActiveTab(tabId);
    navigate(path);
  };

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin', icon: 'barChart' },
    { id: 'users', label: 'Users', path: '/admin/users', icon: 'users' },
    { id: 'area-prices', label: 'Area Prices', path: '/admin/prices', icon: 'tag' },
    { id: 'inventory', label: 'Inventory', path: '/admin/inventory', icon: 'boxes' },
    { id: 'orders', label: 'Orders & Lifecycle', path: '/admin/orders', icon: 'package' },
    { id: 'staff', label: 'Pickers & Riders', path: '/admin/staff', icon: 'bike' },
    { id: 'email-campaigns', label: 'Campaigns', path: '/admin/emails', icon: 'mail' }
  ];

  return (
    <div className="admin-portal animate-fade-up" style={{ 
      maxWidth: '1280px', 
      margin: '0 auto', 
      padding: '24px 16px 60px 16px',
      color: '#F5F4F8'
    }}>
      {/* Admin Title & Sub-routes */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1.5px solid rgba(142, 92, 247, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3px',
            boxShadow: '0 4px 16px rgba(142, 92, 247, 0.4)',
            flexShrink: 0
          }}>
            <img src="/womup-logo.png" alt="Womup Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.3px', margin: 0 }}>
                Womup Admin Console
              </h1>
              <span style={{ 
                background: 'rgba(142, 92, 247, 0.25)', 
                color: '#C084FC',
                border: '1px solid rgba(142, 92, 247, 0.4)',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '6px',
                fontFamily: 'monospace'
              }}>
                Role: Business Admin (Full Access)
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#9C97AE', fontWeight: 500, margin: '2px 0 0 0' }}>
              Multi-Role Quick-Commerce Operations & Dark Store Command Center
            </p>
          </div>
        </div>

        {/* Separate Sub-Route Links with Swipeable Admin Rail */}
        <div className="admin-tabs-rail">
          {navTabs.map(tab => {
            const isSelected = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                to={tab.path}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: isSelected ? 'var(--gradient-brand)' : 'transparent',
                  color: isSelected ? '#FFFFFF' : '#B8B3C8',
                  boxShadow: isSelected ? '0 4px 14px rgba(232, 67, 147, 0.4)' : 'none',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon name={tab.icon} size={14} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Render sub-views */}
      {activeTab === 'dashboard' && <AdminDashboard onNavigateTab={(tab) => handleTabClick(tab, `/admin/${tab.replace('area-', '')}`)} />}
      {activeTab === 'users' && <UserManager />}
      {activeTab === 'area-prices' && <AreaPriceManager />}
      {activeTab === 'inventory' && <AdminInventoryManager />}
      {activeTab === 'orders' && <AdminOrderManager />}
      {activeTab === 'staff' && <StaffManager />}
      {activeTab === 'email-campaigns' && <ScheduledEmailCampaigns />}
    </div>
  );
};

