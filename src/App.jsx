import React, { useState } from 'react';
import { RouterProvider, useRouter } from './navigation/RouterContext';
import { AppProvider } from './context/AppContext';
import { LocationProvider } from './context/LocationContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';

import { PortalHeader } from './navigation/PortalHeader';
import { Navbar } from './components/common/Navbar';
import { AppRouter } from './navigation/AppRouter';

import { LocationModal } from './components/common/LocationModal';
import { AreaAlertBanner } from './components/common/AreaAlertBanner';
import { Toast } from './components/common/Toast';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';

const MainContent = () => {
  const { navigate, currentPath } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Customer app (/, /store, /track) uses light surface (--bg: #FAF9FC)
  // Admin, store picker, delivery rider (/admin, /picker, /rider) use dark surface (--bg-dark: #14121F)
  const isDarkPortal = currentPath.startsWith('/admin') || currentPath.startsWith('/picker') || currentPath.startsWith('/rider');

  React.useEffect(() => {
    if (isDarkPortal) {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
    }
  }, [isDarkPortal]);

  return (
    <div 
      className={isDarkPortal ? 'theme-dark' : ''}
      style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: isDarkPortal ? 'var(--bg-dark)' : 'var(--bg)',
        color: isDarkPortal ? 'var(--text-primary-dark)' : 'var(--text-primary)',
        transition: 'background-color 0.25s var(--ease-brand)'
      }}
    >
      {/* Staff Portals Top Operations Switcher (Shown ONLY in staff views /admin, /picker, /rider) */}
      {isDarkPortal && <PortalHeader />}

      {/* Main Navigation Header */}
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Area Change Notification for Cart */}
      <AreaAlertBanner />

      {/* Main Dynamic Router Content */}
      <main className="container" style={{ flex: 1 }}>
        <AppRouter searchQuery={searchQuery} />
      </main>

      {/* Global Modals & Drawers */}
      <LocationModal />
      <CartDrawer onProceedCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={(orderId) => navigate(orderId ? `/orders/${orderId}` : '/orders')}
      />
      <Toast />

      {/* Footer with Direct Links */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px 0',
        background: 'var(--bg-main)',
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--text-muted)',
        marginTop: 'auto'
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
            <img src="/womup-logo.png" alt="WOMUP" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
            <p>© 2026 <strong>WOMUP</strong> Quick-Commerce. Dedicated portals with distinct URLs.</p>
          </div>
          <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '11px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Direct Links:</span>
            <a href="/" style={{ color: 'var(--accent-fresh)', textDecoration: 'none', fontWeight: 600 }}>/store</a>
            <a href="/admin" style={{ color: '#C084FC', textDecoration: 'none', fontWeight: 600 }}>/admin</a>
            <a href="/picker" style={{ color: '#FBBF24', textDecoration: 'none', fontWeight: 600 }}>/picker</a>
            <a href="/rider" style={{ color: '#38BDF8', textDecoration: 'none', fontWeight: 600 }}>/rider</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <RouterProvider>
      <AppProvider>
        <LocationProvider>
          <ProductProvider>
            <CartProvider>
              <OrderProvider>
                <MainContent />
              </OrderProvider>
            </CartProvider>
          </ProductProvider>
        </LocationProvider>
      </AppProvider>
    </RouterProvider>
  );
}

export default App;
