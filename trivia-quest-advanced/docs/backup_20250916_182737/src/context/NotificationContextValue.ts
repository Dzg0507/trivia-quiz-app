import { createContext } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'critical';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number; // Optional: duration for how long the notification should be visible
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (_message: string, _type?: NotificationType, _duration?: number) => void;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);
