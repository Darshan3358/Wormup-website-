/**
 * WOMUP Live Tracking Service
 * ----------------------------
 * Handles real-time location streaming between the Rider App (GPS emitter)
 * and Customer Tracking Screen (receiver) via BroadcastChannel and EventTarget.
 * 
 * Production architecture:
 *   Rider Mobile App -> POST /api/rider/location -> Redis / WebSocket -> Customer Browser
 * Local / Client-Side Live Sync:
 *   BroadcastChannel ('womup_live_tracking') + localStorage mirror for zero-latency cross-tab updates.
 */

const CHANNEL_NAME = 'womup_live_tracking';

// Initialize BroadcastChannel if available in browser
let broadcastChannel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel initialization error:', e);
  }
}

/**
 * Calculates straight-line / spherical distance between two coordinates in kilometers (Haversine formula).
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightKm = R * c;

  // Road factor (~1.25x for urban street networks in Indian cities like Ahmedabad)
  return parseFloat((straightKm * 1.25).toFixed(2));
}

/**
 * Calculates dynamic ETA in minutes based on real road distance and two-wheeler city speed (~20-25 km/h).
 */
export function calculateDynamicETA(distanceKm, speedKmh = 22) {
  if (!distanceKm || distanceKm <= 0.05) return 1; // Less than 50m = Arriving
  const hours = distanceKm / speedKmh;
  const minutes = Math.ceil(hours * 60) + 1; // +1 minute buffer for signals & parking
  return Math.max(1, minutes);
}

/**
 * Publishes rider's live coordinates (Called from Rider App)
 */
export function publishRiderLocation({
  orderId,
  riderId = 'RD201',
  riderName = 'Rahul Sharma',
  latitude,
  longitude,
  heading = 0,
  speed = 22,
  accuracy = 10
}) {
  if (!orderId || !latitude || !longitude) return;

  const payload = {
    orderId,
    riderId,
    riderName,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    heading: heading || 0,
    speed: speed || 20,
    accuracy: accuracy || 5,
    timestamp: Date.now()
  };

  // 1. Store latest coordinate in localStorage cache
  try {
    localStorage.setItem(`womup_loc_${orderId}`, JSON.stringify(payload));
  } catch (e) {}

  // 2. Broadcast to customer tabs
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: 'RIDER_LOCATION_UPDATE', payload });
    } catch (e) {}
  }

  // 3. Dispatch local window event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('womup:rider-location', { detail: payload })
    );
  }

  return payload;
}

/**
 * Retrieves the latest recorded rider location for an order
 */
export function getLatestRiderLocation(orderId) {
  if (!orderId || typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`womup_loc_${orderId}`);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Subscribes to live rider location updates for a specific order
 */
export function subscribeToOrderTracking(orderId, onLocationUpdate) {
  if (typeof window === 'undefined' || !orderId || typeof onLocationUpdate !== 'function') {
    return () => {};
  }

  // Check initial cache
  const cached = getLatestRiderLocation(orderId);
  if (cached) {
    onLocationUpdate(cached);
  }

  // BroadcastChannel listener (Cross-tab)
  const handleBroadcast = (event) => {
    if (
      event.data &&
      event.data.type === 'RIDER_LOCATION_UPDATE' &&
      event.data.payload?.orderId === orderId
    ) {
      onLocationUpdate(event.data.payload);
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcast);
  }

  // Local window event listener (Same tab)
  const handleLocalEvent = (event) => {
    if (event.detail && event.detail.orderId === orderId) {
      onLocationUpdate(event.detail);
    }
  };
  window.addEventListener('womup:rider-location', handleLocalEvent);

  // Return unsubscribe cleanup function
  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcast);
    }
    window.removeEventListener('womup:rider-location', handleLocalEvent);
  };
}

/**
 * Custom hook / manager to stream real device GPS in the Rider view
 */
export class DeviceGPSWatcher {
  constructor(orderId, riderProfile, onUpdate, onError) {
    this.orderId = orderId;
    this.riderProfile = riderProfile;
    this.onUpdate = onUpdate;
    this.onError = onError;
    this.watchId = null;
    this.isWatching = false;
  }

  start() {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      if (this.onError) this.onError(new Error('Geolocation is not supported by your browser'));
      return false;
    }

    if (this.isWatching) return true;

    try {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, heading, speed, accuracy } = position.coords;
          const payload = publishRiderLocation({
            orderId: this.orderId,
            riderId: this.riderProfile?.id || 'RD201',
            riderName: this.riderProfile?.name || 'Rahul Sharma',
            latitude,
            longitude,
            heading: heading || 0,
            speed: speed ? Math.round(speed * 3.6) : 22,
            accuracy: accuracy || 10
          });
          if (this.onUpdate) this.onUpdate(payload);
        },
        (err) => {
          console.warn('GPS watchPosition warning:', err);
          if (this.onError) this.onError(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 2000
        }
      );
      this.isWatching = true;
      return true;
    } catch (e) {
      if (this.onError) this.onError(e);
      return false;
    }
  }

  stop() {
    if (this.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isWatching = false;
  }
}
