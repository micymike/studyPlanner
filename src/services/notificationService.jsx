import React from 'react';
import toast from 'react-hot-toast';

class NotificationService {
  constructor() {
    this.swRegistration = null;
    this.isSupported = 'serviceWorker' in navigator && 'Notification' in window;
  }

  // Check if notifications are supported
  isNotificationSupported() {
    return this.isSupported;
  }

  // Request notification permission
  async requestPermission() {
    if (!this.isSupported) {
      console.warn('Notifications not supported');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Register service worker
  async registerServiceWorker() {
    if (!this.isSupported) return null;

    try {
      this.swRegistration = await navigator.serviceWorker.register('/notification-sw.js');
      console.log('Service Worker Registered', this.swRegistration);
      return this.swRegistration;
    } catch (error) {
      console.error('Service Worker Registration Failed', error);
      return null;
    }
  }

  // Send a notification
  sendNotification(title, options = {}) {
    // If browser supports notifications and permission is granted
    if (this.isSupported && Notification.permission === 'granted') {
      // For foreground notifications
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{title}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {options.body || 'You have a new notification'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ));

      // For background notifications (if service worker is registered)
      if (this.swRegistration) {
        this.swRegistration.showNotification(title, {
          body: options.body || 'You have a new notification',
          icon: options.icon || '/favicon.ico',
          ...options
        });
      }
    }
  }

  // Schedule a notification
  scheduleNotification(title, options = {}, delay = 0) {
    setTimeout(() => {
      this.sendNotification(title, options);
    }, delay);
  }

  // Example methods for specific notification types
  notifyAssignmentDue(assignment) {
    this.sendNotification('Assignment Due Soon', {
      body: `${assignment.title} is due on ${assignment.due_date}`,
      icon: '/assignment-icon.png'
    });
  }

  notifyClassReminder(classSession) {
    this.sendNotification('Upcoming Class', {
      body: `${classSession.name} starts at ${classSession.time}`,
      icon: '/class-icon.png'
    });
  }

  notifyEventReminder(event) {
    this.sendNotification('Event Reminder', {
      body: `${event.title} is happening on ${event.date} at ${event.time}`,
      icon: '/event-icon.png'
    });
  }
}

export default new NotificationService();
