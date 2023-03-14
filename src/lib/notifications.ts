import { writable } from 'svelte/store';
import { MAX_VISIBLE_NOTIFICATIONS, NOTIFICATION_TIMEOUT } from './config';

export type Notification = {
  id: number;
  message: string;
};

export const notifications = writable<Notification[]>([]);

export const addNotification = (message: string) => {
  const id = Date.now();
  notifications.update((n) => [{ id, message }, ...n.slice(0, MAX_VISIBLE_NOTIFICATIONS - 1)]);
  setTimeout(() => {
    notifications.update((n) => n.filter((n) => n.id !== id));
  }, NOTIFICATION_TIMEOUT);
};
