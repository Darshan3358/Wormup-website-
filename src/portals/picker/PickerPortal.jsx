import React from 'react';
import { StorePickerView } from '../../components/store/StorePickerView';

export const PickerPortal = () => {
  return (
    <div className="picker-portal animate-fade-up">
      <StorePickerView />
    </div>
  );
};
