/**
 * Utility functions for chart data processing
 */

// Get assignment completion rate
export const getCompletionRate = (assignments) => {
  if (!assignments || assignments.length === 0) {
    return 0;
  }
  
  const completed = assignments.filter(a => a.status === 'completed').length;
  return Math.round((completed / assignments.length) * 100);
};

// Get assignment status counts
export const getStatusCounts = (assignments) => {
  const statusCounts = {
    completed: 0,
    in_progress: 0,
    not_started: 0,
    overdue: 0
  };
  
  if (!assignments || assignments.length === 0) {
    return statusCounts;
  }
  
  assignments.forEach(assignment => {
    const status = assignment.status || 'not_started';
    
    // Check if assignment is overdue
    const dueDate = new Date(assignment.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (status !== 'completed' && dueDate < today) {
      statusCounts.overdue++;
    } else {
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    }
  });
  
  return statusCounts;
};

// Get assignment counts by priority
export const getPriorityCounts = (assignments) => {
  const priorityCounts = {
    high: 0,
    medium: 0,
    low: 0
  };
  
  if (!assignments || assignments.length === 0) {
    return priorityCounts;
  }
  
  assignments.forEach(assignment => {
    const priority = assignment.priority || 'medium';
    priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
  });
  
  return priorityCounts;
};

// Get assignment counts by due date (this week, next week, future)
export const getDueDateCounts = (assignments) => {
  const dueDateCounts = {
    today: 0,
    this_week: 0,
    next_week: 0,
    future: 0,
    overdue: 0
  };
  
  if (!assignments || assignments.length === 0) {
    return dueDateCounts;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const thisWeekEnd = new Date(today);
  thisWeekEnd.setDate(today.getDate() + (7 - today.getDay()));
  
  const nextWeekEnd = new Date(thisWeekEnd);
  nextWeekEnd.setDate(thisWeekEnd.getDate() + 7);
  
  assignments.forEach(assignment => {
    const dueDate = new Date(assignment.due_date);
    dueDate.setHours(0, 0, 0, 0);
    
    if (dueDate < today && assignment.status !== 'completed') {
      dueDateCounts.overdue++;
    } else if (dueDate.toDateString() === today.toDateString()) {
      dueDateCounts.today++;
    } else if (dueDate <= thisWeekEnd) {
      dueDateCounts.this_week++;
    } else if (dueDate <= nextWeekEnd) {
      dueDateCounts.next_week++;
    } else {
      dueDateCounts.future++;
    }
  });
  
  return dueDateCounts;
};

// Get study streak data
export const getStudyStreakData = (days = 30) => {
  // This would normally come from a database, but we'll simulate it with local storage
  const streak = localStorage.getItem('studyStreak') ? parseInt(localStorage.getItem('studyStreak')) : 0;
  
  // Generate random study hours for the past 30 days for demo purposes
  const studyData = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Random hours between 0 and 6
    const hours = Math.random() > 0.3 ? Math.round(Math.random() * 6) : 0;
    
    studyData.push({
      date: date.toISOString().split('T')[0],
      hours
    });
  }
  
  return {
    streak,
    studyData
  };
};

// Get colors for charts
export const getChartColors = () => {
  return {
    completed: '#10B981', // green-500
    in_progress: '#3B82F6', // blue-500
    not_started: '#6B7280', // gray-500
    overdue: '#EF4444', // red-500
    high: '#EF4444', // red-500
    medium: '#F59E0B', // amber-500
    low: '#10B981', // green-500
    today: '#8B5CF6', // purple-500
    this_week: '#3B82F6', // blue-500
    next_week: '#10B981', // green-500
    future: '#6B7280', // gray-500
  };
};
