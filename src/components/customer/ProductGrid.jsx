import React from 'react';
import { useProducts } from '../../context/ProductContext';
import { ProductCard } from './ProductCard';

export const ProductGrid = ({ selectedCategory, searchQuery }) => {
  const { products } = useProducts();

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ paddingBottom: '60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
          {searchQuery ? `Search results for "${searchQuery}"` : 'Fresh Harvests Today'}
        </h2>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          {filteredProducts.length} varieties available
        </span>
      </div>

      {filteredProducts.length === 0 ? (
        <div 
          className="glass-panel"
          style={{
            textAlign: 'center',
            padding: '50px 20px',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <span style={{ fontSize: '42px', display: 'block', marginBottom: '12px' }}>🥕</span>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>No vegetables found</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Try searching for potato, tomato, onion or clear your filter.
          </p>
        </div>
      ) : (
        <div className="grid-products">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
