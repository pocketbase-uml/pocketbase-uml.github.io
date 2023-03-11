import { writable } from 'svelte/store';
import {
  DEFAULT_ALGORITHM,
  DEFAULT_DIRECTION,
  DEFAULT_SHOW_ATTRIBUTE_FLAGS,
  DEFAULT_SHOW_SELECT_VALUES,
  DEFAULT_SHOW_SYSTEM_ATTRIBUTES,
  LOCAL_STORAGE_ALGORITHM_KEY,
  LOCAL_STORAGE_DIRECTION_KEY,
  LOCAL_STORAGE_SHOW_ATTRIBUTE_FLAGS_KEY,
  LOCAL_STORAGE_SHOW_SELECT_VALUES_KEY,
  LOCAL_STORAGE_SHOW_SYSTEM_ATTRIBUTES_KEY
} from './config';

export type Settings = {
  direction: 'down' | 'right';
  algorithm: 'longest-path' | 'tight-tree';
  showSystemAttributes: boolean;
  showAttributeFlags: boolean;
  showSelectValues: boolean;
};

export const DIRECTIONS = [
  { value: 'down', title: 'Vertical' },
  { value: 'right', title: 'Horizontal' }
];

export const ALGORITHMS = [
  { value: 'longest-path', title: 'Longest path' },
  { value: 'tight-tree', title: 'Tight tree' }
];

export const direction = writable(
  (localStorage.getItem(LOCAL_STORAGE_DIRECTION_KEY) as Settings['direction']) || DEFAULT_DIRECTION
);

direction.subscribe((v) => {
  if (v === DEFAULT_DIRECTION) {
    localStorage.removeItem(LOCAL_STORAGE_DIRECTION_KEY);
  } else {
    localStorage.setItem(LOCAL_STORAGE_DIRECTION_KEY, v);
  }
});

export const algorithm = writable(
  (localStorage.getItem(LOCAL_STORAGE_ALGORITHM_KEY) as Settings['algorithm']) || DEFAULT_ALGORITHM
);

algorithm.subscribe((v) => {
  if (v === DEFAULT_ALGORITHM) {
    localStorage.removeItem(LOCAL_STORAGE_ALGORITHM_KEY);
  } else {
    localStorage.setItem(LOCAL_STORAGE_ALGORITHM_KEY, v);
  }
});

export const showSystemAttributes = writable(
  JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_SHOW_SYSTEM_ATTRIBUTES_KEY) ||
      DEFAULT_SHOW_SYSTEM_ATTRIBUTES.toString()
  )
);

showSystemAttributes.subscribe((v) => {
  if (v === DEFAULT_SHOW_SYSTEM_ATTRIBUTES) {
    localStorage.removeItem(LOCAL_STORAGE_SHOW_SYSTEM_ATTRIBUTES_KEY);
  } else {
    localStorage.setItem(LOCAL_STORAGE_SHOW_SYSTEM_ATTRIBUTES_KEY, v.toString());
  }
});

export const showSelectValues = writable(
  JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_SHOW_SELECT_VALUES_KEY) ||
      DEFAULT_SHOW_SELECT_VALUES.toString()
  )
);

showSelectValues.subscribe((v) => {
  if (v === DEFAULT_SHOW_SELECT_VALUES) {
    localStorage.removeItem(LOCAL_STORAGE_SHOW_SELECT_VALUES_KEY);
  } else {
    localStorage.setItem(LOCAL_STORAGE_SHOW_SELECT_VALUES_KEY, v.toString());
  }
});

export const showAttributeFlags = writable(
  JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_SHOW_ATTRIBUTE_FLAGS_KEY) ||
      DEFAULT_SHOW_ATTRIBUTE_FLAGS.toString()
  )
);

showAttributeFlags.subscribe((v) => {
  if (v === DEFAULT_SHOW_ATTRIBUTE_FLAGS) {
    localStorage.removeItem(LOCAL_STORAGE_SHOW_ATTRIBUTE_FLAGS_KEY);
  } else {
    localStorage.setItem(LOCAL_STORAGE_SHOW_ATTRIBUTE_FLAGS_KEY, v.toString());
  }
});
