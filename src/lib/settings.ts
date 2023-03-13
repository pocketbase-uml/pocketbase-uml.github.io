import { persisted } from 'svelte-local-storage-store';
import { LOCAL_STORAGE_SETTINGS_KEY } from './config';

export type Settings = {
  direction: 'down' | 'right';
  algorithm: 'longest-path' | 'tight-tree';
  showSystemAttributes: boolean;
  showAttributeFlags: boolean;
  showSelectValues: boolean;
};

export const defaultSettings: Settings = {
  algorithm: 'longest-path',
  direction: 'down',
  showSystemAttributes: false,
  showAttributeFlags: true,
  showSelectValues: true
};

export const settings = persisted<Settings>(LOCAL_STORAGE_SETTINGS_KEY, defaultSettings);

export const DIRECTIONS = [
  { value: 'down', title: 'Vertical' },
  { value: 'right', title: 'Horizontal' }
];

export const ALGORITHMS = [
  { value: 'longest-path', title: 'Longest path' },
  { value: 'tight-tree', title: 'Tight tree' }
];
