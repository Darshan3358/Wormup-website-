import React, { useState } from 'react';
import { HeroBanner } from '../../components/customer/HeroBanner';
import { BlinkitPromoBanners } from '../../components/customer/BlinkitPromoBanners';
import { BlinkitCategoryGrid } from '../../components/customer/BlinkitCategoryGrid';
import { CategoryBar } from '../../components/customer/CategoryBar';
import { ProductGrid } from '../../components/customer/ProductGrid';
import { useLocation } from '../../context/LocationContext';

export const StorePortal = ({ searchQuery }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { selectedArea } = useLocation();

  return (
    <div className="store-portal animate-fade-up" style={{ paddingBottom: '70px' }}>
      {/* 1. Wide Panoramic Hero Banner (from Screenshot 1) */}
      <HeroBanner />

      {/* 2. 3-Tile Promo Banners Row (from Screenshot 1) */}
      <BlinkitPromoBanners onSelectCategory={setSelectedCategory} />

      {/* 3. Blinkit Iconic Category Tile Grid (from Screenshot 1 & 2) */}
      <BlinkitCategoryGrid 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
      />

      {/* 4. Product Catalog Section with Area-Wise Pricing */}
      <section id="catalog-products-section" style={{ marginTop: '30px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Fresh Harvests in {selectedArea?.name}</span>
              <span className="badge-eta" style={{ fontSize: '11px', padding: '2px 8px' }}>
                {selectedArea?.eta || '10 mins'}
              </span>
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Prices calibrated for {selectedArea?.name} dark store • Weighed accurately & sanitized
            </p>
          </div>
        </div>

        {/* Quick Horizontal Category Filters */}
        <CategoryBar 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />

        {/* Product Grid */}
        <ProductGrid 
          selectedCategory={selectedCategory} 
          searchQuery={searchQuery} 
        />
      </section>
    </div>
  );
};
