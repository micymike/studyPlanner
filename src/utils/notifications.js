/**
 * Utility functions for browser notifications
 */

// Check if browser notifications are supported
export const isNotificationsSupported = () => {
  return 'Notification' in window;
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!isNotificationsSupported()) {
    return { granted: false, reason: 'not-supported' };
  }

  try {
    const permission = await Notification.requestPermission();
    return { granted: permission === 'granted', reason: permission };
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return { granted: false, reason: 'error' };
  }
};

// Show a notification
export const showNotification = (title, options = {}) => {
  if (!isNotificationsSupported()) {
    console.warn('Notifications not supported');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return null;
  }

  try {
    const notification = new Notification(title, options);
    return notification;
  } catch (error) {
    console.error('Error showing notification:', error);
    return null;
  }
};

// Schedule a notification for a future time
export const scheduleNotification = (title, time, options = {}) => {
  if (!isNotificationsSupported()) {
    console.warn('Notifications not supported');
    return null;
  }

  const now = new Date().getTime();
  const scheduledTime = new Date(time).getTime();
  
  if (scheduledTime <= now) {
    console.warn('Cannot schedule notification in the past');
    return null;
  }

  const timeoutId = setTimeout(() => {
    showNotification(title, options);
  }, scheduledTime - now);

  return timeoutId;
};

// Cancel a scheduled notification
export const cancelScheduledNotification = (timeoutId) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
    return true;
  }
  return false;
};
