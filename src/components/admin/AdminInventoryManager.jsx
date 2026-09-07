import React, { useState } from 'react';
import { useLocation } from '../../context/LocationContext';
import { useProducts } from '../../context/ProductContext';
import { PRODUCTS } from '../../data/mockData';
import { Icon } from '../common/Icons';

export const AdminInventoryManager = () => {
  const { areas } = useLocation();
  const { areaPrices, updateAreaPrice } = useProducts();

  const [activeStoreId, setActiveStoreId] = useState(areas[0]?.storeId || 'WM-BOP-01');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedProductForAdj, setSelectedProductForAdj] = useState(null);
  const [adjData, setAdjData] = useState({ physicalStock: '', reason: 'Damaged stock' });

  const activeArea = areas.find(a => a.storeId === activeStoreId) || areas[0];

  // Inventory adjustment audit logs state
  const [adjustmentLogs, setAdjustmentLogs] = useState(() => {
    const saved = localStorage.getItem('womup_inventory_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'LOG_01',
        time: 'Today, 09:15 AM',
        storeName: 'Bopal Central DarkStore',
        productName: 'Hybrid Tomato (Tamatar)',
        systemStock: 80,
        physicalStock: 76,
        difference: -4,
        reason: 'Damaged / bruised stock during transit',
        adminUser: 'Admin Ayushi'
      },
      {
        id: 'LOG_02',
        time: 'Yesterday, 04:30 PM',
        storeName: 'Satellite Hub DarkStore',
        productName: 'Fresh Coriander (Dhaniya)',
        systemStock: 25,
        physicalStock: 23,
        difference: -2,
        reason: 'Wilted leaves sorting discard',
        adminUser: 'Admin Ayushi'
      }
    ];
  });

  const handleOpenAdjust = (prod, currentStock) => {
    setSelectedProductForAdj({ ...prod, currentStock });
    setAdjData({ physicalStock: currentStock, reason: 'Damaged stock' });
  };

  const handleSaveAdjustment = (e) => {
    e.preventDefault();
    if (!selectedProductForAdj) return;

    const newStockNum = parseInt(adjData.physicalStock, 10);
    if (isNaN(newStockNum) || newStockNum < 0) return;

    const diff = newStockNum - selectedProductForAdj.currentStock;
    const currentPriceObj = areaPrices[selectedProductForAdj.id]?.[activeArea.id] || { price: 30, mrp: 40 };

    // Update stock in context
    updateAreaPrice(
      selectedProductForAdj.id,
      activeArea.id,
      currentPriceObj.price,
      currentPriceObj.mrp,
      newStockNum
    );

    // Record audit log
    const newLog = {
      id: `LOG_${Date.now()}`,
      time: 'Just now',
      storeName: activeArea.storeName,
      productName: selectedProductForAdj.name,
      systemStock: selectedProductForAdj.currentStock,
      physicalStock: newStockNum,
      difference: diff,
      reason: adjData.reason,
      adminUser: 'Admin Ayushi'
    };

    const updatedLogs = [newLog, ...adjustmentLogs];
    setAdjustmentLogs(updatedLogs);
    localStorage.setItem('womup_inventory_logs', JSON.stringify(updatedLogs));

    setSelectedProductForAdj(null);
  };

  const filteredProducts = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Bar with Dark Store Selector */}
      <div style={{
        background: '#1C1930',
        border: '1px solid #2E2949',
        borderRadius: '16px',
        padding: '22px 26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Dark Store Inventory & Physical Stock Adjustments
            </h2>
            <span style={{
              background: 'rgba(31, 175, 110, 0.2)',
              border: '1px solid rgba(31, 175, 110, 0.4)',
              color: '#1FAF6E',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              SRS Section 8 & 9
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#9C97AE', margin: '4px 0 0 0' }}>
            Manage warehouse crate availability, reserved orders in transit, and physical stock discrepancy adjustments.
          </p>
        </div>

        {/* Store Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#9C97AE', fontWeight: 600 }}>Active Store:</span>
          <select
            value={activeStoreId}
            onChange={(e) => setActiveStoreId(e.target.value)}
            style={{
              padding: '9px 14px',
              borderRadius: '8px',
              background: '#151224',
              border: '1.5px solid #8E5CF7',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {areas.map(a => (
              <option key={a.storeId} value={a.storeId}>
                {a.storeName} ({a.storeId}) — {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search & Stock Indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <input
            type="text"
            placeholder="Search vegetable or category..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              background: '#151224',
              border: '1.5px solid #2E2949',
              color: '#FFFFFF',
              fontSize: '12px',
              outline: 'none'
            }}
          />
          <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9C97AE' }}>
            <Icon name="search" size={15} />
          </div>
        </div>

        <div style={{ fontSize: '12px', color: '#9C97AE' }}>
          Store Coverage: <strong style={{ color: '#FFFFFF' }}>{activeArea.name} ({activeArea.serviceRadius})</strong> • Target Dispatch: <strong style={{ color: '#1FAF6E' }}>{activeArea.eta}</strong>
        </div>
      </div>

      {/* Inventory Table (SRS Section 9) */}
      <div className="table-responsive" style={{
        background: '#1C1930',
        border: '1px solid #2E2949',
        borderRadius: '16px',
        overflowX: 'auto',
        boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#14121F', borderBottom: '1.5px solid #2E2949', color: '#9C97AE', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              <th style={{ padding: '14px 18px' }}>Vegetable Produce</th>
              <th style={{ padding: '14px 18px' }}>Category</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Available Stock</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Reserved in Active Carts</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Remaining Available</th>
              <th style={{ padding: '14px 18px', textAlign: 'center' }}>Stock Health</th>
              <th style={{ padding: '14px 18px', textAlign: 'center' }}>Adjustment</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((prod, idx) => {
              const pricing = areaPrices[prod.id]?.[activeArea.id] || { price: 30, mrp: 40, stock: 40 };
              const available = pricing.stock || 0;
              // Mock reserved calculation
              const reserved = Math.min(available, Math.floor(available * 0.12));
              const remaining = available - reserved;
              const isLow = remaining < 15;

              return (
                <tr
                  key={prod.id}
                  style={{
                    borderBottom: idx === filteredProducts.length - 1 ? 'none' : '1px solid #2E2949',
                    background: idx % 2 === 0 ? '#1C1930' : '#19162B'
                  }}
                >
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={prod.image}
                        alt={prod.name}
                        style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{prod.name}</div>
                        <div style={{ fontSize: '11px', color: '#9C97AE' }}>Base Unit: {prod.unit}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ fontSize: '12px', color: '#C084FC', fontWeight: 600, textTransform: 'capitalize' }}>
                      {prod.category.replace('-', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 700, color: '#FFFFFF' }}>
                    {available} Kg/Units
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right', color: '#F5A524', fontWeight: 600 }}>
                    {reserved} Kg
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 800, color: isLow ? '#EF4444' : '#1FAF6E' }}>
                    {remaining} Kg
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: isLow ? 'rgba(239, 68, 68, 0.15)' : 'rgba(31, 175, 110, 0.15)',
                      color: isLow ? '#EF4444' : '#1FAF6E',
                      border: `1px solid ${isLow ? 'rgba(239, 68, 68, 0.3)' : 'rgba(31, 175, 110, 0.3)'}`
                    }}>
                      {isLow ? 'LOW STOCK ⚠️' : 'OPTIMAL ✓'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleOpenAdjust(prod, available)}
                      style={{
                        background: 'rgba(142, 92, 247, 0.15)',
                        border: '1px solid rgba(142, 92, 247, 0.3)',
                        color: '#C084FC',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Adjust Stock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Stock Adjustment Modal with Mandatory Audit Reason (SRS Section 9) */}
      {selectedProductForAdj && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10, 8, 20, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <form
            onSubmit={handleSaveAdjustment}
            style={{
              background: '#1C1930',
              border: '1.5px solid #2E2949',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '480px',
              padding: '28px',
              color: '#FFFFFF',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)'
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0' }}>
              Physical Stock Adjustment: {selectedProductForAdj.name}
            </h3>
            <p style={{ fontSize: '12px', color: '#9C97AE', margin: '0 0 20px 0' }}>
              Store: {activeArea.storeName} ({activeArea.name})
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
              <div style={{ background: '#14121F', padding: '12px', borderRadius: '8px', border: '1px solid #2E2949' }}>
                <span style={{ fontSize: '11px', color: '#9C97AE' }}>System Recorded Stock</span>
                <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px', color: '#FFFFFF' }}>
                  {selectedProductForAdj.currentStock} Kg
                </div>
              </div>
              <div style={{ background: '#14121F', padding: '12px', borderRadius: '8px', border: '1px solid #2E2949' }}>
                <span style={{ fontSize: '11px', color: '#9C97AE' }}>Actual Physical Count</span>
                <input
                  type="number"
                  value={adjData.physicalStock}
                  onChange={(e) => setAdjData({ ...adjData, physicalStock: e.target.value })}
                  style={{ width: '100%', background: '#1C1930', border: '1px solid #8E5CF7', borderRadius: '6px', color: '#FFFFFF', fontSize: '16px', fontWeight: 800, padding: '4px 8px', marginTop: '2px' }}
                  required
                />
              </div>
            </div>

            {/* Calculated Difference badge */}
            <div style={{ marginBottom: '18px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#9C97AE' }}>Adjustment Net Diff:</span>
              <strong style={{
                color: (parseInt(adjData.physicalStock || 0) - selectedProductForAdj.currentStock) < 0 ? '#EF4444' : '#1FAF6E',
                fontSize: '14px'
              }}>
                {(parseInt(adjData.physicalStock || 0) - selectedProductForAdj.currentStock) > 0 ? '+' : ''}
                {parseInt(adjData.physicalStock || 0) - selectedProductForAdj.currentStock} Kg
              </strong>
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label style={{ fontSize: '12px', color: '#9C97AE', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Mandatory Audit Reason *
              </label>
              <select
                value={adjData.reason}
                onChange={(e) => setAdjData({ ...adjData, reason: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: '#14121F', border: '1px solid #2E2949', borderRadius: '8px', color: '#FFFFFF', fontSize: '13px' }}
              >
                <option value="Damaged stock">Damaged stock / Bruising in transit</option>
                <option value="Shrinkage / Moisture loss">Moisture loss / Natural shrinkage</option>
                <option value="Mandi arrival difference">Mandi arrival weight discrepancy</option>
                <option value="Internal quality discard">Internal freshness QA discard</option>
                <option value="Stock counting correction">Physical recount audit correction</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSelectedProductForAdj(null)}
                style={{ padding: '9px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid #2E2949', color: '#9C97AE', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ padding: '9px 20px', borderRadius: '8px', background: 'var(--gradient-brand)', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 800 }}
              >
                Record Adjustment Log
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inventory Adjustment Audit Trail (SRS Section 9) */}
      <div style={{
        background: '#1C1930',
        border: '1px solid #2E2949',
        borderRadius: '16px',
        padding: '22px 26px',
        boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3)'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 14px 0' }}>
          Inventory Adjustment Audit Trail
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {adjustmentLogs.map(log => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: '#14121F',
                border: '1px solid #2E2949',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '13px' }}>
                  {log.productName} • <span style={{ color: log.difference < 0 ? '#EF4444' : '#1FAF6E' }}>{log.difference > 0 ? `+${log.difference}` : log.difference} Kg</span>
                </div>
                <div style={{ color: '#9C97AE', marginTop: '2px' }}>
                  Reason: <em>"{log.reason}"</em> • Store: {log.storeName}
                </div>
              </div>
              <div style={{ textAlign: 'right', color: '#9C97AE' }}>
                <div>{log.time}</div>
                <div style={{ fontSize: '11px', color: '#C084FC' }}>By: {log.adminUser}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
