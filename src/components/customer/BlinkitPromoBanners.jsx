import React from 'react';

export const BlinkitPromoBanners = ({ onSelectCategory }) => {
  const promoBanners = [
    {
      id: 'fresh-mandi',
      title: 'Morning Mandi Harvest!',
      subtitle: 'Picked fresh at 4 AM from local Gujarat farms',
      btnText: 'Order Fresh',
      bg: 'linear-gradient(135deg, rgba(31, 175, 110, 0.14) 0%, rgba(228, 248, 237, 0.9) 100%)',
      borderColor: 'rgba(31, 175, 110, 0.35)',
      btnBg: 'var(--fresh-green)',
      btnColor: '#FFFFFF',
      image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400&auto=format&fit=crop&q=80',
      category: 'fresh-vegetables'
    },
    {
      id: 'leafy-greens',
      title: 'Fresh Greens & Leafy Herbs',
      subtitle: 'Spinach, methi, dhaniya & mint washed & sorted',
      btnText: 'Explore Greens',
      bg: 'linear-gradient(135deg, rgba(255, 111, 165, 0.14) 0%, rgba(245, 165, 36, 0.12) 100%)',
      borderColor: 'rgba(232, 67, 147, 0.3)',
      btnBg: 'var(--womup-rose)',
      btnColor: '#FFFFFF',
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=80',
      category: 'leafy'
    },
    {
      id: 'exotic-fruits',
      title: 'Seasonal Orchard Fruits',
      subtitle: 'Kashmir apples, sweet oranges & Robusta bananas',
      btnText: 'View Fruits',
      bg: 'linear-gradient(135deg, rgba(142, 92, 247, 0.14) 0%, rgba(74, 99, 240, 0.12) 100%)',
      borderColor: 'rgba(142, 92, 247, 0.3)',
      btnBg: 'var(--womup-violet)',
      btnColor: '#FFFFFF',
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&auto=format&fit=crop&q=80',
      category: 'fruits'
    }
  ];

  return (
    <div style={{ margin: '20px 0' }}>
      <div className="promo-banners-container">
        {promoBanners.map(banner => (
          <div
            key={banner.id}
            className="promo-banner-card"
            style={{
              background: banner.bg,
              border: `1px solid ${banner.borderColor}`,
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-card)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              minHeight: '135px'
            }}
            onClick={() => onSelectCategory(banner.category)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-card)';
            }}
          >
            <div style={{ maxWidth: '60%', zIndex: 2 }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '6px' }}>
                {banner.title}
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '14px', fontWeight: 500 }}>
                {banner.subtitle}
              </p>
              <button
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid rgba(232, 67, 147, 0.35)',
                  color: 'var(--womup-rose)',
                  fontWeight: 800,
                  fontSize: '11px',
                  padding: '7px 16px',
                  borderRadius: '20px',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.06)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'transform 0.15s, box-shadow 0.15s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.04)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(232, 67, 147, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.06)';
                }}
              >
                <span style={{
                  backgroundImage: 'var(--gradient-brand)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 800
                }}>
                  {banner.btnText} →
                </span>
              </button>
            </div>

            <div style={{
              width: '105px',
              height: '105px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
              flexShrink: 0
            }}>
              <img
                src={banner.image}
                alt={banner.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
