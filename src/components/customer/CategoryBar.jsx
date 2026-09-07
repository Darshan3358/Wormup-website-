import React from 'react';
import { useProducts } from '../../context/ProductContext';

export const CategoryBar = ({ selectedCategory, onSelectCategory }) => {
  const { categories } = useProducts();

  return (
    <div style={{ margin: '16px 0 24px 0', overflowX: 'auto', paddingBottom: '6px' }}>
      <div style={{ display: 'flex', gap: '10px', minWidth: 'max-content' }}>
        {categories.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: 'var(--radius-full)',
                background: isSelected 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(124, 58, 237, 0.25) 100%)' 
                  : 'var(--bg-card)',
                border: `1px solid ${isSelected ? 'var(--accent-fresh)' : 'var(--border-subtle)'}`,
                color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: isSelected ? 700 : 500,
                fontSize: '13px',
                boxShadow: isSelected ? '0 4px 12px rgba(16, 185, 129, 0.2)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '16px' }}>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
