/**
 * Utility functions for calendar operations
 */

// Format date to YYYYMMDD
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

// Format time to HHMMSS
const formatTime = (date) => {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${hours}${minutes}${seconds}`;
};

// Format date and time to YYYYMMDDTHHMMSSZ
const formatDateTime = (date) => {
  const d = new Date(date);
  return `${formatDate(d)}T${formatTime(d)}Z`;
};

// Generate an iCalendar (.ics) file content for a single event
export const generateEventICS = (event) => {
  const startDate = formatDateTime(event.date || event.due_date || new Date());
  const endDate = event.end_date ? formatDateTime(event.end_date) : startDate;
  
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//E-Learning Platform//NONSGML v1.0//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@elearning-platform.com`,
    `DTSTAMP:${formatDateTime(new Date())}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `SUMMARY:${event.title || event.name || 'Untitled Event'}`,
  ];
  
  if (event.description) {
    icsContent.push(`DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`);
  }
  
  if (event.location) {
    icsContent.push(`LOCATION:${event.location}`);
  }
  
  icsContent = [
    ...icsContent,
    'END:VEVENT',
    'END:VCALENDAR'
  ];
  
  return icsContent.join('\r\n');
};

// Generate an iCalendar (.ics) file content for multiple events
export const generateEventsICS = (events) => {
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//E-Learning Platform//NONSGML v1.0//EN',
    'CALSCALE:GREGORIAN'
  ];
  
  events.forEach(event => {
    const startDate = formatDateTime(event.date || event.due_date || new Date());
    const endDate = event.end_date ? formatDateTime(event.end_date) : startDate;
    
    icsContent = [
      ...icsContent,
      'BEGIN:VEVENT',
      `UID:${Date.now() + Math.random()}@elearning-platform.com`,
      `DTSTAMP:${formatDateTime(new Date())}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${event.title || event.name || 'Untitled Event'}`
    ];
    
    if (event.description) {
      icsContent.push(`DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`);
    }
    
    if (event.location) {
      icsContent.push(`LOCATION:${event.location}`);
    }
    
    icsContent.push('END:VEVENT');
  });
  
  icsContent.push('END:VCALENDAR');
  
  return icsContent.join('\r\n');
};

// Download iCalendar (.ics) file
export const downloadICS = (content, filename = 'calendar.ics') => {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

// Generate Google Calendar URL for an event
export const generateGoogleCalendarURL = (event) => {
  const startDate = new Date(event.date || event.due_date || new Date());
  const endDate = event.end_date ? new Date(event.end_date) : new Date(startDate.getTime() + 60 * 60 * 1000); // Default to 1 hour
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title || event.name || 'Untitled Event',
    dates: `${formatDateTime(startDate).replace(/Z$/, '')}/${formatDateTime(endDate).replace(/Z$/, '')}`,
  });
  
  if (event.description) {
    params.append('details', event.description);
  }
  
  if (event.location) {
    params.append('location', event.location);
  }
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};
