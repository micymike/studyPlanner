/**
 * Utility functions for working with localStorage
 */

// Get an item from localStorage with optional default value
export const getItem = (key, defaultValue = null) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Set an item in localStorage
export const setItem = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage:`, error);
    return false;
  }
};

// Remove an item from localStorage
export const removeItem = (key) => {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
    return false;
  }
};

// Clear all items from localStorage
export const clear = () => {
  try {
    window.localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

// Storage keys
export const STORAGE_KEYS = {
  DARK_MODE: 'darkMode',
  USER_PROFILE: 'userProfile',
  REMINDERS: 'reminders',
  GROUP_NOTES: 'groupNotes',
  ASSIGNMENTS: 'assignments',
  CLASSES: 'classes',
  EVENTS: 'events',
  FILES: 'files',
};
