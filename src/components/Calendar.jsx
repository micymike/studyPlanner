import * as React from 'react';
import { useState } from 'react';
import { Calendar , Clock, BookOpen, AlertTriangle, X, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';

const CalendarView = ({ events, classes, assignments, onDataChange }) => {
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    type: 'other',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();

  const getEventsForDay = (day) => {
    const date = new Date(currentYear, today.getMonth(), day);
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() === currentYear
      );
    });
  };

  const getAssignmentsForDay = (day) => {
    const date = new Date(currentYear, today.getMonth(), day);
    return assignments.filter((assignment) => {
      const dueDate = new Date(assignment.due_date);
      return (
        dueDate.getDate() === day &&
        dueDate.getMonth() === today.getMonth() &&
        dueDate.getFullYear() === currentYear
      );
    });
  };

  const getClassesForDay = (day) => {
    const date = new Date(currentYear, today.getMonth(), day);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[date.getDay()];
    return classes.filter((cls) => cls.day === dayName);
  };

  const handleAddEvent = async () => {
    if (newEvent.title || newEvent.date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create a new event with a UUID
      const eventToAdd = {
        id: uuidv4(),
        title: newEvent.title,
        date: newEvent.date,
        type: newEvent.type,
        description: newEvent.description || null
      };

      // Add to Supabase
      const { error } = await supabase
        .from('events')
        .insert([eventToAdd]);

      if (error) throw error;

      // Refresh data from App.tsx
      onDataChange();
      
      // Reset form and close modal
      setNewEvent({
        title: '',
        date: new Date().toISOString().split('T')[0],
        type: 'other',
        description: ''
      });
      setShowAddEventModal(false);
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      // Refresh data from App.tsx
      onDataChange();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{currentMonth} {currentYear}</h2>
          <p className="text-gray-500">Plan your academic schedule</p>
        </div>
        <button 
          onClick={() => setShowAddEventModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        {daysInMonth.map(day => {
          const dayEvents = getEventsForDay(day);
          const dayAssignments = getAssignmentsForDay(day);
          const dayClasses = getClassesForDay(day);
          const isToday = day === today.getDate();

          return (
            <div
              key={day}
              className={`bg-white rounded-lg shadow p-3 min-h-[120px] ${
                isToday ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              
              <div className="text-right text-sm text-gray-500 mb-2">{day}</div>
              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded flex justify-between items-center ${
                      event.type === 'exam' ? 'bg-red-100 text-red-800' :
                      event.type === 'cat' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}
                  >
                    <span className="truncate">{event.title}</span>
                    <button 
                      onClick={() => handleDeleteEvent(event.id)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {dayAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="text-xs p-1 rounded bg-green-100 text-green-800"
                  >
                    {assignment.title}
                  </div>
                ))}
                {dayClasses.length > 0 && (
                  <div className="text-xs p-1 rounded bg-gray-100 text-gray-800">
                    {dayClasses.length} classes
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Event</h3>
              <button 
                onClick={() => setShowAddEventModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title*
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Event title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date*
                </label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="exam">Exam</option>
                  <option value="cat">CAT</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newEvent.description || ''}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Event description"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEvent}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Event'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
