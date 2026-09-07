import React, { useState } from 'react';
import { useLocation } from '../../context/LocationContext';
import { useApp } from '../../context/AppContext';
import { Icon } from './Icons';

export const LocationModal = () => {
  const {
    areas,
    selectedArea,
    selectedAddress,
    selectArea,
    selectAddress,
    detectLiveLocation,
    isDetectingLocation,
    isLocationModalOpen,
    setIsLocationModalOpen
  } = useLocation();

  const { userProfile, deleteAddress, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingAddress, setEditingAddress] = useState(null);
  const [editLine, setEditLine] = useState('');

  if (!isLocationModalOpen) return null;

  // Filter areas based on user typing in "search delivery location"
  const filteredAreas = searchQuery.trim()
    ? areas.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.pincode.includes(searchQuery.trim()) ||
        a.storeName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectAreaFromSearch = (area) => {
    selectArea(area.id);
    setSearchQuery('');
    showToast(`Delivering from ${area.storeName} (${area.eta})`, 'success');
  };

  const handleStartEdit = (e, addr) => {
    e.stopPropagation();
    setEditingAddress(addr.id);
    setEditLine(addr.line);
  };

  const handleSaveEdit = (e, addr) => {
    e.stopPropagation();
    if (!editLine.trim()) return;
    addr.line = editLine;
    setEditingAddress(null);
    showToast('Delivery address updated', 'success');
  };

  const handleDelete = (e, addrId) => {
    e.stopPropagation();
    deleteAddress(addrId);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(18, 16, 27, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 300,
      padding: '12px'
    }}
    onClick={() => setIsLocationModalOpen(false)}
    >
      {/* Modal Container matching exact Blinkit Screenshot */}
      <div 
        className="location-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Row: Title & Close Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#12101B',
            letterSpacing: '-0.2px',
            margin: 0
          }}>
            Change Location
          </h2>

          <button
            onClick={() => setIsLocationModalOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#12101B',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 0.2s'
            }}
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="3" x2="13" y2="13" />
              <line x1="13" y1="3" x2="3" y2="13" />
            </svg>
          </button>
        </div>

        {/* Action Row: [ Detect my location ] - ( OR ) - [ search delivery location ] */}
        <div className="location-action-row">
          {/* Green "Detect my location" button */}
          <button
            onClick={detectLiveLocation}
            disabled={isDetectingLocation}
            style={{
              background: '#0c831f', // Real Blinkit green
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '14px',
              padding: '11px 18px',
              borderRadius: '8px',
              border: 'none',
              cursor: isDetectingLocation ? 'wait' : 'pointer',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(12, 131, 31, 0.25)',
              transition: 'all 0.2s ease',
              opacity: isDetectingLocation ? 0.8 : 1
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0a6f1a'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0c831f'}
          >
            {isDetectingLocation ? (
              <>
                <span style={{
                  width: '12px',
                  height: '12px',
                  border: '2px solid #FFFFFF',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.8s linear infinite'
                }} />
                <span>Detecting...</span>
              </>
            ) : (
              'Detect my location'
            )}
          </button>

          {/* -( OR )- Divider */}
          <div className="location-or-divider" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0
          }}>
            <span style={{ width: '14px', height: '1px', background: '#DCDAE5' }} />
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: '1px solid #D0CDDC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: '#827E91',
              fontWeight: 700
            }}>
              OR
            </div>
            <span style={{ width: '14px', height: '1px', background: '#DCDAE5' }} />
          </div>

          {/* Search Delivery Location Input */}
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              placeholder="search delivery location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '42px',
                padding: '0 16px',
                borderRadius: '8px',
                border: '1.5px solid #D0CDDC',
                fontSize: '13px',
                color: '#12101B',
                outline: 'none',
                background: '#FFFFFF',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0c831f';
                e.target.style.boxShadow = '0 0 0 3px rgba(12, 131, 31, 0.12)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D0CDDC';
                e.target.style.boxShadow = 'none';
              }}
            />

            {/* Live Search Auto-suggestions Popup */}
            {filteredAreas.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '46px',
                left: 0,
                right: 0,
                background: '#FFFFFF',
                borderRadius: '10px',
                border: '1px solid #ECEAF2',
                boxShadow: '0 10px 25px rgba(18, 16, 27, 0.15)',
                zIndex: 40,
                maxHeight: '220px',
                overflowY: 'auto',
                padding: '6px'
              }}>
                {filteredAreas.map(area => (
                  <div
                    key={area.id}
                    onClick={() => handleSelectAreaFromSearch(area)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F9F6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#12101B' }}>
                        {area.name}, {area.city}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6B6878' }}>
                        {area.storeName} • {area.pincode}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      background: '#E4F8ED',
                      color: '#0c831f',
                      padding: '3px 8px',
                      borderRadius: '999px'
                    }}>
                      ⚡ {area.eta}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section Title: Your saved addresses */}
        <div style={{
          fontSize: '14px',
          fontWeight: 700,
          color: '#272430',
          margin: '26px 0 14px 0'
        }}>
          Your saved addresses
        </div>

        {/* Saved Addresses List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(userProfile.addresses || []).map(addr => {
            const isSelected = selectedAddress?.id === addr.id || selectedArea?.name?.toLowerCase() === addr.area?.toLowerCase();

            return (
              <div
                key={addr.id}
                onClick={() => selectAddress(addr)}
                style={{
                  background: isSelected ? '#FAFDFB' : '#FFFFFF',
                  border: `1.5px solid ${isSelected ? '#0c831f' : '#ECEAF2'}`,
                  borderRadius: '14px',
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(18, 16, 27, 0.03)',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#C5C2D2';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(18, 16, 27, 0.06)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#ECEAF2';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(18, 16, 27, 0.03)';
                  }
                }}
              >
                {/* Home Icon Container matching screenshot */}
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#FFF9E6', // Warm cream background
                  border: '1px solid #FFE4A0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    {/* Golden house icon from screenshot */}
                    <path
                      d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10.5Z"
                      stroke="#B8860B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="#FFF3C4"
                    />
                    <path
                      d="M9 21V12H15V21"
                      stroke="#B8860B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Address Details & Action Buttons */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#12101B'
                      }}>
                        {addr.label}
                      </span>
                      {isSelected && (
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          background: '#E4F8ED',
                          color: '#0c831f',
                          padding: '1px 6px',
                          borderRadius: '4px'
                        }}>
                          Selected
                        </span>
                      )}
                    </div>
                  </div>

                  {editingAddress === addr.id ? (
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="text" 
                        value={editLine} 
                        onChange={(e) => setEditLine(e.target.value)}
                        style={{
                          flex: 1,
                          fontSize: '12px',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: '1px solid #0c831f'
                        }}
                      />
                      <button 
                        onClick={(e) => handleSaveEdit(e, addr)}
                        style={{
                          background: '#0c831f',
                          color: '#FFF',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: 'none'
                        }}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <p style={{
                      fontSize: '13px',
                      color: '#6B6878',
                      margin: '4px 0 10px 0',
                      lineHeight: 1.45,
                      wordBreak: 'break-word'
                    }}>
                      {addr.line}
                    </p>
                  )}

                  {/* Edit (Green circle) & Delete (Red circle) Icons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Edit button */}
                    <button
                      onClick={(e) => handleStartEdit(e, addr)}
                      title="Edit Address"
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: '#FFFFFF',
                        border: '1px solid #D8D6E2',
                        color: '#0c831f',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#0c831f';
                        e.currentTarget.style.backgroundColor = '#F4FBF6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#D8D6E2';
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0c831f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                      </svg>
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDelete(e, addr.id)}
                      title="Delete Address"
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: '#FFFFFF',
                        border: '1px solid #D8D6E2',
                        color: '#EF4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#EF4444';
                        e.currentTarget.style.backgroundColor = '#FFF5F5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#D8D6E2';
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Operational DarkStore Switcher at bottom */}
        <div style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid #ECEAF2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#6B6878'
        }}>
          <span>Operational DarkStore Hubs:</span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {areas.slice(0, 4).map(a => (
              <button
                key={a.id}
                onClick={() => selectArea(a.id)}
                style={{
                  background: selectedArea?.id === a.id ? '#E4F8ED' : '#F5F3FA',
                  color: selectedArea?.id === a.id ? '#0c831f' : '#6B6878',
                  border: `1px solid ${selectedArea?.id === a.id ? '#0c831f' : '#ECEAF2'}`,
                  borderRadius: '4px',
                  padding: '3px 7px',
                  fontSize: '10px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {a.name} ({a.eta})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
