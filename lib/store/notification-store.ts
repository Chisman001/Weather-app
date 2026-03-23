'use client';

import { create } from 'zustand';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'warning';
  time: string;
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];
  isSheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  markAllRead: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'read'>) => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [
    {
      id: '1',
      title: 'Rain expected today',
      message: 'Light rain is forecasted for the afternoon. Consider carrying an umbrella.',
      type: 'info',
      time: new Date().toISOString(),
      read: false,
    },
    {
      id: '2',
      title: 'UV Index High',
      message: 'UV index will peak at 8 between 11am–2pm. Apply sunscreen.',
      type: 'warning',
      time: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
  ],
  isSheetOpen: false,
  openSheet: () => set({ isSheetOpen: true }),
  closeSheet: () => set({ isSheetOpen: false }),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  addNotification: (n) =>
    set((state) => ({
      notifications: [
        { ...n, id: String(Date.now()), read: false },
        ...state.notifications,
      ],
    })),
}));
