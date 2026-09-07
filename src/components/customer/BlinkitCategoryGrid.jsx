import React from 'react';

export const BlinkitCategoryGrid = ({ selectedCategory, onSelectCategory }) => {
  const categories = [
    {
      id: 'fresh-vegetables',
      name: 'Daily Veggies',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
      tag: 'Fresh'
    },
    {
      id: 'roots',
      name: 'Potato, Onion & Roots',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80',
      tag: 'Essentials'
    },
    {
      id: 'leafy',
      name: 'Palak, Methi & Greens',
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=80',
      tag: 'Farm Picked'
    },
    {
      id: 'exotic',
      name: 'Exotic & Salads',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
      tag: '✨ POPULAR',
      isFeatured: true
    },
    {
      id: 'fruits',
      name: 'Fresh Fruits',
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500&auto=format&fit=crop&q=80',
      tag: 'Sweet'
    },
    {
      id: 'masala',
      name: 'Chilli, Ginger & Garlic',
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
      tag: 'Aromatic'
    },
    {
      id: 'roots-carrots',
      name: 'Carrots & Beetroots',
      image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=500&auto=format&fit=crop&q=80',
      tag: 'Crunchy'
    },
    {
      id: 'daily-cauliflower',
      name: 'Cauliflower & Cabbage',
      image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=500&auto=format&fit=crop&q=80',
      tag: 'Farm Direct'
    }
  ];

  return (
    <div style={{ margin: '28px 0 36px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px', margin: 0 }}>
            Explore by Category
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            • 8 Fresh Sections
          </span>
        </div>

        <button
          onClick={() => onSelectCategory('all')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--womup-violet)',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          See All Products →
        </button>
      </div>

      {/* Unified Category Grid with Full-Bleed Images & Integrated Overlay Labels */}
      <div className="category-grid-container">
        {categories.map(cat => {
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id === selectedCategory ? 'all' : cat.id)}
              style={{
                width: '100%',
                aspectRatio: '1 / 1.05',
                borderRadius: '14px',
                overflow: 'hidden',
                position: 'relative',
                background: '#EAE8F0', // Consistent base so no photo mismatch shows through
                cursor: 'pointer',
                boxShadow: isSelected 
                  ? '0 6px 20px rgba(142, 92, 247, 0.35)' 
                  : '0 2px 8px rgba(18, 16, 27, 0.06)',
                border: isSelected 
                  ? '2.5px solid var(--womup-violet)' 
                  : (cat.isFeatured ? '2px solid rgba(232, 67, 147, 0.7)' : '1px solid rgba(18, 16, 27, 0.06)'),
                transition: 'transform 0.22s var(--ease-brand), box-shadow 0.22s var(--ease-brand)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(142, 92, 247, 0.22)';
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isSelected 
                  ? '0 6px 20px rgba(142, 92, 247, 0.35)' 
                  : '0 2px 8px rgba(18, 16, 27, 0.06)';
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1)';
              }}
            >
              {/* Featured / Promo Category Glow Border Tag */}
              {cat.isFeatured && (
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  left: '6px',
                  background: 'var(--gradient-brand)',
                  color: '#FFFFFF',
                  fontSize: '8px',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '9999px',
                  zIndex: 3,
                  boxShadow: '0 2px 6px rgba(232, 67, 147, 0.4)',
                  letterSpacing: '0.3px'
                }}>
                  {cat.tag}
                </div>
              )}

              {/* Full-bleed Photo with Consistent Fill & Crop */}
              <img
                src={cat.image}
                alt={cat.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                  display: 'block'
                }}
                loading="lazy"
              />

              {/* Gradient Wash Overlay (Bottom 55% for guaranteed white text readability) */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: isSelected
                  ? 'linear-gradient(180deg, rgba(142, 92, 247, 0.15) 0%, rgba(18, 16, 27, 0.4) 45%, rgba(18, 16, 27, 0.92) 100%)'
                  : 'linear-gradient(180deg, rgba(18, 16, 27, 0) 35%, rgba(18, 16, 27, 0.45) 65%, rgba(18, 16, 27, 0.9) 100%)',
                pointerEvents: 'none',
                zIndex: 1
              }} />

              {/* Category Label Inside the Card */}
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                right: '8px',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}>
                <span style={{
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: 'clamp(10px, 2.5vw, 13px)',
                  lineHeight: 1.2,
                  letterSpacing: '-0.2px',
                  textShadow: '0 2px 6px rgba(0, 0, 0, 0.6)'
                }}>
                  {cat.name}
                </span>

                {/* Active Indicator Bar if Selected */}
                {isSelected && (
                  <span style={{
                    width: '20px',
                    height: '2.5px',
                    background: 'var(--gradient-brand)',
                    borderRadius: '2px',
                    marginTop: '2px'
                  }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
