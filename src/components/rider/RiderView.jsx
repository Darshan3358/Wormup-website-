import React, { useState, useEffect, useRef } from 'react';
import { useOrders, ORDER_STATUSES } from '../../context/OrderContext';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icons';
import { publishRiderLocation, DeviceGPSWatcher } from '../../services/liveTrackingService';

export const RiderView = () => {
  const { 
    orders, 
    assignRider,
    rejectRider,
    markOutForDelivery,
    markDelivered,
    cancelOrder
  } = useOrders();
  const { showToast } = useApp();

  const [onlineStatus, setOnlineStatus] = useState('ONLINE'); // 'ONLINE' | 'OFFLINE' | 'BUSY'
  const [otpInputs, setOtpInputs] = useState({});
  const [failedModalOrder, setFailedModalOrder] = useState(null);
  const [failureReason, setFailureReason] = useState('Customer unavailable');

  // Real-time Device GPS state
  const [gpsActive, setGpsActive] = useState(false);
  const [currentGps, setCurrentGps] = useState({ lat: 23.0364, lng: 72.4816, speed: 22 });
  const [gpsError, setGpsError] = useState(null);
  const gpsWatcherRef = useRef(null);

  const riderProfile = {
    id: 'RDR_01',
    name: 'Rahul Sharma',
    phone: '+91 98250 14892',
    rating: '4.9',
    vehicle: 'Ather 450X (GJ-01-ET-8492)',
    assignedStore: 'WM-BOP-01',
    lat: currentGps.lat,
    lng: currentGps.lng
  };

  // Orders available for rider dispatch or actively in transit
  const availableForAcceptance = orders.filter(o => o.status === 'READY_FOR_PICKUP');
  const riderActiveDeliveries = orders.filter(o => 
    ['RIDER_ASSIGNED', 'OUT_FOR_DELIVERY'].includes(o.status)
  );
  const activeDelivery = riderActiveDeliveries.find(o => o.status === 'OUT_FOR_DELIVERY');
  const completedToday = orders.filter(o => o.status === 'DELIVERED');

  // Start real GPS watcher whenever an order is OUT_FOR_DELIVERY
  useEffect(() => {
    if (activeDelivery) {
      setGpsActive(true);
      const watcher = new DeviceGPSWatcher(
        activeDelivery.id,
        riderProfile,
        (coords) => {
          setCurrentGps({ lat: coords.latitude, lng: coords.longitude, speed: coords.speed });
          setGpsError(null);
        },
        (err) => {
          console.warn('Rider device GPS warning:', err);
          setGpsError('Browser GPS permission needed or running on local dev machine. Fallback broadcaster active.');
        }
      );
      watcher.start();
      gpsWatcherRef.current = watcher;

      // Also publish initial position immediately
      publishRiderLocation({
        orderId: activeDelivery.id,
        riderId: riderProfile.id,
        riderName: riderProfile.name,
        latitude: currentGps.lat,
        longitude: currentGps.lng,
        speed: 22
      });

      return () => {
        watcher.stop();
        setGpsActive(false);
      };
    } else {
      if (gpsWatcherRef.current) {
        gpsWatcherRef.current.stop();
        gpsWatcherRef.current = null;
      }
      setGpsActive(false);
    }
  }, [activeDelivery?.id]);

  // Handler to nudge rider GPS manually for testing transit across Ahmedabad
  const handleNudgeGps = (orderId, deltaLat, deltaLng) => {
    const newLat = parseFloat((currentGps.lat + deltaLat).toFixed(4));
    const newLng = parseFloat((currentGps.lng + deltaLng).toFixed(4));
    setCurrentGps({ lat: newLat, lng: newLng, speed: 24 });

    publishRiderLocation({
      orderId,
      riderId: riderProfile.id,
      riderName: riderProfile.name,
      latitude: newLat,
      longitude: newLng,
      speed: 24
    });
    showToast(`Transmitted live GPS: ${newLat}, ${newLng}`, 'info');
  };

  const handleAcceptDispatch = (orderId) => {
    const res = assignRider(orderId, riderProfile);
    if (res.success) {
      setOnlineStatus('BUSY');
      showToast(`Order #${orderId} accepted! Proceed to dark store for pickup.`, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleDeclineDispatch = (orderId) => {
    const res = rejectRider(orderId, 'Rider declined offer');
    if (res.success) {
      showToast(`Order #${orderId} returned to queue for next nearby rider.`, 'info');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handlePickupFromStore = (orderId) => {
    const res = markOutForDelivery(orderId);
    if (res.success) {
      showToast(`Order #${orderId} picked up! Out for delivery to customer.`, 'info');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleOtpVerify = (orderId) => {
    const input = otpInputs[orderId] || '';
    if (!input) {
      showToast('Please enter the 4-digit customer delivery OTP', 'danger');
      return;
    }
    const res = markDelivered(orderId, input);
    if (res.success) {
      showToast(res.message, 'success');
      setOtpInputs({ ...otpInputs, [orderId]: '' });
      setOnlineStatus('ONLINE');
    } else {
      showToast(res.message, 'danger');
    }
  };

  const handleReportFailed = (e) => {
    e.preventDefault();
    if (!failedModalOrder) return;
    const res = cancelOrder(failedModalOrder.id, failureReason);
    if (res.success) {
      showToast(`Delivery attempt recorded: ${failureReason}. Admin notified.`, 'info');
      setFailedModalOrder(null);
      setOnlineStatus('ONLINE');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', padding: '24px 16px 60px 16px', color: '#12101B' }}>
      
      {/* RBAC Governance Notice Banner (SRS Section 34) */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(142, 92, 247, 0.12) 100%)',
        border: '1.5px solid rgba(6, 182, 212, 0.3)',
        borderRadius: '12px',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284C7', fontWeight: 700 }}>
          <Icon name="bike" size={16} />
          <span>Role: Delivery Partner (Last-Mile Quick Transit)</span>
        </div>
        <span style={{ color: '#6B6878', fontSize: '11px', fontWeight: 600 }}>
          🔒 Product & area selling prices are strictly governed by Admin.
        </span>
      </div>

      {/* Rider Status & Profile Card (SRS Section 20–23) */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1.5px solid #ECEAF2',
        padding: 'clamp(14px, 4vw, 24px)',
        marginBottom: '24px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(6, 182, 212, 0.35)',
              flexShrink: 0
            }}>
              <Icon name="bike" size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 'clamp(18px, 4vw, 20px)', fontWeight: 800, color: '#12101B', margin: 0, letterSpacing: '-0.3px' }}>
                  {riderProfile.name}
                </h1>
                <span className="badge-fresh" style={{ fontSize: '10px' }}>★ {riderProfile.rating} Womup Fleet</span>
              </div>
              <p style={{ fontSize: '12px', color: '#6B6878', margin: '3px 0 0 0', fontWeight: 500 }}>
                Vehicle: <strong>{riderProfile.vehicle}</strong> • Base Dark Store: <strong>{riderProfile.assignedStore}</strong>
              </p>
            </div>
          </div>

          {/* Online/Offline Availability Toggle (SRS Section 23) */}
          <button
            onClick={() => {
              const next = onlineStatus === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
              setOnlineStatus(next);
              showToast(`Rider availability set to ${next}`, next === 'ONLINE' ? 'success' : 'info');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 20px',
              borderRadius: '9999px',
              background: onlineStatus === 'ONLINE' ? 'rgba(31, 175, 110, 0.15)' : onlineStatus === 'BUSY' ? 'rgba(245, 165, 36, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1.5px solid ${onlineStatus === 'ONLINE' ? '#1FAF6E' : onlineStatus === 'BUSY' ? '#F5A524' : '#EF4444'}`,
              color: onlineStatus === 'ONLINE' ? '#1FAF6E' : onlineStatus === 'BUSY' ? '#F5A524' : '#EF4444',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: onlineStatus === 'ONLINE' ? '#1FAF6E' : onlineStatus === 'BUSY' ? '#F5A524' : '#EF4444' }} />
            <span>{onlineStatus === 'ONLINE' ? 'ONLINE (ACCEPTING) 🟢' : onlineStatus === 'BUSY' ? 'ON TRANSIT 🟡' : 'OFFLINE 🔴'}</span>
          </button>
        </div>

        {/* Rider Today Payout & Earnings Summary (SRS Section 31) */}
        <div className="rider-stat-grid">
          <div style={{ background: '#FAF9FC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #ECEAF2' }}>
            <span style={{ fontSize: '11px', color: '#6B6878', textTransform: 'uppercase', fontWeight: 700 }}>Today's Trips</span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#12101B', marginTop: '2px' }}>
              {completedToday.length + 14} Deliveries
            </div>
            <span style={{ fontSize: '10px', color: '#1FAF6E', fontWeight: 600 }}>100% On-time</span>
          </div>

          <div style={{ background: '#FAF9FC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #ECEAF2' }}>
            <span style={{ fontSize: '11px', color: '#6B6878', textTransform: 'uppercase', fontWeight: 700 }}>Base Earnings</span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#12101B', marginTop: '2px' }}>
              ₹650
            </div>
            <span style={{ fontSize: '10px', color: '#6B6878' }}>₹40 / drop</span>
          </div>

          <div style={{ background: '#FAF9FC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #ECEAF2' }}>
            <span style={{ fontSize: '11px', color: '#6B6878', textTransform: 'uppercase', fontWeight: 700 }}>Distance Bonus</span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#12101B', marginTop: '2px' }}>
              ₹120
            </div>
            <span style={{ fontSize: '10px', color: '#6B6878' }}>2.4 km avg trip</span>
          </div>

          <div style={{ background: '#FAF9FC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #ECEAF2' }}>
            <span style={{ fontSize: '11px', color: '#6B6878', textTransform: 'uppercase', fontWeight: 700 }}>Total Payout</span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#1FAF6E', marginTop: '2px' }}>
              ₹850
            </div>
            <span style={{ fontSize: '10px', color: '#1FAF6E', fontWeight: 700 }}>Direct Bank Transfer</span>
          </div>
        </div>
      </div>

      {/* 1. New Orders Ready for Dispatch Acceptance (SRS Section 24 & 25) */}
      {availableForAcceptance.length > 0 && onlineStatus !== 'OFFLINE' && (
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#12101B', margin: 0 }}>
              Incoming Delivery Dispatches (Ready at Dark Store)
            </h2>
            <span style={{ background: '#E4F8ED', color: '#1FAF6E', padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 800 }}>
              {availableForAcceptance.length} Available
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {availableForAcceptance.map(order => (
              <div
                key={order.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '2px solid #8E5CF7',
                  padding: '20px',
                  boxShadow: '0 6px 20px rgba(142, 92, 247, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#12101B' }}>
                      Order #{order.id}
                    </span>
                    <span style={{ fontSize: '11px', background: 'rgba(142, 92, 247, 0.15)', color: '#7C3AED', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                      PICKUP READY
                    </span>
                    {order.bagSealNumber && (
                      <span style={{ fontSize: '11px', color: '#6B6878', fontFamily: 'monospace' }}>
                        Bag: {order.bagSealNumber}
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '13px', color: '#12101B', marginTop: '6px', fontWeight: 600 }}>
                    🏪 Pickup: <strong>{order.storeName}</strong> ➔ 📍 Drop: <strong>{order.address?.line || order.areaName}</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B6878', marginTop: '4px' }}>
                    Customer: {order.customerName} • Est. Distance: <strong>2.4 Km</strong> • Est. Trip Payout: <strong style={{ color: '#1FAF6E' }}>₹55</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleAcceptDispatch(order.id)}
                    style={{
                      background: 'var(--gradient-brand)',
                      color: '#FFFFFF',
                      padding: '10px 22px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(232, 67, 147, 0.35)'
                    }}
                  >
                    Accept Dispatch
                  </button>
                  <button
                    onClick={() => handleDeclineDispatch(order.id)}
                    style={{
                      background: '#F1F0F5',
                      color: '#6B6878',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: '1px solid #ECEAF2',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Decline / Pass
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Active In-Transit Deliveries (SRS Section 26–29) */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#12101B', margin: '0 0 14px 0' }}>
          Active In-Transit Deliveries ({riderActiveDeliveries.length})
        </h2>

        {riderActiveDeliveries.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '50px 20px',
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #ECEAF2'
          }}>
            <Icon name="bike" size={36} color="#D1CDDC" />
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#12101B', margin: '12px 0 4px 0' }}>
              No active deliveries right now
            </h3>
            <p style={{ fontSize: '12px', color: '#6B6878', margin: 0 }}>
              Stay ONLINE to receive automated 10-minute dark store dispatch calls.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {riderActiveDeliveries.map(order => (
              <div
                key={order.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1.5px solid #ECEAF2',
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: '#12101B' }}>
                        Order #{order.id}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        fontWeight: 800,
                        background: order.status === 'RIDER_ASSIGNED' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: order.status === 'RIDER_ASSIGNED' ? '#0284C7' : '#2563EB'
                      }}>
                        {order.status === 'RIDER_ASSIGNED' ? '🚴 DISPATCH ACCEPTED — GO TO STORE' : '🚀 OUT FOR DELIVERY (<10 MINS)'}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B6878', marginTop: '3px' }}>
                      Target Delivery Window: <strong>{order.eta}</strong> • Store: <strong>{order.storeName}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#6B6878' }}>Customer Payment</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1FAF6E' }}>₹{order.grandTotal} (PAID UPI)</div>
                  </div>
                </div>

                {/* Delivery Location & Navigation Bar (SRS Section 27 & 28) */}
                <div style={{
                  background: '#FAF9FC',
                  borderRadius: '12px',
                  border: '1px solid #ECEAF2',
                  padding: '14px 18px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6B6878', textTransform: 'uppercase', fontWeight: 700 }}>
                      Drop-off Address
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#12101B', marginTop: '2px' }}>
                      {order.address?.line || 'Adani Pratham, Ahmedabad'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B6878' }}>
                      Customer: {order.customerName} ({order.customerPhone})
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address?.line || order.areaName + ' Ahmedabad')}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: '#12101B',
                      color: '#FFFFFF',
                      textDecoration: 'none',
                      fontSize: '12px',
                      fontWeight: 700
                    }}
                  >
                    <Icon name="navigation" size={14} /> Open Live Map
                  </a>
                </div>

                {/* Store Pickup step vs Customer Doorstep OTP (SRS Section 26 & 29) */}
                {order.status === 'OUT_FOR_DELIVERY' && (
                  <div style={{
                    background: '#1A1728',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    marginBottom: '16px',
                    border: '1.5px solid #3B82F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    color: '#FFFFFF'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(59, 130, 246, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px'
                      }}>
                        🛰️
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#60A5FA' }}>
                          Live GPS Broadcaster Active
                        </div>
                        <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                          Streaming to Customer: Lat {currentGps.lat.toFixed(4)}, Lng {currentGps.lng.toFixed(4)} • {currentGps.speed} km/h
                        </div>
                      </div>
                    </div>

                    {/* Quick GPS nudge controller for dev/testing */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Test GPS Transit:</span>
                      <button
                        type="button"
                        onClick={() => handleNudgeGps(order.id, 0.0012, 0.0018)}
                        style={{
                          background: '#2563EB',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '5px 10px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Advance +200m ➔
                      </button>
                    </div>
                  </div>
                )}

                {order.status === 'RIDER_ASSIGNED' ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#F0EEF8',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#7C3AED', fontSize: '14px' }}>
                        Step 1: Dark Store Bag Handover
                      </div>
                      <div style={{ fontSize: '12px', color: '#6B6878', marginTop: '2px' }}>
                        Show QR code or Order #{order.id} to store staff, verify bag seal <strong>{order.bagSealNumber || 'BAG-BOP'}</strong>.
                      </div>
                    </div>
                    <button
                      onClick={() => handlePickupFromStore(order.id)}
                      style={{
                        background: '#7C3AED',
                        color: '#FFFFFF',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 800,
                        fontSize: '13px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                      }}
                    >
                      ✓ Confirm Store Pickup (Scan QR)
                    </button>
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#F4FBF7',
                    border: '1.5px solid rgba(31, 175, 110, 0.4)',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    flexWrap: 'wrap',
                    gap: '14px'
                  }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#1FAF6E', fontSize: '14px' }}>
                        Step 2: Doorstep 4-Digit Delivery OTP
                      </div>
                      <div style={{ fontSize: '12px', color: '#6B6878', marginTop: '2px' }}>
                        Hand over fresh vegetables to customer and ask for their 4-digit verification code.
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', width: '100%', maxWidth: '440px' }}>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="4-digit OTP"
                        value={otpInputs[order.id] || ''}
                        onChange={(e) => setOtpInputs({ ...otpInputs, [order.id]: e.target.value })}
                        style={{
                          width: '100px',
                          padding: '10px',
                          textAlign: 'center',
                          borderRadius: '8px',
                          border: '2px solid #1FAF6E',
                          fontSize: '16px',
                          fontWeight: 900,
                          letterSpacing: '2px',
                          background: '#FFFFFF',
                          flex: '0 0 100px'
                        }}
                      />
                      <button
                        onClick={() => handleOtpVerify(order.id)}
                        style={{
                          background: '#1FAF6E',
                          color: '#FFFFFF',
                          padding: '10px 18px',
                          borderRadius: '8px',
                          border: 'none',
                          fontWeight: 800,
                          fontSize: '13px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(31, 175, 110, 0.3)',
                          flex: '1 1 180px'
                        }}
                      >
                        Verify & Complete Delivery
                      </button>
                      <button
                        onClick={() => setFailedModalOrder(order)}
                        style={{
                          background: 'transparent',
                          color: '#EF4444',
                          border: '1px solid #EF4444',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '11px',
                          cursor: 'pointer',
                          flex: '0 0 auto'
                        }}
                      >
                        Report Issue
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Failed Delivery Report Modal (SRS Section 30) */}
      {failedModalOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10, 8, 20, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <form
            onSubmit={handleReportFailed}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '420px',
              boxShadow: '0 12px 36px rgba(0,0,0,0.2)'
            }}
          >
            <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 6px 0', color: '#12101B' }}>
              Report Delivery Issue (Order #{failedModalOrder.id})
            </h3>
            <p style={{ fontSize: '12px', color: '#EF4444', margin: '0 0 16px 0' }}>
              Select accurate reason for delivery attempt failure
            </p>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#12101B', display: 'block', marginBottom: '6px' }}>
                Failure Reason *
              </label>
              <select
                value={failureReason}
                onChange={(e) => setFailureReason(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #EF4444', borderRadius: '8px', fontSize: '13px' }}
              >
                <option value="Customer unavailable">Customer unavailable at address</option>
                <option value="Wrong address">Wrong or incomplete delivery address</option>
                <option value="Phone unreachable">Customer phone unreachable</option>
                <option value="Customer cancelled">Customer cancelled at doorstep</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setFailedModalOrder(null)}
                style={{ padding: '8px 14px', borderRadius: '6px', background: 'transparent', border: '1px solid #D1CDDC', cursor: 'pointer', fontSize: '12px' }}
              >
                Back
              </button>
              <button
                type="submit"
                style={{ padding: '8px 18px', borderRadius: '6px', background: '#EF4444', color: '#FFFFFF', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '12px' }}
              >
                Record Failed Attempt
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
