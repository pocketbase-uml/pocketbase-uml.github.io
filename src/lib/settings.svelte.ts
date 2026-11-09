import { browser } from '$app/env';
import { LOCAL_STORAGE_SETTINGS_KEY } from './config';

export type Settings = {
  direction: 'down' | 'right';
  algorithm: 'longest-path' | 'tight-tree';
  showSystemAttributes: boolean;
  markRequiredAttributes: boolean;
  showSelectValues: boolean;
};

export const defaultSettings: Settings = {
  algorithm: 'longest-path',
  direction: 'down',
  showSystemAttributes: false,
  markRequiredAttributes: true,
  showSelectValues: true
};

function loadSettings(): Settings {
  if (!browser) return { ...defaultSettings };
  try {
    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY) || '{}');
    return { ...defaultSettings, ...stored };
  } catch {
    return { ...defaultSettings };
  }
}

/** Diagram settings, persisted to localStorage */
export const settings: Settings = $state(loadSettings());

if (browser) {
  $effect.root(() => {
    $effect(() => {
      try {
        localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
      } catch {
        // Storage may be unavailable (private mode, quota, etc.); settings just won't persist
      }
    });
  });
}

export const DIRECTIONS = [
  { value: 'down', title: 'Vertical' },
  { value: 'right', title: 'Horizontal' }
];

export const ALGORITHMS = [
  { value: 'longest-path', title: 'Longest path' },
  { value: 'tight-tree', title: 'Tight tree' }
];
