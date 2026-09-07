import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icons';

export const UserManager = () => {
  const { users, toggleBlockUser, updateCustomer, addCustomer, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [editFormData, setEditFormData] = useState({ name: '', email: '', mobile: '', area: '', status: 'Active' });
  const [newUserData, setNewUserData] = useState({ name: '', email: '', mobile: '', area: 'Bopal', address: '' });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.mobile.includes(searchQuery) ||
    u.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenView = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      area: user.area,
      status: user.status
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    updateCustomer({
      ...selectedUser,
      ...editFormData
    });
    setIsEditModalOpen(false);
  };

  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.mobile) {
      showToast('Name and mobile number are required', 'danger');
      return;
    }

    const newId = `USR_${Math.floor(100 + Math.random() * 900)}`;
    const createdUser = {
      id: newId,
      name: newUserData.name,
      mobile: newUserData.mobile,
      email: newUserData.email || `${newUserData.name.toLowerCase().replace(/\s+/g, '.')}@womup.com`,
      area: newUserData.area,
      areaId: `AREA_${newUserData.area.toUpperCase().replace(/\s+/g, '')}`,
      totalOrders: 0,
      totalSpent: 0,
      status: 'Active',
      registeredDate: 'Today',
      lastLogin: 'Just now',
      addresses: [
        {
          id: `addr_${Date.now()}`,
          label: 'Home',
          fullAddress: newUserData.address || `${newUserData.area}, Ahmedabad`,
          pincode: '380058',
          area: newUserData.area,
          landmark: 'Ahmedabad',
          isDefault: true
        }
      ]
    };

    addCustomer(createdUser);
    setNewUserData({ name: '', email: '', mobile: '', area: 'Bopal', address: '' });
    setIsAddModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner / Summary Card */}
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
              User & Customer Management
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
              {users.length} Registered Customers
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#9C97AE', margin: '4px 0 0 0' }}>
            Inspect customer activity, manage saved delivery addresses, and control account order access.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            background: 'var(--gradient-brand)',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '13px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(232, 67, 147, 0.35)'
          }}
        >
          <Icon name="plus" size={16} /> Register Customer
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          position: 'relative',
          flex: 1,
          minWidth: '280px',
          maxWidth: '460px'
        }}>
          <input
            type="text"
            placeholder="Search by customer name, mobile, area, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: '10px',
              background: '#151224',
              border: '1.5px solid #2E2949',
              color: '#FFFFFF',
              fontSize: '13px',
              outline: 'none'
            }}
          />
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9C97AE' }}>
            <Icon name="search" size={16} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#9C97AE' }}>
          <span>Active Users: <strong style={{ color: '#1FAF6E' }}>{users.filter(u => u.status === 'Active').length}</strong></span>
          <span>•</span>
          <span>Blocked: <strong style={{ color: '#EF4444' }}>{users.filter(u => u.status === 'Blocked').length}</strong></span>
        </div>
      </div>

      {/* Customer User Table (SRS Section 1.2) */}
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
              <th style={{ padding: '14px 18px' }}>User ID</th>
              <th style={{ padding: '14px 18px' }}>Name / Contact</th>
              <th style={{ padding: '14px 18px' }}>Delivery Area</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Total Orders</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Total Spent</th>
              <th style={{ padding: '14px 18px', textAlign: 'center' }}>Account Status</th>
              <th style={{ padding: '14px 18px' }}>Last Activity</th>
              <th style={{ padding: '14px 18px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#9C97AE' }}>
                  No customer records matched your query.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u, idx) => (
                <tr 
                  key={u.id}
                  style={{
                    borderBottom: idx === filteredUsers.length - 1 ? 'none' : '1px solid #2E2949',
                    background: idx % 2 === 0 ? '#1C1930' : '#19162B',
                    transition: 'background 0.15s'
                  }}
                >
                  <td style={{ padding: '14px 18px', fontFamily: 'monospace', fontWeight: 700, color: '#C084FC' }}>
                    {u.id}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{u.name}</div>
                    <div style={{ fontSize: '11px', color: '#9C97AE' }}>{u.mobile} • {u.email}</div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'rgba(142, 92, 247, 0.12)',
                      padding: '3px 9px',
                      borderRadius: '6px',
                      color: '#C084FC',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      <Icon name="mapPin" size={12} /> {u.area}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 700, color: '#FFFFFF' }}>
                    {u.totalOrders}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 800, color: '#1FAF6E' }}>
                    ₹{u.totalSpent.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: 800,
                      background: u.status === 'Active' ? 'rgba(31, 175, 110, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      border: `1px solid ${u.status === 'Active' ? 'rgba(31, 175, 110, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                      color: u.status === 'Active' ? '#1FAF6E' : '#EF4444'
                    }}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '12px', color: '#9C97AE' }}>
                    {u.lastLogin}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenView(u)}
                        title="View User Details"
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid #2E2949',
                          color: '#FFFFFF',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleOpenEdit(u)}
                        title="Edit User"
                        style={{
                          background: 'rgba(142, 92, 247, 0.15)',
                          border: '1px solid rgba(142, 92, 247, 0.3)',
                          color: '#C084FC',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleBlockUser(u.id)}
                        title={u.status === 'Active' ? 'Block User from ordering' : 'Unblock User'}
                        style={{
                          background: u.status === 'Active' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(31, 175, 110, 0.15)',
                          border: `1px solid ${u.status === 'Active' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(31, 175, 110, 0.3)'}`,
                          color: u.status === 'Active' ? '#EF4444' : '#1FAF6E',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          fontWeight: 700
                        }}
                      >
                        {u.status === 'Active' ? 'Block' : 'Unblock'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 1. View User Details Modal (SRS Section 1.3 & 1.4) */}
      {isViewModalOpen && selectedUser && (
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
          <div style={{
            background: '#1C1930',
            border: '1.5px solid #2E2949',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '600px',
            padding: '28px',
            color: '#FFFFFF',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#C084FC', fontFamily: 'monospace', fontWeight: 700 }}>
                  {selectedUser.id}
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '2px 0 0 0' }}>
                  {selectedUser.name}
                </h3>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#9C97AE', cursor: 'pointer' }}
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <div style={{ background: '#14121F', padding: '12px 16px', borderRadius: '10px', border: '1px solid #2E2949' }}>
                <span style={{ fontSize: '11px', color: '#9C97AE' }}>Mobile Number</span>
                <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>{selectedUser.mobile}</div>
              </div>
              <div style={{ background: '#14121F', padding: '12px 16px', borderRadius: '10px', border: '1px solid #2E2949' }}>
                <span style={{ fontSize: '11px', color: '#9C97AE' }}>Email</span>
                <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>{selectedUser.email}</div>
              </div>
              <div style={{ background: '#14121F', padding: '12px 16px', borderRadius: '10px', border: '1px solid #2E2949' }}>
                <span style={{ fontSize: '11px', color: '#9C97AE' }}>Total Orders</span>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>{selectedUser.totalOrders} Orders</div>
              </div>
              <div style={{ background: '#14121F', padding: '12px 16px', borderRadius: '10px', border: '1px solid #2E2949' }}>
                <span style={{ fontSize: '11px', color: '#9C97AE' }}>Lifetime Spend</span>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#1FAF6E', marginTop: '2px' }}>₹{selectedUser.totalSpent.toLocaleString()}</div>
              </div>
            </div>

            {/* Address Management (SRS Section 1.4) */}
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
              Saved Customer Addresses ({selectedUser.addresses?.length || 0})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {selectedUser.addresses?.map(addr => (
                <div
                  key={addr.id}
                  style={{
                    background: '#14121F',
                    border: '1px solid #2E2949',
                    borderRadius: '10px',
                    padding: '12px 16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#C084FC' }}>
                      📍 {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span style={{ fontSize: '10px', background: 'rgba(31, 175, 110, 0.2)', color: '#1FAF6E', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '13px', color: '#F5F4F8', lineHeight: 1.4 }}>
                    {addr.fullAddress}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9C97AE', marginTop: '4px' }}>
                    Pincode: {addr.pincode} • Area: {addr.area} {addr.landmark ? `• Landmark: ${addr.landmark}` : ''}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => {
                  toggleBlockUser(selectedUser.id);
                  setIsViewModalOpen(false);
                }}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  background: selectedUser.status === 'Active' ? '#EF4444' : '#1FAF6E',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '12px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {selectedUser.status === 'Active' ? 'Block Account' : 'Unblock Account'}
              </button>
              <button
                onClick={() => setIsViewModalOpen(false)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  background: '#2E2949',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '12px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Edit User Modal (SRS Section 1.3) */}
      {isEditModalOpen && selectedUser && (
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
            onSubmit={handleSaveEdit}
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
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
              Edit Customer: {selectedUser.name}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#9C97AE', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#14121F', border: '1px solid #2E2949', borderRadius: '8px', color: '#FFFFFF', fontSize: '13px' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#9C97AE', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Mobile Phone
                </label>
                <input
                  type="text"
                  value={editFormData.mobile}
                  onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#14121F', border: '1px solid #2E2949', borderRadius: '8px', color: '#FFFFFF', fontSize: '13px' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#9C97AE', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#14121F', border: '1px solid #2E2949', borderRadius: '8px', color: '#FFFFFF', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#9C97AE', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Primary Delivery Area
                </label>
                <select
                  value={editFormData.area}
                  onChange={(e) => setEditFormData({ ...editFormData, area: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#14121F', border: '1px solid #2E2949', borderRadius: '8px', color: '#FFFFFF', fontSize: '13px' }}
                >
                  <option value="Bopal">Bopal</option>
                  <option value="Satellite">Satellite</option>
                  <option value="SG Highway">SG Highway</option>
                  <option value="Vastrapur">Vastrapur</option>
                  <option value="Maninagar">Maninagar</option>
                  <option value="Tragad">Tragad</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{ padding: '9px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid #2E2949', color: '#9C97AE', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ padding: '9px 20px', borderRadius: '8px', background: 'var(--gradient-brand)', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 800 }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Register Customer Modal */}
      {isAddModalOpen && (
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
            onSubmit={handleCreateCustomer}
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
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
              Register New Customer Account
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#9C97AE', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Customer Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Patel"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#14121F', border: '1px solid #2E2949', borderRadius: '8px', color: '#FFFFFF', fontSize: '13px' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#9C97AE', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Mobile Number (OTP Verified) *
                </label>
                <input
                  type="text"
                  placeholder="+91 98XXX XXXXX"
                  value={newUserData.mobile}
                  onChange={(e) => setNewUserData({ ...newUserData, mobile: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#14121F', border: '1px solid #2E2949', borderRadius: '8px', color: '#FFFFFF', fontSize: '13px' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#9C97AE', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="ramesh@gmail.com"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#14121F', border: '1px solid #2E2949', borderRadius: '8px', color: '#FFFFFF', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#9C97AE', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  DarkStore Delivery Area *
                </label>
                <select
                  value={newUserData.area}
                  onChange={(e) => setNewUserData({ ...newUserData, area: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#14121F', border: '1px solid #2E2949', borderRadius: '8px', color: '#FFFFFF', fontSize: '13px' }}
                >
                  <option value="Bopal">Bopal Central (WM-BOP-01)</option>
                  <option value="Satellite">Satellite Hub (WM-SAT-02)</option>
                  <option value="SG Highway">SG Highway (WM-SGH-03)</option>
                  <option value="Vastrapur">Vastrapur (WM-VAS-04)</option>
                  <option value="Maninagar">Maninagar (WM-MAN-05)</option>
                  <option value="Tragad">Tragad (WM-TRG-06)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#9C97AE', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Default Delivery Address
                </label>
                <textarea
                  placeholder="House/Flat No, Apartment, Street, Ahmedabad"
                  rows={2}
                  value={newUserData.address}
                  onChange={(e) => setNewUserData({ ...newUserData, address: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#14121F', border: '1px solid #2E2949', borderRadius: '8px', color: '#FFFFFF', fontSize: '13px', resize: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                style={{ padding: '9px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid #2E2949', color: '#9C97AE', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ padding: '9px 20px', borderRadius: '8px', background: 'var(--gradient-brand)', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 800 }}
              >
                Activate Account
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
