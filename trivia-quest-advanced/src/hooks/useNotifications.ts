import React from 'react';
import { NotificationContext } from '../context/NotificationContextValue.ts';

export const useNotifications = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  console.log('useNotifications context:', context);
  return context;
};