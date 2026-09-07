import React, { createContext, useContext, useState, useEffect } from 'react';
import { AREAS } from '../data/mockData';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [areas, setAreas] = useState(() => {
    const saved = localStorage.getItem('womup_areas');
    return saved ? JSON.parse(saved) : AREAS;
  });

  // Default to Tragad (8 mins delivery) as featured in Blinkit screenshot
  const [selectedArea, setSelectedArea] = useState(() => {
    const saved = localStorage.getItem('womup_selected_area');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = areas.find(a => a.id === parsed.id);
        if (match) return match;
      } catch (e) {}
    }
    return areas.find(a => a.id === 'AREA_TRAGAD') || areas[0];
  });

  const [selectedAddress, setSelectedAddress] = useState(() => {
    const saved = localStorage.getItem('womup_selected_address');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      id: 'addr_home',
      label: 'Home',
      line: 'Tower S2, 202, Floor 2 Adani Pratham, Tragad Rd, Ahmedabad',
      shortLine: 'Block-P, Tragad, Ahmedabad'
    };
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  useEffect(() => {
    localStorage.setItem('womup_areas', JSON.stringify(areas));
  }, [areas]);

  useEffect(() => {
    localStorage.setItem('womup_selected_area', JSON.stringify(selectedArea));
  }, [selectedArea]);

  useEffect(() => {
    localStorage.setItem('womup_selected_address', JSON.stringify(selectedAddress));
  }, [selectedAddress]);

  const selectArea = (areaId) => {
    const found = areas.find(a => a.id === areaId);
    if (found) {
      setSelectedArea(found);
      setIsLocationModalOpen(false);
      return found;
    }
    return null;
  };

  const selectAddress = (addr) => {
    setSelectedAddress(addr);
    if (addr.areaId) {
      const match = areas.find(a => a.id === addr.areaId);
      if (match) setSelectedArea(match);
    } else if (addr.area) {
      const match = areas.find(a => a.name.toLowerCase().includes(addr.area.toLowerCase()));
      if (match) setSelectedArea(match);
    }
    setIsLocationModalOpen(false);
  };

  // Real-time GPS location detection
  const detectLiveLocation = () => {
    setIsDetectingLocation(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Real GPS coordinates acquired
          const { latitude, longitude } = position.coords;
          
          // Find nearest Ahmedabad DarkStore by distance calculation
          let nearestArea = areas[0];
          let minDistance = Infinity;

          areas.forEach(area => {
            if (area.coordinates) {
              const dLat = area.coordinates.lat - latitude;
              const dLng = area.coordinates.lng - longitude;
              const dist = Math.sqrt(dLat * dLat + dLng * dLng);
              if (dist < minDistance) {
                minDistance = dist;
                nearestArea = area;
              }
            }
          });

          setSelectedArea(nearestArea);
          setSelectedAddress({
            id: 'addr_live',
            label: 'Current Location',
            line: `GPS detected near ${nearestArea.name}, Ahmedabad`,
            shortLine: `${nearestArea.name}, Ahmedabad`
          });
          setIsDetectingLocation(false);
          setIsLocationModalOpen(false);
        },
        (error) => {
          // Fallback to high-speed DarkStore in Tragad / Bopal
          setTimeout(() => {
            const tragad = areas.find(a => a.id === 'AREA_TRAGAD') || areas[0];
            setSelectedArea(tragad);
            setSelectedAddress({
              id: 'addr_home',
              label: 'Home',
              line: 'Tower S2, 202, Floor 2 Adani Pratham, Tragad Rd, Ahmedabad',
              shortLine: 'Block-P, Tragad, Ahmedabad'
            });
            setIsDetectingLocation(false);
            setIsLocationModalOpen(false);
          }, 600);
        },
        { timeout: 4000, maximumAge: 30000 }
      );
    } else {
      setTimeout(() => {
        const tragad = areas.find(a => a.id === 'AREA_TRAGAD') || areas[0];
        setSelectedArea(tragad);
        setIsDetectingLocation(false);
        setIsLocationModalOpen(false);
      }, 600);
    }
  };

  const updateArea = (updatedArea) => {
    setAreas(prev => prev.map(a => a.id === updatedArea.id ? updatedArea : a));
    if (selectedArea.id === updatedArea.id) {
      setSelectedArea(updatedArea);
    }
  };

  const addArea = (newArea) => {
    setAreas(prev => [...prev, newArea]);
  };

  const checkServiceability = (pincode) => {
    const match = areas.find(a => a.pincode === pincode && a.serviceable);
    return match ? { serviceable: true, area: match } : { serviceable: false };
  };

  return (
    <LocationContext.Provider
      value={{
        areas,
        selectedArea,
        selectedAddress,
        selectArea,
        selectAddress,
        detectLiveLocation,
        isDetectingLocation,
        updateArea,
        addArea,
        isLocationModalOpen,
        setIsLocationModalOpen,
        checkServiceability
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
