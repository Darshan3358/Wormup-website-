import React, { useState, useEffect } from 'react';
import { useLocation } from '../../context/LocationContext';
import { useCart } from '../../context/CartContext';
import { useApp } from '../../context/AppContext';
import { useRouter, Link } from '../../navigation/RouterContext';
import { Icon } from './Icons';

const ROTATING_SEARCH_PLACEHOLDERS = [
  'Search "milk"',
  'Search "chips"',
  'Search "fresh palak"',
  'Search "potatoes"',
  'Search "tomatoes"',
  'Search "apples"',
  'Search "paneer"',
  'Search "onions"'
];

export const Navbar = ({ searchQuery, setSearchQuery }) => {
  const { selectedArea, selectedAddress, setIsLocationModalOpen } = useLocation();
  const { itemCount, subtotal, setIsCartOpen } = useCart();
  const { userProfile, setCustomerView } = useApp();
  const { currentPath, navigate } = useRouter();

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  // Real-time rotating search placeholder effect (every 2.5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % ROTATING_SEARCH_PLACEHOLDERS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const isStoreView = currentPath === '/' || currentPath === '/store';

  // Format the display address for the 2nd line like in Blinkit screenshot
  const displayAddress = selectedAddress?.shortLine 
    ? selectedAddress.shortLine 
    : (selectedAddress?.line 
        ? (selectedAddress.line.length > 32 ? selectedAddress.line.slice(0, 32) + '...' : selectedAddress.line)
        : `${selectedArea?.name || 'Tragad'}, ${selectedArea?.city || 'Ahmedabad'}`);

  return (
    <header className="glass-nav" style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 100, 
      borderBottom: '1px solid #ECEAF2', 
      background: 'linear-gradient(180deg, #FFFFFF 0%, #FDF6FB 100%)' 
    }}>
      <div className="container navbar-container">
        
        {/* Brand & Location Section */}
        <div className="navbar-brand-section">
          {/* Brand Logo */}
          <Link 
            to="/"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textDecoration: 'none', flexShrink: 0 }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
            }}>
              <img 
                src="/womup-logo.png" 
                alt="WOMUP Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontWeight: 900, fontSize: '18px', letterSpacing: '-0.5px', color: '#12101B' }}>WOMUP</span>
                <span style={{ background: 'var(--gradient-brand)', color: '#FFFFFF', fontSize: '8px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', letterSpacing: '0.4px' }}>EXPRESS</span>
              </div>
              <span className="hide-on-mobile" style={{ fontSize: '9px', color: 'var(--text-secondary)', letterSpacing: '0.3px', fontWeight: 600 }}>FRESH VEGGIES & FRUITS</span>
            </div>
          </Link>

          {/* Delivery Location Selector with Brand Gradient Border */}
          <button 
            onClick={() => setIsLocationModalOpen(true)}
            className="navbar-location-btn"
            title="Click to Change Location"
          >
            {/* Top Line: Bold delivery time */}
            <div style={{ 
              fontSize: '11px', 
              fontWeight: 800, 
              color: '#12101B', 
              letterSpacing: '-0.2px', 
              lineHeight: 1.2,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              width: '100%',
              overflow: 'hidden'
            }}>
              <span style={{
                background: 'var(--gradient-brand)',
                color: '#FFFFFF',
                fontSize: '8px',
                fontWeight: 800,
                padding: '1px 4px',
                borderRadius: '3px',
                flexShrink: 0
              }}>
                {selectedArea?.eta || '8 MINS'}
              </span>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Delivery in {selectedArea?.eta || '8m'}
              </span>
            </div>

            {/* Bottom Line: Address preview */}
            <div style={{ 
              fontSize: '10px', 
              color: '#6B6878', 
              fontWeight: 500,
              display: 'flex', 
              alignItems: 'center', 
              gap: '3px',
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: 1.2,
              marginTop: '1px'
            }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayAddress}
              </span>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#12101B" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                <path d="M3 4.5L6 7.5L9 4.5" />
              </svg>
            </div>
          </button>
        </div>

        {/* Search Bar: Middle on Desktop, Full Row on Mobile */}
        {isStoreView && (
          <div className="navbar-search-container">
            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6B6878' }}>
              <Icon name="search" size={16} />
            </div>
            <input 
              type="text"
              placeholder={ROTATING_SEARCH_PLACEHOLDERS[placeholderIndex]}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '42px',
                padding: '0 36px 0 42px',
                borderRadius: '10px',
                background: '#F8F9FA',
                border: '1px solid #E9ECEF',
                color: '#12101B',
                fontSize: '13px',
                fontWeight: 500,
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.background = '#FFFFFF';
                e.target.style.borderColor = 'var(--fresh-green)';
                e.target.style.boxShadow = '0 0 0 3px rgba(31, 175, 110, 0.12)';
              }}
              onBlur={(e) => {
                e.target.style.background = '#F8F9FA';
                e.target.style.borderColor = '#E9ECEF';
                e.target.style.boxShadow = 'none';
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6B6878', cursor: 'pointer', padding: '4px' }}
                aria-label="Clear search"
              >
                <Icon name="x" size={14} />
              </button>
            )}
          </div>
        )}

        {/* Right Section: Account Dropdown & Cart */}
        <div className="navbar-actions">
          {/* Account Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsAccountMenuOpen(prev => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'transparent',
                border: 'none',
                padding: '6px 8px',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#12101B',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'background 0.2s'
              }}
              aria-label="Account Menu"
            >
              <span style={{ fontSize: '15px' }}>👤</span>
              <span className="hide-on-mobile">Account</span>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#12101B" strokeWidth="2" strokeLinecap="round">
                <path d="M3 4.5L6 7.5L9 4.5" />
              </svg>
            </button>

            {isAccountMenuOpen && (
              <div 
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '240px',
                  maxWidth: 'calc(100vw - 32px)',
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  border: '1px solid #ECEAF2',
                  padding: '12px',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
                onMouseLeave={() => setIsAccountMenuOpen(false)}
              >
                <div style={{ padding: '8px 10px', borderBottom: '1px solid #F0EFF5', marginBottom: '4px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#12101B' }}>{userProfile.name}</div>
                  <div style={{ fontSize: '11px', color: '#6B6878' }}>{userProfile.phone}</div>
                </div>

                <button
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    setIsLocationModalOpen(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'transparent',
                    color: '#12101B',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Icon name="mapPin" size={14} color="var(--fresh-green)" />
                  <span>Delivery Address</span>
                </button>

                <button
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    navigate('/orders');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'transparent',
                    color: '#12101B',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Icon name="package" size={14} color="var(--womup-violet)" />
                  <span>My Orders & Live Tracking</span>
                </button>

                <button
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    navigate('/admin');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'transparent',
                    color: '#6B6878',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderTop: '1px solid #F0EFF5',
                    marginTop: '4px',
                    paddingTop: '8px'
                  }}
                >
                  <span>⚙️</span>
                  <span>Staff Portal (Admin / Ops)</span>
                </button>
              </div>
            )}
          </div>

          {/* Blinkit Style "My Cart" Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#0c831f', // Blinkit authentic green
              border: 'none',
              color: '#FFFFFF',
              padding: itemCount > 0 ? '6px 12px' : '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 700,
              boxShadow: '0 3px 10px rgba(12, 131, 31, 0.25)',
              transition: 'transform 0.15s, background 0.2s',
              flexShrink: 0
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            {itemCount > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
                <span style={{ fontSize: '10px', fontWeight: 600, opacity: 0.9 }}>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
                <span style={{ fontSize: '13px', fontWeight: 800 }}>₹{subtotal}</span>
              </div>
            ) : (
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Cart</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
