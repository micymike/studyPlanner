import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import all feature components
import CalendarExport from '../components/CalendarExport';
import NotificationsManager from '../components/NotificationsManager';
import GroupNotes from '../components/GroupNotes';
import ProgressAnalytics from '../components/ProgressAnalytics';
import FileAttachments from '../components/FileAttachments';
import Reminders from '../components/Reminders';
import DarkModeToggle from '../components/DarkModeToggle';
import SearchFilter from '../components/SearchFilter';
import UserProfile from '../components/UserProfile';
import MobileResponsiveDemo from '../components/MobileResponsiveDemo';

export default function Features() {
  // Sample data for demos
  const sampleAssignments = [
    {
      id: 1,
      title: 'Math Homework',
      course: 'Mathematics',
      due_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      status: 'in_progress',
      priority: 'high',
    },

    {
      id: 2,
      title: 'History Essay',
      course: 'History',
      due_date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      status: 'not_started',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Science Project',
      course: 'Science',
      due_date: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
      status: 'completed',
      priority: 'high',
    },
    {
      id: 4,
      title: 'Literature Review',
      course: 'English',
      due_date: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
      status: 'in_progress',
      priority: 'low',
    },
  ];

  const [filteredAssignments, setFilteredAssignments] = React.useState(sampleAssignments);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl font-bold ml-4">Features</h1>
        <div className="ml-auto">
          <DarkModeToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h2 className="text-xl font-bold mb-4">New Features</h2>
            <p className="text-gray-700 mb-4">
              We've added 10 new features to enhance your learning experience. Explore them below!
            </p>
            
            <div className="flex flex-wrap gap-2">
              <a href="#calendar" className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200">
                Calendar Export
              </a>
              <a href="#notifications" className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200">
                Notifications
              </a>
              <a href="#notes" className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200">
                Group Notes
              </a>
              <a href="#analytics" className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200">
                Progress Analytics
              </a>
              <a href="#files" className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200">
                File Attachments
              </a>
              <a href="#reminders" className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200">
                Reminders
              </a>
              <a href="#search" className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200">
                Search & Filter
              </a>
              <a href="#profile" className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200">
                User Profile
              </a>
              <a href="#responsive" className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200">
                Mobile Responsive
              </a>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div id="search" className="col-span-1 md:col-span-2 mb-6">
          <h2 className="text-xl font-bold mb-4">Search & Filter</h2>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <SearchFilter 
              items={sampleAssignments} 
              onResults={setFilteredAssignments} 
              placeholder="Search assignments..."
            />
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Results ({filteredAssignments.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAssignments.map(assignment => (
                  <div key={assignment.id} className="border border-gray-200 rounded-md p-3">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{assignment.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        assignment.priority === 'high' ? 'bg-red-100 text-red-800' :
                        assignment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {assignment.priority}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{assignment.course}</div>
                    <div className="flex justify-between mt-2 text-sm">
                      <div>Due: {new Date(assignment.due_date).toLocaleDateString()}</div>
                      <div className={`${
                        assignment.status === 'completed' ? 'text-green-600' :
                        assignment.status === 'in_progress' ? 'text-blue-600' :
                        'text-gray-600'
                      }`}>
                        {assignment.status.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Export */}
        <div id="calendar" className="col-span-1 mb-6">
          <h2 className="text-xl font-bold mb-4">Calendar Export</h2>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="mb-4 text-gray-700">
              Export your assignments and events to your calendar app or Google Calendar.
            </p>
            <CalendarExport items={sampleAssignments} />
          </div>
        </div>

        {/* Notifications */}
        <div id="notifications" className="col-span-1 mb-6">
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="mb-4 text-gray-700">
              Get notified about upcoming assignments, events, and reminders.
            </p>
            <NotificationsManager />
          </div>
        </div>

        {/* Group Notes */}
        <div id="notes" className="col-span-1 md:col-span-2 mb-6">
          <h2 className="text-xl font-bold mb-4">Group Notes</h2>
          <GroupNotes />
        </div>

        {/* Progress Analytics */}
        <div id="analytics" className="col-span-1 md:col-span-2 mb-6">
          <h2 className="text-xl font-bold mb-4">Progress Analytics</h2>
          <ProgressAnalytics assignments={sampleAssignments} />
        </div>

        {/* File Attachments */}
        <div id="files" className="col-span-1 mb-6">
          <h2 className="text-xl font-bold mb-4">File Attachments</h2>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="mb-4 text-gray-700">
              Attach files to your assignments, notes, and events.
            </p>
            <FileAttachments parentId="demo-1" parentType="demo" />
          </div>
        </div>

        {/* Reminders */}
        <div id="reminders" className="col-span-1 md:col-span-2 mb-6">
          <h2 className="text-xl font-bold mb-4">Reminders & To-Do List</h2>
          <Reminders />
        </div>

        {/* User Profile */}
        <div id="profile" className="col-span-1 md:col-span-2 mb-6">
          <h2 className="text-xl font-bold mb-4">User Profile</h2>
          <UserProfile />
        </div>

        {/* Mobile Responsive */}
        <div id="responsive" className="col-span-1 md:col-span-2 mb-6">
          <h2 className="text-xl font-bold mb-4">Mobile Responsive</h2>
          <MobileResponsiveDemo />
        </div>
      </div>
    </div>
  );
}
