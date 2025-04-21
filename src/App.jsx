import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import Dashboard from './components/Dashboard';
import CalendarView from './components/Calendar';
import Timetable from './components/Timetable';
import Assignments from './components/Assignments';
import Features from './pages/Features';
import Sidebar from './components/Sidebar';
import { LayoutDashboard, Menu, Calendar, BookOpen, Star } from 'lucide-react';
import { supabase } from './lib/supabase';
import NotificationService from './services/notificationService.jsx';

function App() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [events, setEvents] = useState([]);
  // Removed studyStats state
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Initialize notifications only when user explicitly allows
    const initNotifications = async () => {
      if (NotificationService.isNotificationSupported()) {
        console.log('Notification service is supported');
        await NotificationService.registerServiceWorker();
      }
    };

    initNotifications();
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Parallel data fetching with comprehensive error handling
      const [classesResult, assignmentsResult, eventsResult] = await Promise.all([
        supabase().from('class_sessions').select('*'),
        supabase().from('assignments').select('*'),
        supabase().from('events').select('*')
      ]);

      // Collect and log any errors
      const dataErrors = [
        classesResult.error && `Classes: ${classesResult.error.message}`,
        assignmentsResult.error && `Assignments: ${assignmentsResult.error.message}`,
        eventsResult.error && `Events: ${eventsResult.error.message}`
      ].filter(Boolean);

      // Throw aggregated errors if any exist
      if (dataErrors.length > 0) {
        throw new Error(dataErrors.join('; '));
      }

      // Update state with fetched data, providing fallback empty arrays/null
      setClasses(classesResult.data || []);
      setAssignments(assignmentsResult.data || []);
      setEvents(eventsResult.data || []);
      // Removed study_stats fetching

      // Success notification
      toast.success('Data loaded successfully', { position: 'bottom-right' });

      // Check for upcoming assignments and send reminders
      const upcomingAssignments = assignmentsResult.data?.filter(assignment => {
        const dueDate = new Date(assignment.due_date);
        const today = new Date();
        const diffDays = (dueDate - today) / (1000 * 60 * 60 * 24);
        return diffDays > 0 && diffDays <= 3; // Assignments due in next 3 days
      });

      upcomingAssignments?.forEach(assignment => {
        NotificationService.notifyAssignmentDue({
          title: assignment.title,
          due_date: assignment.due_date
        });
      });
    } catch (error) {
      // Comprehensive error handling
      console.error('Data fetching error:', error);
      
      // Set error state for potential UI feedback
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      
      // User-friendly error toast
      toast.error('Failed to load data. Please try again later.', { position: 'bottom-right' });
    } finally {
      // Always set loading to false
      setLoading(false);
    }
  }, []);

  // Function to update classes in Supabase and local state
  const updateClasses = async (updatedClasses) => {
    setClasses(updatedClasses);
    // We don't need to update Supabase here he individual components will handle that
  };

  // Function to update assignments in Supabase and local state
  const updateAssignments = async (updatedAssignments) => {
    setAssignments(updatedAssignments);
    // We don't need to update Supabase here he individual components will handle that
  };

  const addAssignment = async (newAssignment) => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert(newAssignment)
        .select();

      if (error) {
        toast.error('Failed to add assignment');
        console.error('Error adding assignment:', error);
        return;
      }

      // Update local state with the new assignment
      setAssignments(prev => [...prev, data[0]]);
      toast.success('Assignment added successfully');

      // Send notification for new assignment
      NotificationService.notifyAssignmentDue({
        title: newAssignment.title,
        due_date: newAssignment.due_date
      });
    } catch (err) {
      toast.error('An unexpected error occurred');
      console.error('Unexpected error:', err);
    }
  };

  const addClassSession = async (newClass) => {
    try {
      const { data, error } = await supabase
        .from('class_sessions')
        .insert(newClass)
        .select();

      if (error) {
        toast.error('Failed to add class');
        console.error('Error adding class:', error);
        return;
      }

      // Update local state with the new class
      setClasses(prev => [...prev, data[0]]);
      toast.success('Class added successfully');

      // Send notification for new class
      NotificationService.notifyClassReminder({
        name: newClass.name,
        time: newClass.time
      });
    } catch (err) {
      toast.error('An unexpected error occurred');
      console.error('Unexpected error:', err);
    }
  };

  const addEvent = async (newEvent) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert(newEvent)
        .select();

      if (error) {
        toast.error('Failed to add event');
        console.error('Error adding event:', error);
        return;
      }

      // Update local state with the new event
      setEvents(prev => [...prev, data[0]]);
      toast.success('Event added successfully');

      // Send notification for new event
      NotificationService.notifyEventReminder({
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time
      });
    } catch (err) {
      toast.error('An unexpected error occurred');
      console.error('Unexpected error:', err);
    }
  };

  // Function to update events in Supabase and local state
  const updateEvents = async (updatedEvents) => {
    setEvents(updatedEvents);
    // We don't need to update Supabase here he individual components will handle that
  };

  // Function to handle premium upgrade
  const handlePremiumUpgrade = () => {
    console.log('Premium upgrade initiated');
    setIsPremium(true);
    // In a real app, this would integrate with a payment processor
    alert('Thank you for upgrading to premium You now have access to all features.');
    console.log('Premium status updated:', { isPremium: true });
    
    // Send notification for premium upgrade
    NotificationService.sendNotification('Premium Upgrade', {
      body: 'Congratulations! You now have access to all premium features.'
    });

    // In a production app, we would save this to a database or localStorage
    try {
      localStorage.setItem('isPremium', 'true');
      console.log('Premium status saved to localStorage');
    } catch (error) {
      console.error('Failed to save premium status:', error);
    }
  };

  // Check for premium status on load
  useEffect(() => {
    try {
      const storedPremiumStatus = localStorage.getItem('isPremium');
      console.log('Retrieved premium status from localStorage:', storedPremiumStatus);
      if (storedPremiumStatus === 'true') {
        setIsPremium(true);
        console.log('User hremium status');
      } else {
        console.log('User does not have premium status');
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
    }
  }, []);

  const tabs = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/dashboard' 
    },
    { 
      id: 'calendar', 
      label: 'Calendar', 
      icon: Calendar, 
      path: '/calendar' 
    },
    { 
      id: 'assignments', 
      label: 'Assignments', 
      icon: BookOpen, 
      path: '/assignments' 
    },
    { 
      id: 'features', 
      label: 'Features', 
      icon: Star, 
      path: '/features' 
    }
  ];

  // Loading state with improved spinner and message
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Loading your study planner...</p>
      </div>
    );
  }

  // Error state with retry mechanism
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-red-100 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops Something went wrong</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add Toaster for notifications */}
      <Toaster />
      
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <LayoutDashboard className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">StudyPlanner</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Removed Study Streak Display */}

              {/* Premium Status */}
              {isPremium ? (
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  Premium Account
                </span>
              ) : (
                <button 
                  onClick={handlePremiumUpgrade}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Upgrade to Premium
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8"> {/* Adjusted padding */}
        {/* Responsive Tab Navigation */}
        <div className="mb-6 md:mb-8 relative"> {/* Adjusted margin */}
          {/* Mobile Menu Button - Only visible on small screens */}
          <div className="sm:hidden flex justify-end mb-2">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          {/* Desktop Tab Navigation - Hidden on mobile */}
          <div className="hidden md:flex flex-row space-x-1 bg-gray-100 p-1 rounded-xl">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    navigate(tab.path);
                  }}
                  className={`flex items-center justify-center md:justify-start space-x-2 px-4 py-2 rounded-lg flex-1 text-sm md:text-base ${ // Centered items vertically, adjusted text size
                    activeTab === tab.id
                      ? 'bg-white shadow-sm text-indigo-600 font-medium' // Added font-medium
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200' // Added hover background
                  }`} // Corrected template literal closing
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Full-screen Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">Navigation</h2>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto">
                <div className="divide-y">
                  {[...tabs, { id: 'features', label: 'Features', icon: Star, path: '/features' }].map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsMobileMenuOpen(false);
                          navigate(tab.path || '/');

                        }}
                        className={`w-full text-left p-4 flex items-center space-x-4 text-lg ${
                          activeTab === tab.id 
                            ? 'bg-indigo-50 text-indigo-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t text-center text-gray-500">
                StudyPlanner Mobile
              </div>
            </div>
          </div>
        )}

        <main>
          <Routes>
            <Route path="/" element={(
              activeTab === 'dashboard' && (
                <Dashboard
                  assignments={assignments}
                  classes={classes}
                  events={events}
                  isPremium={isPremium}
                  onPremiumUpgrade={handlePremiumUpgrade}
                  onAddAssignment={addAssignment}
                  onAddClass={addClassSession}
                  onAddEvent={addEvent}
                  setActiveTab={setActiveTab}
                />
              )
            )} />
            <Route path="/calendar" element={(
              activeTab === 'calendar' && (
                <CalendarView
                  events={events}
                  classes={classes}
                  assignments={assignments}
                  onDataChange={fetchData}
                />
              )
            )} />
            <Route path="/timetable" element={(
              activeTab === 'timetable' && (
                <Timetable
                  classes={classes}
                  onDataChange={fetchData}
                />
              )
            )} />
            <Route path="/assignments" element={(
              activeTab === 'assignments' && (
                <Assignments
                  assignments={assignments}
                  onDataChange={fetchData}
                />
              )
            )} />
            <Route path="/features" element={<Features />} />
            <Route path="/features/search-filter" element={<div>Search & Filter Feature</div>} />
            <Route path="/features/calendar-export" element={<div>Calendar Export Feature</div>} />
            <Route path="/features/notifications" element={<div>Notifications Feature</div>} />
            <Route path="/features/group-notes" element={<div>Group Notes Feature</div>} />
            <Route path="/features/progress-analytics" element={<div>Progress Analytics Feature</div>} />
            <Route path="/features/file-attachments" element={<div>File Attachments Feature</div>} />
            <Route path="/features/reminders" element={<div>Reminders Feature</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
