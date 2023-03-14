import { writable } from 'svelte/store';

export type Notification = {
  id: number;
  message: string;
};

export const notifications = writable<Notification[]>([]);

export const addNotification = (message: string) => {
  const id = Date.now();
  notifications.update((n) => [{ id, message }, ...n]);
  setTimeout(() => {
    notifications.update((n) => n.filter((n) => n.id !== id));
  }, 3000);
};
