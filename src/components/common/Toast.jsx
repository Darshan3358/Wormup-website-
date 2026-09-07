import React from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from './Icons';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const bgColors = {
    success: 'rgba(16, 185, 129, 0.95)',
    info: 'rgba(6, 182, 212, 0.95)',
    warning: 'rgba(245, 158, 11, 0.95)',
    danger: 'rgba(239, 68, 68, 0.95)'
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      maxWidth: 'calc(100vw - 40px)',
      zIndex: 300,
      background: bgColors[toast.type] || bgColors.info,
      color: '#000000',
      padding: '10px 16px',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-pop)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontWeight: 700,
      fontSize: '13px',
      animation: 'slideInUp 0.25s ease-out'
    }}>
      <Icon name={toast.type === 'danger' ? 'alertTriangle' : 'checkCircle'} size={18} />
      <span>{toast.message}</span>
    </div>
  );
};
