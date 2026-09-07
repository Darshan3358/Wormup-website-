import React from 'react';
import { useRouter } from './RouterContext';
import { StorePortal } from '../portals/store/StorePortal';
import { AdminPortal } from '../portals/admin/AdminPortal';
import { PickerPortal } from '../portals/picker/PickerPortal';
import { RiderPortal } from '../portals/rider/RiderPortal';
import { OrderHistory } from '../components/customer/OrderHistory';
import { OrderTracking } from '../components/customer/OrderTracking';
import { ProductDetail } from '../components/customer/ProductDetail';

export const AppRouter = ({ searchQuery }) => {
  const { currentPath } = useRouter();

  // Route matching: Staff Portals (Auth / Operations)
  if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
    return <AdminPortal />;
  }

  if (currentPath === '/picker' || currentPath.startsWith('/picker/')) {
    return <PickerPortal />;
  }

  if (currentPath === '/rider' || currentPath.startsWith('/rider/')) {
    return <RiderPortal />;
  }

  // Customer Orders List (Order History)
  if (currentPath === '/orders' || currentPath === '/orders/') {
    return <OrderHistory />;
  }

  // Customer Live Order Tracking (e.g. /orders/WM10231 or /track legacy fallback)
  if (currentPath.startsWith('/orders/') || currentPath === '/track') {
    return <OrderTracking />;
  }

  // Customer Product Detail Page (/product/:id or /product/:slug)
  if (currentPath.startsWith('/product/')) {
    return <ProductDetail />;
  }

  // Default: Customer Storefront Portal (/ or /store)
  return <StorePortal searchQuery={searchQuery} />;
};
