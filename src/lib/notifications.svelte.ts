import { MAX_VISIBLE_NOTIFICATIONS, NOTIFICATION_TIMEOUT } from './config';

export type Notification = {
  id: number;
  message: string;
};

export const notifications: Notification[] = $state([]);

let nextId = 0;

export const addNotification = (message: string) => {
  const id = nextId++;
  notifications.unshift({ id, message });
  notifications.splice(MAX_VISIBLE_NOTIFICATIONS);
  setTimeout(() => {
    const index = notifications.findIndex((n) => n.id === id);
    if (index !== -1) notifications.splice(index, 1);
  }, NOTIFICATION_TIMEOUT);
};
