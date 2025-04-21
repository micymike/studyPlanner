import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { 
  Clock, Calendar, CheckSquare, 
  Brain, Search, Plus, Loader2, BarChart2, 
  BookMarked, Bell, ChevronRight, Star
} from 'lucide-react';



const Dashboard = ({ 
  assignments, 
  classes, 
  events, 
  isPremium, 
  onPremiumUpgrade,
  isLoading = false,
  onAddAssignment,
  onAddClass,
  onAddEvent,
  activeTab,
  setActiveTab // Add this prop to allow changing tabs
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showGuide, setShowGuide] = useState(true);

  // Navigation methods for quick actions
  const handleAddAssignment = () => {
    console.log('Add assignment clicked');
    setActiveTab('assignments'); // Switch to Assignments tab
  };

  const handleSearchNotes = () => {
    console.log('Search notes clicked');
    // You might want to implement a search functionality or navigate to a search page
    // For now, just log the action
  };

  const handleViewProgress = () => {
    console.log('View progress clicked');
    // Implement progress view navigation or modal
    // For now, just log the action
  };

  const navigate = useNavigate();

  useEffect(() => {
    console.log('Dashboard component rendered with props:', {
      assignmentsCount: assignments.length,
      classesCount: classes.length,
      eventsCount: events.length,
      isPremium,
      isLoading
    });
  }, [assignments, classes, events, isPremium, isLoading]);
  
  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Filter today's classes
  const todayClasses = classes.filter((cls) => {
    const classDate = new Date(cls.date);
    return classDate.toDateString() === today.toDateString();
  });

  const upcomingAssignments = assignments
    .filter((assignment) => new Date(assignment.due_date) > today)
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 3);

  const upcomingEvents = events
    .filter((event) => new Date(event.date) > today)
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 3);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  // Calculate study streak (in a real app, this would be stored in the database)
  const studyStreak = 5;
  
  // Log when premium features are accessed
  const logPremiumFeatureAccess = (featureName) => {
    console.log(`Premium feature accessed: ${featureName}`, { isPremium });
    if (isPremium) {
      console.warn(`Non-premium user attempted to access premium feature: ${featureName}`);
    }
    return isPremium;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Quick Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowGuide(false)}
              aria-label="Close Guide"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-2">Welcome to your Dashboard!</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
              <li>View your <b>assignments</b>, <b>classes</b>, and <b>events</b> at a glance.</li>
              <li>Switch tabs to see <b>Today's</b>, <b>Upcoming</b>, or <b>All</b> activities.</li>
              <li>Add new assignments, classes, or events from their respective sections.</li>
              <li>Track your study streak and progress.</li>
              <li>Use the search bar to quickly find what you need.</li>
            </ul>
            <div className="mt-4 text-right">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setShowGuide(false)}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Mobile Search Bar */}
      <div className="block md:hidden">
        <div className="relative">
          <input
            type="text"
            placeholder="Search assignments, classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-4 md:hidden">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'today' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'upcoming' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'all' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500'
          }`}
        >
          All
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="ml-2 text-gray-600">Loading your dashboard...</span>
        </div>
      )}

      {!isLoading && (assignments.length === 0 || classes.length === 0 || events.length === 0) && (
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 text-center space-y-4">
          <div className="mx-auto max-w-md">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Get Started with Your Study Dashboard</h2>
            <p className="text-gray-600 mb-6">It looks like you haven't added any assignments, classes, or events yet. Let's get organized!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors group">
                <div className="p-2 rounded-full bg-blue-100 inline-block mb-2">
                  <Plus className="h-5 w-5 text-blue-600 group-hover:rotate-90 transition-transform" />
                </div>
                <h3 className="font-semibold text-blue-800 mb-2">Add Assignments</h3>
                <p className="text-sm text-blue-700 mb-3">Track your academic tasks and deadlines.</p>
                <button 
                  onClick={handleAddAssignment}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Assignment
                </button>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 hover:bg-green-100 transition-colors group">
                <div className="p-2 rounded-full bg-green-100 inline-block mb-2">
                  <Calendar className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-semibold text-green-800 mb-2">Schedule Classes</h3>
                <p className="text-sm text-green-700 mb-3">Organize your class schedule and timings.</p>
                <button 
                  onClick={() => {
                    const newClass = {
                      name: 'New Class',
                      instructor: 'TBD',
                      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                      time: '09:00',
                      location: 'TBD'
                    };
                    console.log('Attempting to add class:', newClass);
                    if (typeof onAddClass !== 'function') {
                      console.error('onAddClass is not a function', onAddClass);
                      return;
                    }
                    onAddClass(newClass);
                  }} 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Class
                </button>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-4 hover:bg-indigo-100 transition-colors group">
                <div className="p-2 rounded-full bg-indigo-100 inline-block mb-2">
                  <BookMarked className="h-5 w-5 text-indigo-600 group-hover:rotate-6 transition-transform" />
                </div>
                <h3 className="font-semibold text-indigo-800 mb-2">Create Events</h3>
                <p className="text-sm text-indigo-700 mb-3">Mark important academic and personal events.</p>
                <button 
                  onClick={() => {
                    const newEvent = {
                      title: 'New Event',
                      description: 'Event details',
                      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                      time: '14:00',
                      location: 'TBD'
                    };
                    console.log('Attempting to add event:', newEvent);
                    if (typeof onAddEvent !== 'function') {
                      console.error('onAddEvent is not a function', onAddEvent);
                      return;
                    }
                    onAddEvent(newEvent);
                  }} 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Event
                </button>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 hover:bg-purple-100 transition-colors group">
                <div className="p-2 rounded-full bg-purple-100 inline-block mb-2">
                  <Star className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-semibold text-purple-800 mb-2">Explore Features</h3>
                <p className="text-sm text-purple-700 mb-3">Discover new tools to enhance your learning experience.</p>
                <Link 
                  to="/features" 
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-block"
                >
                  View Features
                </Link>
              </div>
            </div>
            
            <div className="mt-6 border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-500">Pro Tip: Keeping your dashboard updated helps you stay organized and reduces stress!</p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && (assignments.length > 0 && classes.length > 0 && events.length > 0) && (
        <>
          {/* Responsive Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 md:p-3 rounded-full bg-blue-100 mr-2 md:mr-4">
                  <Clock className="text-blue-500 h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Today's Classes</p>
                  <p className="text-base md:text-lg font-semibold">{todayClasses.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 border-l-4 border-green-500 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 md:p-3 rounded-full bg-green-100 mr-2 md:mr-4">
                  <CheckSquare className="text-green-500 h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Completed Tasks</p>
                  <p className="text-base md:text-lg font-semibold">
                    {assignments.filter((a) => a.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 md:p-3 rounded-full bg-yellow-100 mr-2 md:mr-4">
                  <Calendar className="text-yellow-500 h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Upcoming Events</p>
                  <p className="text-base md:text-lg font-semibold">{upcomingEvents.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 md:p-3 rounded-full bg-purple-100 mr-2 md:mr-4">
                  <Brain className="text-purple-500 h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Study Streak</p>
                  <p className="text-base md:text-lg font-semibold">{studyStreak} days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Responsive Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Today's Schedule */}
            <div className={`bg-white rounded-lg shadow-sm p-4 md:p-5 ${activeTab == 'today' && activeTab == 'all' ? 'hidden md:block' : ''}`}>
              <h2 className="text-base font-medium mb-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-blue-500" />
                  Today's Schedule
                </div>
                <button className="text-xs text-blue-500 hover:text-blue-700 flex items-center">
                  View all <ChevronRight className="h-3 w-3 ml-1" />
                </button>
              </h2>
              <div className="space-y-3">
                {todayClasses.length > 0 ? (
                  todayClasses.map((cls ) => (
                    <div key={cls.id} className="flex flex-col sm:flex-row sm:items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1 mb-1 sm:mb-0">
                        <p className="font-medium text-sm">{cls.course}</p>
                        <p className="text-xs text-gray-500">
                          {cls.start_time} - {cls.end_time} <span className="hidden sm:inline">• {cls.location}</span>
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="text-xs text-gray-500 mr-2">{cls.instructor}</div>
                        {isPremium && (
                          <button className="p-1 rounded-full bg-blue-50 hover:bg-blue-100">
                            <Bell className="h-3 w-3 text-blue-500" onClick={() => logPremiumFeatureAccess('Class Reminder')} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4 text-sm">No classes scheduled for today</p>
                )}
              </div>
            </div>

            {/* Upcoming Assignments */}
            <div className={`bg-white rounded-lg shadow-sm p-4 md:p-5 ${activeTab == 'upcoming' && activeTab == 'all' && activeTab == 'today' ? 'hidden md:block' : ''}`}>
              <h2 className="text-base font-medium mb-3 flex items-center justify-between">
                <div className="flex items-center">
                  <CheckSquare className="mr-2 h-4 w-4 text-green-500" />
                  Upcoming Assignments
                </div>
                <button className="text-xs text-blue-500 hover:text-blue-700 flex items-center">
                  View all <ChevronRight className="h-3 w-3 ml-1" />
                </button>
              </h2>
              <div className="space-y-3">
                {upcomingAssignments.length > 0 ? (
                  upcomingAssignments.map((assignment) => (
                    <div key={assignment.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 sm:mb-2">
                        <h3 className="font-medium text-sm">{assignment.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs self-start sm:self-center ${
                          assignment.priority === 'high' ? 'bg-red-100 text-red-800' :
                          assignment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {assignment.priority}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-500">{assignment.course}</p>
                          <p className="text-xs text-gray-500">Due: {formatDate(assignment.due_date)}</p>
                        </div>
                        {isPremium && (
                          <div className="flex space-x-1">
                            <button className="p-1 rounded-full bg-gray-100 hover:bg-gray-200">
                              <BookMarked className="h-3 w-3 text-gray-500" onClick={() => logPremiumFeatureAccess('Assignment Bookmark')} />
                            </button>
                            <button className="p-1 rounded-full bg-gray-100 hover:bg-gray-200">
                              <Star className="h-3 w-3 text-gray-500" onClick={() => logPremiumFeatureAccess('Assignment Star')} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4 text-sm">No upcoming assignments</p>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Events - New Section */}
          <div className={`bg-white rounded-lg shadow-sm p-4 md:p-5 ${activeTab == 'upcoming' && activeTab == 'all' ? 'hidden md:block' : ''}`}>
            <h2 className="text-base font-medium mb-3 flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-yellow-500" />
                Upcoming Events
              </div>
              <button className="text-xs text-blue-500 hover:text-blue-700 flex items-center">
                View calendar <ChevronRight className="h-3 w-3 ml-1" />
              </button>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-start mb-2">
                      <div className="bg-yellow-100 rounded-md p-2 mr-3 text-center min-w-[40px]">
                        <p className="text-xs text-yellow-800 font-medium">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                        <p className="text-sm text-yellow-800 font-bold">{new Date(event.date).getDate()}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{event.title}</h3>
                        <p className="text-xs text-gray-500">{event.time}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{event.location}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4 text-sm col-span-3">No upcoming events</p>
              )}
            </div>
          </div>

          {/* Responsive Premium Feature Preview */}
          {isPremium && (
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-sm p-4 md:p-5 text-white">
              <h2 className="text-base font-medium mb-2 flex items-center">
                <Brain className="mr-2 h-4 w-4" />
                Unlock AI Study Planning
              </h2>
              <p className="text-sm mb-3">Get personalized study schedules, smart reminders, and AI-powered insights to improve your academic performance.</p>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <button 
                  onClick={onPremiumUpgrade}
                  className="bg-white text-indigo-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors"
                >
                  Upgrade to Premium
                </button>
                <button className="text-white text-sm hover:underline">Learn more</button>
              </div>
            </div>
          )}

          {/* Study Progress - Premium Feature */}
          {isPremium && (
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-5">
              <h2 className="text-base font-medium mb-3 flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart2 className="mr-2 h-4 w-4 text-indigo-500" />
                  Study Progress
                </div>
                <button className="text-xs text-blue-500 hover:text-blue-700 flex items-center">
                  Detailed analytics <ChevronRight className="h-3 w-3 ml-1" />
                </button>
              </h2>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Weekly study goal</span>
                    <span className="text-xs font-medium">15/20 hours</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Focus time</p>
                    <p className="text-base font-medium">4.5 hours</p>
                    <p className="text-xs text-green-500">+12% from last week</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Assignments completed</p>
                    <p className="text-base font-medium">8 tasks</p>
                    <p className="text-xs text-green-500">+3 from last week</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
