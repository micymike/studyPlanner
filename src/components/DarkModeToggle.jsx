import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { getItem, setItem, STORAGE_KEYS } from '../utils/localStorage';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first
    const storedPreference = getItem(STORAGE_KEYS.DARK_MODE, null);
    if (storedPreference !== null) {
      return storedPreference;
    }
    
    // If no stored preference, check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Default to light mode
    return false;
  });

  // Apply dark mode class to document when dark mode state changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    setItem(STORAGE_KEYS.DARK_MODE, isDark);
  }, [isDark]);

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        // Only update if user hasn't explicitly set a preference
        if (getItem(STORAGE_KEYS.DARK_MODE, null) === null) {
          setIsDark(e.matches);
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`p-2 rounded-full transition-colors ${
        isDark 
          ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' 
          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      }`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
