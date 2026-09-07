/**
 * Womup Role-Based Access Control (RBAC) Module
 * Enforces explicit permissions across Admin, Picker, Rider, and Customer roles.
 */

export const ROLES = {
  ADMIN: 'ADMIN',
  PICKER: 'PICKER',
  RIDER: 'RIDER',
  CUSTOMER: 'CUSTOMER'
};

export const PERMISSIONS = {
  ADMIN: [
    'users.manage',
    'products.manage',
    'prices.manage',
    'inventory.manage',
    'orders.manage',
    'pickers.manage',
    'riders.manage',
    'emails.manage',
    'reports.view'
  ],

  PICKER: [
    'orders.viewAssigned',
    'orders.pick',
    'orders.weigh',
    'orders.qualityCheck',
    'orders.pack'
  ],

  RIDER: [
    'orders.viewAssigned',
    'orders.accept',
    'orders.pickup',
    'orders.location',
    'orders.deliver'
  ],

  CUSTOMER: [
    'profile.manage',
    'cart.manage',
    'orders.create',
    'orders.viewOwn'
  ]
};

/**
 * Check if a role possesses a specific permission
 * @param {string} role 
 * @param {string} permission 
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
  if (!role || !PERMISSIONS[role]) return false;
  return PERMISSIONS[role].includes(permission);
};
