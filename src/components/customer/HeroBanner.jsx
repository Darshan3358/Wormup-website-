import React from 'react';
import { useLocation } from '../../context/LocationContext';
import { Icon } from '../common/Icons';

export const HeroBanner = () => {
  const { selectedArea, setIsLocationModalOpen } = useLocation();

  const handleShopNow = () => {
    const el = document.getElementById('catalog-products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ paddingTop: '12px' }}>
      {/* Wide Panoramic Hero Banner with Fluid Mobile Layout */}
      <div className="hero-banner-container">
        {/* Subtle Ambient Lighting */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '20%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(142, 92, 247, 0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />

        {/* Left Headline & Content */}
        <div className="hero-banner-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span className="badge-eta" style={{ background: 'rgba(31, 175, 110, 0.2)', border: '1px solid var(--fresh-green)', color: '#6EE7B7' }}>
              <Icon name="clock" size={12} /> Delivery in {selectedArea?.eta || '10 mins'} 🟢
            </span>
            <span 
              onClick={() => setIsLocationModalOpen(true)}
              style={{ fontSize: '12px', color: 'var(--womup-pink)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 700 }}
            >
              in {selectedArea?.name}
            </span>
          </div>

          <h1 className="hero-banner-title">
            Stock up on fresh farm produce
          </h1>

          <p style={{ fontSize: '14px', color: '#E5E7EB', lineHeight: 1.4, marginBottom: '18px', maxWidth: '520px' }}>
            Get farm-fresh goodness & a range of handpicked vegetables, crisp leafy greens, exotic fruits & more
          </p>

          <button
            onClick={handleShopNow}
            style={{
              background: 'var(--gradient-brand)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '13px',
              padding: '10px 24px',
              borderRadius: '10px',
              boxShadow: '0 4px 18px rgba(232, 67, 147, 0.45)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s var(--ease-brand)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(142, 92, 247, 0.55)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 18px rgba(232, 67, 147, 0.45)';
            }}
          >
            <span>Shop Now</span>
            <Icon name="chevronRight" size={14} />
          </button>
        </div>

        {/* Right Side Visual with Fresh Produce & Womup Badge */}
        <div className="hero-banner-image-box">
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <img
              src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&auto=format&fit=crop&q=80"
              alt="Farm Fresh Veggies"
              className="hero-banner-main-img"
              style={{
                width: '100%',
                maxHeight: '210px',
                borderRadius: '16px',
                objectFit: 'cover',
                boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'block'
              }}
            />

            {/* Floating DarkStore Badge */}
            <div className="hero-darkstore-badge">
              <img
                src="/womup-logo.png"
                alt="WOMUP"
                className="hero-darkstore-logo"
              />
              <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ 
                  fontSize: '11px', 
                  fontWeight: 800, 
                  color: '#FFFFFF', 
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.2px',
                  lineHeight: 1.2
                }}>
                  {selectedArea?.storeName || 'Satellite Hub Store'}
                </div>
                <div style={{ 
                  fontSize: '9px', 
                  color: '#34D399', 
                  fontWeight: 700, 
                  whiteSpace: 'nowrap',
                  marginTop: '2px',
                  lineHeight: 1.2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}>
                  <span>✓</span>
                  <span>100% Quality Inspected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
