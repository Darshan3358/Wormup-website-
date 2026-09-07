import React, { useState } from 'react';
import { useLocation } from '../../context/LocationContext';
import { useProducts } from '../../context/ProductContext';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icons';

export const AreaPriceManager = () => {
  const { areas } = useLocation();
  const { products, areaPrices, updateAreaPrice, bulkUpdateArea } = useProducts();
  const { showToast } = useApp();

  const [selectedAreaId, setSelectedAreaId] = useState(areas[0]?.id || 'AREA_BOPAL');
  const [bulkAdjustment, setBulkAdjustment] = useState(5);
  const [viewMode, setViewMode] = useState('single'); // 'single' | 'matrix'

  const activeArea = areas.find(a => a.id === selectedAreaId) || areas[0];

  const handlePriceChange = (productId, newPrice, currentMrp, currentStock) => {
    updateAreaPrice(productId, selectedAreaId, newPrice, currentMrp, currentStock);
    showToast(`Updated price for ${productId} in ${activeArea.name} to ₹${newPrice}`, 'success');
  };

  const handleStockChange = (productId, currentPrice, currentMrp, newStock) => {
    updateAreaPrice(productId, selectedAreaId, currentPrice, currentMrp, newStock);
    showToast(`Updated stock to ${newStock} units in ${activeArea.name}`, 'info');
  };

  const handleBulkApply = () => {
    bulkUpdateArea(selectedAreaId, bulkAdjustment);
    showToast(`Applied ${bulkAdjustment > 0 ? '+' : ''}${bulkAdjustment}% bulk adjustment in ${activeArea.name}`, 'success');
  };

  return (
    <div>
      {/* Header & Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>
            Area-Wise Dynamic Pricing & Inventory
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Configure specific selling prices, MRPs and dark store stock levels for each zone in Ahmedabad.
          </p>
        </div>

        {/* View mode toggle */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setViewMode('single')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 700,
              background: viewMode === 'single' ? 'var(--accent-fresh)' : 'var(--bg-surface)',
              color: viewMode === 'single' ? '#000000' : 'var(--text-secondary)'
            }}
          >
            Per-Area Edit
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 700,
              background: viewMode === 'matrix' ? 'var(--accent-primary)' : 'var(--bg-surface)',
              color: '#FFFFFF'
            }}
          >
            All-Areas Matrix
          </button>
        </div>
      </div>

      {viewMode === 'single' ? (
        <>
          {/* Area Selector Tabs & Bulk Adjuster */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            background: 'var(--bg-surface)',
            padding: '14px 18px',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '20px',
            border: '1px solid var(--border-subtle)'
          }}>
            {/* Area Tabs */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
              {areas.map(area => (
                <button
                  key={area.id}
                  onClick={() => setSelectedAreaId(area.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12px',
                    fontWeight: 700,
                    background: selectedAreaId === area.id ? 'var(--accent-fresh)' : 'var(--bg-elevated)',
                    color: selectedAreaId === area.id ? '#000000' : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Icon name="mapPin" size={12} />
                  <span>{area.name}</span>
                </button>
              ))}
            </div>

            {/* Bulk adjustment tool */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Bulk Surge/Discount:</span>
              <input
                type="number"
                value={bulkAdjustment}
                onChange={(e) => setBulkAdjustment(Number(e.target.value))}
                style={{
                  width: '60px',
                  padding: '6px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  textAlign: 'center'
                }}
              />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>%</span>
              <button
                onClick={handleBulkApply}
                className="btn-secondary"
                style={{ fontSize: '11px', padding: '6px 12px' }}
              >
                Apply Surge
              </button>
            </div>
          </div>

          {/* Table of Products for Selected Area */}
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                  {activeArea.name} DarkStore ({activeArea.storeName})
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '10px' }}>
                  Pincode: {activeArea.pincode} • Delivery Fee: ₹{activeArea.deliveryFee}
                </span>
              </div>
              <span className="badge-fresh" style={{ fontSize: '11px' }}>Active Area</span>
            </div>

            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '12px 18px' }}>Vegetable / Fruit</th>
                    <th style={{ padding: '12px 18px' }}>Unit</th>
                    <th style={{ padding: '12px 18px' }}>MRP (₹)</th>
                    <th style={{ padding: '12px 18px' }}>Selling Price (₹)</th>
                    <th style={{ padding: '12px 18px' }}>Discount</th>
                    <th style={{ padding: '12px 18px' }}>Store Stock</th>
                    <th style={{ padding: '12px 18px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => {
                    const priceObj = areaPrices[product.id]?.[selectedAreaId] || { price: 30, mrp: 40, stock: 20 };
                    const discount = priceObj.mrp > priceObj.price 
                      ? Math.round(((priceObj.mrp - priceObj.price) / priceObj.mrp) * 100) 
                      : 0;

                    return (
                      <tr 
                        key={product.id}
                        style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={product.image} alt={product.name} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{product.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {product.id}</div>
                          </div>
                        </td>

                        <td style={{ padding: '12px 18px', color: 'var(--text-secondary)' }}>
                          {product.unit}
                        </td>

                        {/* MRP Input */}
                        <td style={{ padding: '12px 18px' }}>
                          <input
                            type="number"
                            defaultValue={priceObj.mrp}
                            onBlur={(e) => handlePriceChange(product.id, priceObj.price, e.target.value, priceObj.stock)}
                            style={{
                              width: '65px',
                              padding: '6px 8px',
                              borderRadius: 'var(--radius-sm)',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-secondary)',
                              fontSize: '13px'
                            }}
                          />
                        </td>

                        {/* Selling Price Input (Core Area Price) */}
                        <td style={{ padding: '12px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: 'var(--accent-fresh)', fontWeight: 700 }}>₹</span>
                            <input
                              type="number"
                              defaultValue={priceObj.price}
                              onBlur={(e) => handlePriceChange(product.id, e.target.value, priceObj.mrp, priceObj.stock)}
                              style={{
                                width: '70px',
                                padding: '6px 8px',
                                borderRadius: 'var(--radius-sm)',
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid var(--accent-fresh)',
                                color: '#FFFFFF',
                                fontWeight: 800,
                                fontSize: '14px'
                              }}
                            />
                          </div>
                        </td>

                        <td style={{ padding: '12px 18px' }}>
                          <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
                            {discount}% OFF
                          </span>
                        </td>

                        {/* Stock Input */}
                        <td style={{ padding: '12px 18px' }}>
                          <input
                            type="number"
                            defaultValue={priceObj.stock}
                            onBlur={(e) => handleStockChange(product.id, priceObj.price, priceObj.mrp, e.target.value)}
                            style={{
                              width: '65px',
                              padding: '6px 8px',
                              borderRadius: 'var(--radius-sm)',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border-subtle)',
                              color: '#FFFFFF',
                              fontSize: '13px'
                            }}
                          />
                        </td>

                        <td style={{ padding: '12px 18px' }}>
                          {priceObj.stock > 10 ? (
                            <span className="badge-fresh" style={{ fontSize: '10px' }}>In Stock</span>
                          ) : priceObj.stock > 0 ? (
                            <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-warning)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>Low Stock</span>
                          ) : (
                            <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-danger)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>Sold Out</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Multi-Area Comparison Matrix */
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '20px', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '6px', color: '#FFFFFF' }}>
            Cross-Area Price Comparison Matrix
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Compare how a single vegetable's price varies across different dark store hubs.
          </p>

          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Vegetable</th>
                  {areas.map(a => (
                    <th key={a.id} style={{ padding: '12px 14px' }}>
                      {a.name} <br />
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>({a.eta})</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>🥦</span>
                      <span>{p.name}</span>
                    </td>
                    {areas.map(a => {
                      const price = areaPrices[p.id]?.[a.id]?.price || '-';
                      return (
                        <td key={a.id} style={{ padding: '12px 14px' }}>
                          <span style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: 'var(--accent-fresh)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontWeight: 800
                          }}>
                            ₹{price}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
