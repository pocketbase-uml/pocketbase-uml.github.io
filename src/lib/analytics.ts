import { dev } from '$app/environment';
import mixpanel from 'mixpanel-browser';
import { MIXPANEL_PROJECT_ID } from './config';
mixpanel.init(MIXPANEL_PROJECT_ID, { debug: dev });

export function log(path: string) {
  mixpanel.track(path);
}
