import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Roles: 'CUSTOMER' | 'ADMIN' | 'STORE' | 'RIDER'
  const [currentRole, setCurrentRole] = useState('CUSTOMER');
  
  // Admin sub-tabs: 'dashboard' | 'area-prices' | 'inventory' | 'email-campaigns' | 'orders'
  const [adminTab, setAdminTab] = useState('dashboard');

  // Customer sub-view: 'shop' | 'tracking'
  const [customerView, setCustomerView] = useState('shop');

  // Toast / notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info', duration = 3500) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  // Mock user profile with saved addresses matching Blinkit screenshot
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('womup_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'Ayushi Thanki',
      phone: '+91 98765 43210',
      email: 'ayushi@womup.com',
      addresses: [
        {
          id: 'addr_home',
          label: 'Home',
          line: 'Tower S2, 202, Floor 2 Adani Pratham, Tragad Rd, Ahmedabad',
          areaId: 'AREA_TRAGAD',
          area: 'Tragad',
          pincode: '382470',
          isDefault: true
        },
        {
          id: 'addr_office',
          label: 'Work',
          line: 'Level 5, Sun South Street, South Bopal, Ahmedabad',
          areaId: 'AREA_BOPAL',
          area: 'Bopal',
          pincode: '380058',
          isDefault: false
        }
      ]
    };
  });

  const deleteAddress = (addressId) => {
    setUserProfile(prev => {
      const updated = {
        ...prev,
        addresses: prev.addresses.filter(a => a.id !== addressId)
      };
      localStorage.setItem('womup_user_profile', JSON.stringify(updated));
      return updated;
    });
    showToast('Address removed', 'info');
  };

  const updateAddress = (updatedAddr) => {
    setUserProfile(prev => {
      const updated = {
        ...prev,
        addresses: prev.addresses.map(a => a.id === updatedAddr.id ? updatedAddr : a)
      };
      localStorage.setItem('womup_user_profile', JSON.stringify(updated));
      return updated;
    });
    showToast('Address updated', 'success');
  };

  const addAddress = (newAddr) => {
    setUserProfile(prev => {
      const updated = {
        ...prev,
        addresses: [...prev.addresses, newAddr]
      };
      localStorage.setItem('womup_user_profile', JSON.stringify(updated));
      return updated;
    });
    showToast('New address saved', 'success');
  };

  // SRS Section 1: Customer Users Management for Admin
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('womup_customers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'USR_101',
        name: 'Rahul Patel',
        mobile: '+91 98251 34910',
        email: 'rahul.patel@gmail.com',
        area: 'Bopal',
        areaId: 'AREA_BOPAL',
        totalOrders: 18,
        totalSpent: 8420,
        status: 'Active',
        registeredDate: '12 Jan 2026',
        lastLogin: 'Today, 10:30 AM',
        addresses: [
          { id: 'a1', label: 'Home', fullAddress: 'B-402, Applewoods Township, Shela, Bopal, Ahmedabad', pincode: '380058', area: 'Bopal', landmark: 'Near Club House', isDefault: true },
          { id: 'a2', label: 'Office', fullAddress: '4th Floor, Safal Pegasus, Prahlad Nagar, Ahmedabad', pincode: '380015', area: 'Satellite', landmark: 'Opp. Shell Petrol Pump', isDefault: false }
        ]
      },
      {
        id: 'USR_102',
        name: 'Ayushi Shah',
        mobile: '+91 98790 82145',
        email: 'ayushi.shah@outlook.com',
        area: 'Satellite',
        areaId: 'AREA_SATELLITE',
        totalOrders: 12,
        totalSpent: 5280,
        status: 'Active',
        registeredDate: '02 Feb 2026',
        lastLogin: 'Yesterday, 07:15 PM',
        addresses: [
          { id: 'a3', label: 'Home', fullAddress: '701, Indraprastha Towers, Drive-in Rd, Satellite, Ahmedabad', pincode: '380052', area: 'Satellite', landmark: 'Near Himalaya Mall', isDefault: true }
        ]
      },
      {
        id: 'USR_103',
        name: 'Darshan Mehta',
        mobile: '+91 97240 19342',
        email: 'darshan.m@yahoo.com',
        area: 'Vastrapur',
        areaId: 'AREA_VASTRAPUR',
        totalOrders: 2,
        totalSpent: 780,
        status: 'Blocked',
        registeredDate: '18 Mar 2026',
        lastLogin: '3 days ago',
        addresses: [
          { id: 'a4', label: 'Home', fullAddress: 'Flat 304, Vastrapur Heights, IIM Road, Ahmedabad', pincode: '380015', area: 'Vastrapur', landmark: 'Behind Vastrapur Lake', isDefault: true }
        ]
      },
      {
        id: 'USR_104',
        name: 'Kinjal Trivedi',
        mobile: '+91 99099 44321',
        email: 'kinjal.trivedi@gmail.com',
        area: 'SG Highway',
        areaId: 'AREA_SGHIGHWAY',
        totalOrders: 24,
        totalSpent: 11450,
        status: 'Active',
        registeredDate: '08 Dec 2025',
        lastLogin: 'Today, 02:15 PM',
        addresses: [
          { id: 'a5', label: 'Home', fullAddress: 'Villa 14, Sun City Sector 2, SG Highway, Bodakdev, Ahmedabad', pincode: '380054', area: 'SG Highway', landmark: 'Near Rajpath Club', isDefault: true }
        ]
      },
      {
        id: 'USR_105',
        name: 'Hardik Prajapati',
        mobile: '+91 98980 12345',
        email: 'hardik.p@womup.com',
        area: 'Maninagar',
        areaId: 'AREA_MANINAGAR',
        totalOrders: 7,
        totalSpent: 3190,
        status: 'Active',
        registeredDate: '22 Apr 2026',
        lastLogin: 'Today, 09:00 AM',
        addresses: [
          { id: 'a6', label: 'Home', fullAddress: 'Block C-12, Kankaria Green, Maninagar East, Ahmedabad', pincode: '380008', area: 'Maninagar', landmark: 'Gate 2 Kankaria Lake', isDefault: true }
        ]
      }
    ];
  });

  // SRS Section 12 & 19: Store Pickers List
  const [pickers, setPickers] = useState(() => {
    const saved = localStorage.getItem('womup_pickers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'PCK_01', name: 'Amit Solanki', phone: '+91 98254 99011', email: 'amit.s@womup.com', employeeCode: 'WM-PK-01', storeId: 'WM-BOP-01', storeName: 'Bopal Central', status: 'Active', joinedDate: '15 Jan 2026', ordersCompleted: 85, avgPickTime: '4.2 min', accuracy: '98.5%' },
      { id: 'PCK_02', name: 'Rajesh Varma', phone: '+91 98791 22340', email: 'raj.v@womup.com', employeeCode: 'WM-PK-02', storeId: 'WM-SAT-02', storeName: 'Satellite Hub', status: 'Active', joinedDate: '20 Jan 2026', ordersCompleted: 72, avgPickTime: '5.1 min', accuracy: '97.8%' },
      { id: 'PCK_03', name: 'Kishan Barot', phone: '+91 99042 18456', email: 'kishan.b@womup.com', employeeCode: 'WM-PK-03', storeId: 'WM-SGH-03', storeName: 'SG Highway Hub', status: 'Active', joinedDate: '01 Feb 2026', ordersCompleted: 64, avgPickTime: '3.9 min', accuracy: '99.1%' }
    ];
  });

  // SRS Section 20 & 32: Delivery Riders List
  const [riders, setRiders] = useState(() => {
    const saved = localStorage.getItem('womup_riders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'RDR_01', name: 'Rahul Sharma', phone: '+91 98250 14892', email: 'rahul.s@womup.com', vehicleType: 'EV Scooter', vehicleNumber: 'GJ-01-ET-8492', assignedStore: 'WM-BOP-01', serviceAreas: ['Bopal', 'Satellite'], status: 'Active', onlineStatus: 'ONLINE', rating: 4.9, joinedDate: '10 Jan 2026', todayDeliveries: 16, todayEarnings: 920, totalDeliveries: 485, avgDeliveryTime: '11 min', successRate: '97.8%' },
      { id: 'RDR_02', name: 'Vikram Zala', phone: '+91 97241 83920', email: 'vikram.z@womup.com', vehicleType: 'Motorcycle', vehicleNumber: 'GJ-01-KM-4219', assignedStore: 'WM-SAT-02', serviceAreas: ['Satellite', 'Vastrapur'], status: 'Active', onlineStatus: 'ONLINE', rating: 4.8, joinedDate: '22 Jan 2026', todayDeliveries: 14, todayEarnings: 810, totalDeliveries: 390, avgDeliveryTime: '12 min', successRate: '98.2%' },
      { id: 'RDR_03', name: 'Chetan Parmar', phone: '+91 99130 55678', email: 'chetan.p@womup.com', vehicleType: 'EV Scooter', vehicleNumber: 'GJ-01-ET-1102', assignedStore: 'WM-SGH-03', serviceAreas: ['SG Highway', 'Bodakdev'], status: 'Active', onlineStatus: 'BUSY', rating: 4.9, joinedDate: '05 Feb 2026', todayDeliveries: 19, todayEarnings: 1040, totalDeliveries: 512, avgDeliveryTime: '10 min', successRate: '99.0%' }
    ];
  });

  // Save to local storage
  React.useEffect(() => {
    localStorage.setItem('womup_customers', JSON.stringify(users));
  }, [users]);

  React.useEffect(() => {
    localStorage.setItem('womup_pickers', JSON.stringify(pickers));
  }, [pickers]);

  React.useEffect(() => {
    localStorage.setItem('womup_riders', JSON.stringify(riders));
  }, [riders]);

  // Admin User Actions: Block / Unblock User
  const toggleBlockUser = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Blocked' : 'Active';
        showToast(`User ${u.name} is now ${nextStatus}`, nextStatus === 'Active' ? 'success' : 'danger');
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const updateCustomer = (updatedUser) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    showToast(`Updated user profile for ${updatedUser.name}`, 'success');
  };

  const addCustomer = (newUser) => {
    setUsers(prev => [newUser, ...prev]);
    showToast(`New customer registered: ${newUser.name}`, 'success');
  };

  const toggleStaffStatus = (staffType, staffId) => {
    if (staffType === 'picker') {
      setPickers(prev => prev.map(p => p.id === staffId ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p));
    } else {
      setRiders(prev => prev.map(r => r.id === staffId ? { ...r, status: r.status === 'Active' ? 'Inactive' : 'Active' } : r));
    }
    showToast('Staff status updated', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        adminTab,
        setAdminTab,
        customerView,
        setCustomerView,
        toast,
        showToast,
        userProfile,
        setUserProfile,
        deleteAddress,
        updateAddress,
        addAddress,
        users,
        toggleBlockUser,
        updateCustomer,
        addCustomer,
        pickers,
        riders,
        toggleStaffStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
