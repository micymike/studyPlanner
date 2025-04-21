import React, { useState, useEffect } from 'react';
import { BarChart2, PieChart, TrendingUp, Calendar, Clock } from 'lucide-react';
import { getItem, setItem, STORAGE_KEYS } from '../utils/localStorage';
import { 
  getCompletionRate, 
  getStatusCounts, 
  getPriorityCounts, 
  getDueDateCounts,
  getStudyStreakData,
  getChartColors
} from '../utils/chartUtils';

// Simple chart components (no external dependencies)
const ProgressBar = ({ value, max, color }) => (
  <div className="w-full bg-gray-200 rounded-full h-4">
    <div 
      className={`h-4 rounded-full ${color}`} 
      style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
    ></div>
  </div>
);

const PieChartSimple = ({ data }) => {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  let currentAngle = 0;
  
  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {Object.entries(data).map(([key, value], index) => {
          if (value === 0) return null;
          
          const percentage = value / total;
          const startAngle = currentAngle;
          const endAngle = currentAngle + percentage * 360;
          currentAngle = endAngle;
          
          // Convert angles to radians and calculate path
          const startRad = (startAngle - 90) * Math.PI / 180;
          const endRad = (endAngle - 90) * Math.PI / 180;
          
          const x1 = 50 + 50 * Math.cos(startRad);
          const y1 = 50 + 50 * Math.sin(startRad);
          const x2 = 50 + 50 * Math.cos(endRad);
          const y2 = 50 + 50 * Math.sin(endRad);
          
          const largeArcFlag = percentage > 0.5 ? 1 : 0;
          
          const pathData = [
            `M 50 50`,
            `L ${x1} ${y1}`,
            `A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `Z`
          ].join(' ');
          
          return (
            <path 
              key={key} 
              d={pathData} 
              fill={getChartColors()[key] || `hsl(${index * 60}, 70%, 60%)`}
            />
          );
        })}
      </svg>
    </div>
  );
};

const BarChartSimple = ({ data, height = 150 }) => {
  const values = Object.values(data);
  const maxValue = Math.max(...values, 1);
  
  return (
    <div className="flex items-end justify-between h-40 w-full space-x-1">
      {Object.entries(data).map(([key, value], index) => (
        <div key={key} className="flex flex-col items-center flex-1">
          <div 
            className="w-full rounded-t"
            style={{ 
              height: `${(value / maxValue) * height}px`,
              backgroundColor: getChartColors()[key] || `hsl(${index * 60}, 70%, 60%)`
            }}
          ></div>
          <span className="text-xs mt-1 text-center break-all">{key.replace('_', ' ')}</span>
          <span className="text-xs font-bold">{value}</span>
        </div>
      ))}
    </div>
  );
};

const CalendarHeatmap = ({ data, days = 30 }) => {
  const maxHours = Math.max(...data.map(d => d.hours), 1);
  
  return (
    <div className="grid grid-cols-7 gap-1">
      {data.map((day, index) => (
        <div 
          key={index}
          className="w-6 h-6 rounded-sm flex items-center justify-center text-xs"
          style={{ 
            backgroundColor: day.hours > 0 
              ? `rgba(59, 130, 246, ${Math.min(1, day.hours / maxHours)})`
              : '#f3f4f6'
          }}
          title={`${day.date}: ${day.hours} hours`}
        >
          {day.hours > 0 && day.hours}
        </div>
      ))}
    </div>
  );
};

export default function ProgressAnalytics({ assignments = [] }) {
  const [timeRange, setTimeRange] = useState('all');
  const [studyData, setStudyData] = useState({ streak: 0, studyData: [] });
  
  // Filter assignments based on time range
  const filteredAssignments = assignments.filter(assignment => {
    if (timeRange === 'all') return true;
    
    const dueDate = new Date(assignment.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const oneWeek = new Date(today);
    oneWeek.setDate(today.getDate() + 7);
    
    const oneMonth = new Date(today);
    oneMonth.setMonth(today.getMonth() + 1);
    
    switch (timeRange) {
      case 'week':
        return dueDate <= oneWeek;
      case 'month':
        return dueDate <= oneMonth;
      default:
        return true;
    }
  });
  
  // Calculate metrics
  const completionRate = getCompletionRate(filteredAssignments);
  const statusCounts = getStatusCounts(filteredAssignments);
  const priorityCounts = getPriorityCounts(filteredAssignments);
  const dueDateCounts = getDueDateCounts(filteredAssignments);
  
  // Get study streak data
  useEffect(() => {
    const data = getStudyStreakData(30);
    setStudyData(data);
  }, []);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <BarChart2 className="h-5 w-5 mr-2 text-blue-600" />
          Progress Analytics
        </h2>
        
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Completion Rate */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
            Completion Rate
          </h3>
          <div className="flex items-center mb-2">
            <div className="text-3xl font-bold mr-2">{completionRate}%</div>
            <div className="text-xs text-gray-500">of assignments completed</div>
          </div>
          <ProgressBar 
            value={completionRate} 
            max={100} 
            color="bg-green-500" 
          />
        </div>
        
        {/* Assignment Status */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">Assignment Status</h3>
          <div className="flex items-center justify-between">
            <PieChartSimple data={statusCounts} />
            <div className="space-y-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center text-xs">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: getChartColors()[status] }}
                  ></div>
                  <span className="capitalize">{status.replace('_', ' ')}: {count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Assignment by Priority */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">Assignments by Priority</h3>
          <BarChartSimple data={priorityCounts} />
        </div>
        
        {/* Assignments by Due Date */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-blue-600" />
            Assignments by Due Date
          </h3>
          <BarChartSimple data={dueDateCounts} />
        </div>
        
        {/* Study Streak */}
        <div className="border border-gray-200 rounded-lg p-4 md:col-span-2">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Clock className="h-4 w-4 mr-1 text-purple-600" />
            Study Activity (Last 30 Days)
          </h3>
          <div className="flex items-center mb-4">
            <div className="text-3xl font-bold mr-2">{studyData.streak}</div>
            <div className="text-xs text-gray-500">day streak</div>
          </div>
          <div className="overflow-x-auto pb-2">
            <CalendarHeatmap data={studyData.studyData} />
          </div>
        </div>
      </div>
      
      {assignments.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <p>No assignment data available. Add assignments to see your progress analytics.</p>
        </div>
      )}
    </div>
  );
}
