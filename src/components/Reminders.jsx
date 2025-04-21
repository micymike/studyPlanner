import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Clock, Plus, Trash, Check, AlertTriangle } from 'lucide-react';
import { getItem, setItem, STORAGE_KEYS } from '../utils/localStorage';
import { scheduleNotification, cancelScheduledNotification } from '../utils/notifications';

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState('medium');
  const [showForm, setShowForm] = useState(false);

  // Load reminders from localStorage on mount
  useEffect(() => {
    const savedReminders = getItem(STORAGE_KEYS.REMINDERS, []);
    setReminders(savedReminders);
  }, []);

  // Save reminders to localStorage whenever they change
  useEffect(() => {
    setItem(STORAGE_KEYS.REMINDERS, reminders);
  }, [reminders]);

  // Check for due reminders and update their status
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updatedReminders = reminders.map(reminder => {
        if (!reminder.completed) {
          const reminderTime = new Date(`${reminder.date}T${reminder.time}`);
          if (reminderTime <= now && !reminder.notified) {
            // Mark as notified
            return { ...reminder, notified: true };
          }
        }
        return reminder;
      });
      
      if (JSON.stringify(updatedReminders) !== JSON.stringify(reminders)) {
        setReminders(updatedReminders);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [reminders]);

  // Add a new reminder
  const addReminder = () => {
    if (!title.trim()) {
      alert('Please enter a title for your reminder');
      return;
    }
    
    if (!date) {
      alert('Please select a date for your reminder');
      return;
    }
    
    if (!time) {
      alert('Please select a time for your reminder');
      return;
    }
    
    const reminderTime = new Date(`${date}T${time}`);
    if (reminderTime < new Date()) {
      alert('Cannot set a reminder in the past');
      return;
    }
    
    const newReminder = {
      id: Date.now(),
      title: title.trim(),
      date,
      time,
      priority,
      completed: false,
      notified: false,
      createdAt: new Date().toISOString(),
    };
    
    // Schedule browser notification
    const notificationTimeoutId = scheduleNotification(
      title.trim(),
      reminderTime,
      {
        body: `Reminder: ${title.trim()}`,
        icon: '/favicon.ico',
      }
    );
    
    if (notificationTimeoutId) {
      newReminder.notificationTimeoutId = notificationTimeoutId;
    }
    
    setReminders([...reminders, newReminder]);
    setTitle('');
    setDate('');
    setTime('');
    setPriority('medium');
    setShowForm(false);
  };

  // Toggle reminder completion status
  const toggleReminderStatus = (id) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, completed: !reminder.completed } 
        : reminder
    ));
  };

  // Delete a reminder
  const deleteReminder = (id) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder && reminder.notificationTimeoutId) {
      cancelScheduledNotification(reminder.notificationTimeoutId);
    }
    
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  // Format time for display
  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  // Check if a reminder is overdue
  const isOverdue = (reminder) => {
    if (reminder.completed) return false;
    
    const reminderTime = new Date(`${reminder.date}T${reminder.time}`);
    return reminderTime < new Date();
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  // Filter reminders by status
  const activeReminders = reminders.filter(reminder => !reminder.completed);
  const completedReminders = reminders.filter(reminder => reminder.completed);

  // Get today's date in YYYY-MM-DD format for the date input min value
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Bell className="h-5 w-5 mr-2 text-blue-600" />
          Reminders & To-Do List
        </h2>
        
        <button
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : (
            <>
              <Plus className="h-4 w-4" />
              <span>Add Reminder</span>
            </>
          )}
        </button>
      </div>
      
      {/* Add Reminder Form */}
      {showForm && (
        <div className="mb-4 p-3 border border-gray-200 rounded-lg">
          <h3 className="text-sm font-medium mb-2">New Reminder</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Title</label>
              <input
                type="text"
                placeholder="What do you need to remember?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <button
              className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={addReminder}
            >
              Save Reminder
            </button>
          </div>
        </div>
      )}
      
      {/* Active Reminders */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Active</h3>
        {activeReminders.length > 0 ? (
          <div className="space-y-2">
            {activeReminders.map((reminder) => (
              <div 
                key={reminder.id} 
                className={`p-3 border rounded-lg flex items-start justify-between ${
                  isOverdue(reminder) ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className={`font-medium ${isOverdue(reminder) ? 'text-red-600' : ''}`}>
                      {reminder.title}
                    </span>
                    {isOverdue(reminder) && (
                      <span className="ml-2 text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-0.5" />
                        Overdue
                      </span>
                    )}
                    <span className={`ml-2 text-xs ${getPriorityColor(reminder.priority)}`}>
                      {reminder.priority}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(reminder.date)}
                    <Clock className="h-3 w-3 mx-1" />
                    {formatTime(reminder.time)}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    className="p-1 text-gray-500 hover:text-green-600"
                    onClick={() => toggleReminderStatus(reminder.id)}
                    title="Mark as Completed"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1 text-gray-500 hover:text-red-600"
                    onClick={() => deleteReminder(reminder.id)}
                    title="Delete"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-sm text-gray-500 bg-gray-50 rounded-md">
            No active reminders. Add one to get started!
          </div>
        )}
      </div>
      
      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Completed</h3>
          <div className="space-y-2">
            {completedReminders.map((reminder) => (
              <div 
                key={reminder.id} 
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-start justify-between opacity-70"
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium line-through">{reminder.title}</span>
                    <span className={`ml-2 text-xs ${getPriorityColor(reminder.priority)}`}>
                      {reminder.priority}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(reminder.date)}
                    <Clock className="h-3 w-3 mx-1" />
                    {formatTime(reminder.time)}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    className="p-1 text-gray-500 hover:text-blue-600"
                    onClick={() => toggleReminderStatus(reminder.id)}
                    title="Mark as Active"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1 text-gray-500 hover:text-red-600"
                    onClick={() => deleteReminder(reminder.id)}
                    title="Delete"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
