import React, { useState } from 'react';
import { generateEventsICS, downloadICS, generateGoogleCalendarURL } from '../utils/calendarUtils';
import { Calendar, Download, ExternalLink } from 'lucide-react';

export default function CalendarExport({ items = [] }) {
  const [showOptions, setShowOptions] = useState(false);

  // Handle export to .ics file
  const handleExportICS = () => {
    if (!items || items.length === 0) {
      alert('No items to export');
      return;
    }
    
    const icsContent = generateEventsICS(items);
    downloadICS(icsContent, 'calendar-events.ics');
    setShowOptions(false);
  };

  // Handle export to Google Calendar
  const handleExportToGoogle = (item) => {
    if (!item) {
      alert('No item selected');
      return;
    }
    
    const url = generateGoogleCalendarURL(item);
    window.open(url, '_blank');
    setShowOptions(false);
  };

  return (
    <div className="relative">
      <button 
        className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors"
        onClick={() => setShowOptions(!showOptions)}
      >
        <Calendar className="h-4 w-4" />
        <span>Calendar</span>
      </button>
      
      {showOptions && (
        <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg p-3 z-10 w-64">
          <h3 className="font-medium text-sm mb-2">Export Options</h3>
          
          <button 
            className="flex items-center gap-2 w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
            onClick={handleExportICS}
          >
            <Download className="h-4 w-4 text-blue-600" />
            <span>Download as .ics file</span>
          </button>
          
          {items.length > 0 && (
            <div className="mt-2">
              <h4 className="text-xs text-gray-500 mb-1">Export single item to Google Calendar</h4>
              <div className="max-h-40 overflow-y-auto">
                {items.map((item, index) => (
                  <button 
                    key={index}
                    className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors"
                    onClick={() => handleExportToGoogle(item)}
                  >
                    <ExternalLink className="h-3 w-3 text-blue-600" />
                    <span className="truncate">{item.title || item.name || `Item ${index + 1}`}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-3 pt-2 border-t border-gray-200">
            <button 
              className="text-xs text-gray-500 hover:text-gray-700"
              onClick={() => setShowOptions(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
