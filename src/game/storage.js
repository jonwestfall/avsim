const PREFIX = 'avsim';

export const storageKeys = {
  settings: `${PREFIX}:settings`,
  bests: `${PREFIX}:bests`,
  progress: `${PREFIX}:progress`
};

export function loadJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors to keep gameplay running.
  }
}
