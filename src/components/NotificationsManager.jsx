import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Settings } from 'lucide-react';
import { 
  isNotificationsSupported, 
  requestNotificationPermission, 
  showNotification 
} from '../utils/notifications';
import { getItem, setItem, STORAGE_KEYS } from '../utils/localStorage';

export default function NotificationsManager() {
  const [permissionState, setPermissionState] = useState('default');
  const [isEnabled, setIsEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    assignments: true,
    classes: true,
    events: true,
    reminders: true,
    notifyBefore: 30, // minutes
  });

  // Check notification permission on mount
  useEffect(() => {
    if (!isNotificationsSupported()) {
      setPermissionState('not-supported');
      return;
    }

    setPermissionState(Notification.permission);
    
    // Load notification settings from localStorage
    const savedSettings = getItem(STORAGE_KEYS.NOTIFICATIONS, null);
    if (savedSettings) {
      setSettings(savedSettings);
      setIsEnabled(savedSettings.enabled || false);
    }
  }, []);

  // Request notification permission
  const handleRequestPermission = async () => {
    const { granted, reason } = await requestNotificationPermission();
    setPermissionState(reason);
    
    if (granted) {
      setIsEnabled(true);
      const newSettings = { ...settings, enabled: true };
      setSettings(newSettings);
      setItem(STORAGE_KEYS.NOTIFICATIONS, newSettings);
      
      // Show a test notification
      showNotification('Notifications Enabled', {
        body: 'You will now receive notifications for your assignments, classes, and events.',
        icon: '/favicon.ico',
      });
    }
  };

  // Toggle notifications on/off
  const toggleNotifications = () => {
    if (permissionState !== 'granted') {
      handleRequestPermission();
      return;
    }
    
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    
    const newSettings = { ...settings, enabled: newEnabled };
    setSettings(newSettings);
    setItem(STORAGE_KEYS.NOTIFICATIONS, newSettings);
    
    if (newEnabled) {
      showNotification('Notifications Enabled', {
        body: 'You will now receive notifications for your assignments, classes, and events.',
        icon: '/favicon.ico',
      });
    }
  };

  // Update notification settings
  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    setItem(STORAGE_KEYS.NOTIFICATIONS, newSettings);
  };

  // If notifications are not supported, return null
  if (permissionState === 'not-supported') {
    return (
      <div className="px-3 py-2 bg-yellow-50 text-yellow-800 rounded-md text-sm">
        Notifications are not supported in this browser.
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
          isEnabled && permissionState === 'granted'
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        onClick={toggleNotifications}
        title={isEnabled ? 'Disable Notifications' : 'Enable Notifications'}
      >
        {isEnabled && permissionState === 'granted' ? (
          <Bell className="h-4 w-4" />
        ) : (
          <BellOff className="h-4 w-4" />
        )}
        <span>Notifications</span>
      </button>

      {permissionState === 'granted' && (
        <button
          className="ml-1 p-2 rounded-full hover:bg-gray-100"
          onClick={() => setShowSettings(!showSettings)}
          title="Notification Settings"
        >
          <Settings className="h-4 w-4 text-gray-500" />
        </button>
      )}

      {showSettings && (
        <div className="absolute top-full right-0 mt-1 bg-white shadow-lg rounded-lg p-4 z-10 w-64">
          <h3 className="font-medium text-sm mb-3">Notification Settings</h3>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.assignments}
                onChange={(e) => updateSettings({ ...settings, assignments: e.target.checked })}
              />
              <span>Assignments</span>
            </label>
            
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.classes}
                onChange={(e) => updateSettings({ ...settings, classes: e.target.checked })}
              />
              <span>Classes</span>
            </label>
            
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.events}
                onChange={(e) => updateSettings({ ...settings, events: e.target.checked })}
              />
              <span>Events</span>
            </label>
            
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.reminders}
                onChange={(e) => updateSettings({ ...settings, reminders: e.target.checked })}
              />
              <span>Reminders</span>
            </label>
          </div>
          
          <div className="mt-3">
            <label className="block text-sm mb-1">Notify before (minutes)</label>
            <input
              type="number"
              min="5"
              max="1440"
              value={settings.notifyBefore}
              onChange={(e) => updateSettings({ ...settings, notifyBefore: parseInt(e.target.value) || 30 })}
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>
          
          <div className="mt-3 pt-2 border-t border-gray-200 flex justify-end">
            <button
              className="text-xs text-gray-500 hover:text-gray-700"
              onClick={() => setShowSettings(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
