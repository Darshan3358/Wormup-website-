import React from 'react';
import { useRouter, Link } from './RouterContext';
import { Icon } from '../components/common/Icons';
import { useApp } from '../context/AppContext';

export const PortalHeader = () => {
  const { currentPath } = useRouter();
  const { showToast } = useApp();

  const portals = [
    { name: 'Admin Console', path: '/admin', alias: '/admin', icon: '⚙️', color: 'var(--womup-violet)', desc: 'Prices, Users, Orders, Stock' },
    { name: 'Picker Staff', path: '/picker', alias: '/picker', icon: '🏬', color: 'var(--warn-amber)', desc: 'DarkStore Order Packing' },
    { name: 'Delivery Rider', path: '/rider', alias: '/rider', icon: '🚴', color: 'var(--womup-blue)', desc: 'Active Runs & OTP' },
    { name: 'Storefront', path: '/', alias: '/store', icon: '🧺', color: 'var(--fresh-green)', desc: 'Exit to Customer Store' }
  ];

  const currentPortal = portals.find(p => 
    p.path === currentPath || 
    (p.path !== '/' && currentPath.startsWith(p.path)) ||
    (p.path === '/' && (currentPath === '/' || currentPath === '/store'))
  ) || portals[0];

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}${currentPath}`;
    navigator.clipboard?.writeText(fullUrl);
    showToast(`Copied portal link: ${fullUrl}`, 'success');
  };

  return (
    <div style={{
      background: 'var(--bg-dark)',
      borderBottom: '1px solid var(--border-dark)',
      padding: '6px 0',
      fontSize: '12px'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px'
      }}>
        {/* Left: Portals with distinct routes as swipeable rail on mobile */}
        <div className="portal-nav-rail">
          <img src="/womup-logo.png" alt="Womup" style={{ width: '18px', height: '18px', objectFit: 'contain', flexShrink: 0 }} />
          <span style={{ fontSize: '11px', color: 'var(--text-secondary-dark)', fontWeight: 700, textTransform: 'uppercase', marginRight: '2px', flexShrink: 0 }}>
            Portals:
          </span>
          {portals.map(portal => {
            const isMatch = portal.path === currentPath || 
              (portal.path !== '/' && currentPath.startsWith(portal.path)) ||
              (portal.path === '/' && (currentPath === '/' || currentPath === '/store'));

            return (
              <Link
                key={portal.path}
                to={portal.path}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '7px',
                  background: isMatch ? 'var(--gradient-brand)' : 'transparent',
                  border: isMatch ? '1px solid transparent' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isMatch ? '#FFFFFF' : '#B8B3C8',
                  fontWeight: isMatch ? 800 : 500,
                  boxShadow: isMatch ? '0 2px 10px rgba(232, 67, 147, 0.4)' : 'none',
                  transition: 'all 0.15s',
                  textDecoration: 'none',
                  flexShrink: 0,
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{portal.icon}</span>
                <span>{portal.name}</span>
                <span style={{ fontSize: '10px', color: isMatch ? '#FFFFFF' : '#8A84A0', fontFamily: 'monospace', opacity: isMatch ? 0.9 : 0.7 }}>
                  {portal.alias}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Right: Active URL indicator & Copy Link Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--surface-dark)',
            padding: '3px 10px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-dark)',
            fontSize: '11px',
            fontFamily: 'monospace',
            color: 'var(--fresh-green)',
            maxWidth: '180px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--fresh-green)', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentPath}</span>
          </div>

          <button
            onClick={handleCopyLink}
            className="btn-secondary"
            style={{ fontSize: '11px', padding: '3px 8px', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
            title="Copy current portal URL to clipboard"
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};
