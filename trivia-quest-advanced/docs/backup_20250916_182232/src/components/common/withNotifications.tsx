import { ComponentType } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationType } from '../../context/NotificationContextValue';

interface WithNotificationsProps {
  addNotification: (_message: string, _type?: NotificationType, _duration?: number) => void;
}

export function withNotifications<T extends WithNotificationsProps>(WrappedComponent: ComponentType<T>) {
  const ComponentWithNotifications = (props: Omit<T, keyof WithNotificationsProps>) => {
    const { addNotification } = useNotifications();
    return <WrappedComponent {...(props as T)} addNotification={addNotification} />;
  };
  ComponentWithNotifications.displayName = `WithNotifications(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return ComponentWithNotifications;
}
