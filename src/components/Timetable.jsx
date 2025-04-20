import * as React from 'react';
import { useState } from 'react';
import { Clock, MapPin, User, X, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const Timetable = ({ classes, onDataChange }) => {
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newClass, setNewClass] = useState({
    course: '',
    day: 'Monday',
    start_time: '09:00',
    end_time: '10:00',
    location: '',
    instructor: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  const getClassForTimeSlot = (day, hour) => {
    return classes.find((cls) => {
      const startHour = parseInt(cls.start_time.split(':')[0]);
      return cls.day === day && startHour === hour;
    });
  };

  const handleAddClass = async () => {
    if (newClass.course || newClass.day || newClass.start_time || newClass.end_time || newClass.location || newClass.instructor) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create a new class with a UUID
      const classToAdd = {
        id: uuidv4(),
        course: newClass.course,
        day: newClass.day,
        start_time: newClass.start_time,
        end_time: newClass.end_time,
        location: newClass.location,
        instructor: newClass.instructor
      };

      // Add to Supabase
      const { error } = await supabase
        .from('class_sessions')
        .insert([classToAdd]);

      if (error) throw error;

      // Refresh data from App.tsx
      onDataChange();
      
      // Reset form and close modal
      setNewClass({
        course: '',
        day: 'Monday',
        start_time: '09:00',
        end_time: '10:00',
        location: '',
        instructor: ''
      });
      setShowAddClassModal(false);
    } catch (error) {
      console.error('Error adding class:', error);
      alert('Failed to add class. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('class_sessions')
        .delete()
        .eq('id', classId);

      if (error) throw error;

      // Refresh data from App.tsx
      onDataChange();
    } catch (error) {
      console.error('Error deleting class:', error);
      alert('Failed to delete class. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Weekly Timetable</h2>
        <button 
          onClick={() => setShowAddClassModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add Class
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Time</th>
              {days.map(day => (
                <th key={day} className="py-4 px-6 text-left text-sm font-medium text-gray-500">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(hour => (
              <tr key={hour} className="border-t border-gray-200">
                <td className="py-4 px-6 text-sm text-gray-500">
                  {hour}:00 - {hour + 1}:00
                </td>
                {days.map(day => {
                  const classSession = getClassForTimeSlot(day, hour);
                  return (
                    <td key={day} className="py-4 px-6">
                      {classSession && (
                        <div className="bg-indigo-50 p-3 rounded-lg relative group">
                          <button 
                            onClick={() => handleDeleteClass(classSession.id)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={16} />
                          </button>
                          <p className="font-medium text-indigo-700">{classSession.course}</p>
                          <div className="text-sm text-gray-500 space-y-1 mt-1">
                            <div className="flex items-center">
                              <Clock size={14} className="mr-1" />
                              {classSession.start_time} - {classSession.end_time}
                            </div>
                            <div className="flex items-center">
                              <MapPin size={14} className="mr-1" />
                              {classSession.location}
                            </div>
                            <div className="flex items-center">
                              <User size={14} className="mr-1" />
                              {classSession.instructor}
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Class</h3>
              <button 
                onClick={() => setShowAddClassModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name*
                </label>
                <input
                  type="text"
                  value={newClass.course}
                  onChange={(e) => setNewClass({...newClass, course: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. Mathematics 101"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Day*
                </label>
                <select
                  value={newClass.day}
                  onChange={(e) => setNewClass({...newClass, day: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time*
                  </label>
                  <input
                    type="time"
                    value={newClass.start_time}
                    onChange={(e) => setNewClass({...newClass, start_time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time*
                  </label>
                  <input
                    type="time"
                    value={newClass.end_time}
                    onChange={(e) => setNewClass({...newClass, end_time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location*
                </label>
                <input
                  type="text"
                  value={newClass.location}
                  onChange={(e) => setNewClass({...newClass, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. Room 101, Building A"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor*
                </label>
                <input
                  type="text"
                  value={newClass.instructor}
                  onChange={(e) => setNewClass({...newClass, instructor: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. Prof. Smith"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddClassModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddClass}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Class'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
