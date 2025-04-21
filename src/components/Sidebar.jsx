import * as React from 'react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  BookOpen, 
  CheckSquare, 
  Star, 
  Search, 
  Bell, 
  FileText, 
  BarChart, 
  Paperclip, 
  AlarmClock, 
  Menu, 
  X 
} from 'lucide-react';

const sidebarItems = [
  { 
    category: 'Navigation', 
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { id: 'calendar', label: 'Calendar', icon: CalendarDays, path: '/calendar' },
      { id: 'timetable', label: 'Timetable', icon: BookOpen, path: '/timetable' },
      { id: 'assignments', label: 'Assignments', icon: CheckSquare, path: '/assignments' },
    ]
  },
  {
    category: 'Features', 
    items: [
      { id: 'search-filter', label: 'Search & Filter', icon: Search, path: '/features/search-filter' },
      { id: 'calendar-export', label: 'Calendar Export', icon: CalendarDays, path: '/features/calendar-export' },
      { id: 'notifications', label: 'Notifications', icon: Bell, path: '/features/notifications' },
      { id: 'group-notes', label: 'Group Notes', icon: FileText, path: '/features/group-notes' },
      { id: 'progress-analytics', label: 'Progress Analytics', icon: BarChart, path: '/features/progress-analytics' },
      { id: 'file-attachments', label: 'File Attachments', icon: Paperclip, path: '/features/file-attachments' },
      { id: 'reminders', label: 'Reminders', icon: AlarmClock, path: '/features/reminders' },
    ]
  }
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        onClick={toggleSidebar} 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-100 rounded-full"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed md:relative top-0 left-0 h-full 
        w-64 bg-white shadow-lg z-40 transform transition-transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 overflow-y-auto
      `}>
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">StudyPlanner</h2>
        </div>

        {sidebarItems.map((section, index) => (
          <div key={index} className="mb-4">
            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
              {section.category}
            </h3>
            {section.items.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`
                  flex items-center px-4 py-2 text-sm 
                  ${location.pathname === item.path 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100'}
                `}
                onClick={toggleSidebar}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
