import React, { createContext, useState, useCallback, useMemo, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
export const NotificationContext = createContext(null);
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = uuidv4();
    const newNotification = { id, message, type, duration };
    setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
    if (duration > 0) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    }
    return id;
  }, []);
  const dismissNotification = useCallback((id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  }, []);
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  const contextValue = useMemo(
    () => ({
      notifications,
      addNotification,
      dismissNotification,
      clearAllNotifications,
    }),
    [notifications, addNotification, dismissNotification, clearAllNotifications]
  );
  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};