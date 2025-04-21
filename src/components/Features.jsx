import React from 'react';
import { 
  Calendar, 
  CheckSquare, 
  BookOpen, 
  Star, 
  Clock, 
  Bell, 
  Zap 
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white shadow-md rounded-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
    <div className="flex items-center mb-4">
      <Icon className="w-10 h-10 text-indigo-600 mr-4" />
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Advanced Calendar',
      description: 'Manage your academic schedule with an intuitive, color-coded calendar that helps you track important dates and events.'
    },
    {
      icon: CheckSquare,
      title: 'Assignment Tracking',
      description: 'Stay on top of your assignments with detailed tracking, priority management, and progress monitoring.'
    },
    {
      icon: BookOpen,
      title: 'Interactive Timetable',
      description: 'View your class schedule, get real-time updates, and receive reminders for upcoming classes.'
    },
    {
      icon: Clock,
      title: 'Time Management',
      description: 'Optimize your study time with smart scheduling and productivity insights.'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Receive timely reminders for assignments, classes, and important academic events.'
    },
    {
      icon: Zap,
      title: 'Quick Access',
      description: 'Navigate through the app with ease using our intuitive mobile and desktop interfaces.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Explore Our Features
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Designed to streamline your academic journey and boost productivity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xl text-gray-600">
            More features coming soon! Stay tuned for updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Features;
