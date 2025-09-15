import React from 'react';
import { useNotifications } from '../../hooks/useNotifications.ts';
import { CheckCircle, XCircle } from 'lucide-react';

const NotificationToastContainer = () => {
  const { notifications } = useNotifications();

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {notifications.map((notification) => (
        <NotificationToast key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

const NotificationToast = ({ notification }) => {
    return (
        <div
          className={`card flex items-center gap-4 animate-enter animate-leave ${
            notification.type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            {notification.type === 'success' ? 
                <CheckCircle className="w-6 h-6 text-green-400" /> : 
                <XCircle className="w-6 h-6 text-red-400" />
            }
          <p className="text-white">{notification.message}</p>
        </div>
    )
}

export default NotificationToastContainer;