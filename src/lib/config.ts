import type { Settings } from './settings';

export const DEFAULT_ICON_SIZE = '1.25em';
export const DEFAULT_ICON_STROKE = 1.75;

export const LOCAL_STORAGE_CONNECTION_KEY = 'connection';

export const LOCAL_STORAGE_ALGORITHM_KEY = 'algorithm';
export const DEFAULT_ALGORITHM: Settings['algorithm'] = 'longest-path';
export const LOCAL_STORAGE_DIRECTION_KEY = 'direction';
export const DEFAULT_DIRECTION: Settings['direction'] = 'down';
export const LOCAL_STORAGE_SHOW_SYSTEM_ATTRIBUTES_KEY = 'show-system-attributes';
export const DEFAULT_SHOW_SYSTEM_ATTRIBUTES = false;
export const LOCAL_STORAGE_SHOW_SELECT_VALUES_KEY = 'show-select-values';
export const DEFAULT_SHOW_SELECT_VALUES = true;
export const LOCAL_STORAGE_SHOW_ATTRIBUTE_FLAGS_KEY = 'show-attribute-flags';
export const DEFAULT_SHOW_ATTRIBUTE_FLAGS = true;

export const MAX_ZOOM = 2;
export const GENERIC_DIAGRAM_MARKUP_DIRECTIVES = {
  bendSize: 0.1,
  leading: 2,
  font: '"Fira Code", monospace',
  background: '#f8f9fa',
  fill: '#fff',
  stroke: '#45485a',
  '.select': ''
};
