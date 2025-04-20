export interface ClassSession {
  location: ReactNode;
  course: ReactNode;
  date: string | number | Date;
  id: string;
  subject: string;
  day: string;
  start_time: string;
  end_time: string;
  room: string;
  instructor: string;
  notes?: string;
  attendance_required: boolean;
  recurring: boolean;
}

import { ReactNode } from 'react';

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  course: string;
  due_date?: string;
  dueDate?: string;
  priority?: 'high' | 'medium' | 'low';
  status?: 'pending' | 'in-progress' | 'completed' | 'not-started';
  attachments?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  type: 'class' | 'assignment' | 'study' | 'other';
  attendees?: string[];
  reminders?: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudyStats {
  streak: number;
  totalHours: number;
  averageDaily: number;
  bestStreak: number;
  subjects: {
    name: string;
    hours: number;
  }[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  calendarView: 'month' | 'week';
  notifications: boolean;
  defaultView: 'dashboard' | 'assignments' | 'calendar' | 'timetable';
  studyGoals: {
    dailyHours: number;
    weeklyHours: number;
  };
}

export interface Database {
  public: {
    Tables: {
      class_sessions: {
        Row: ClassSession;
        Insert: Omit<ClassSession, 'id' | 'created_at'>;
        Update: Partial<Omit<ClassSession, 'id' | 'created_at'>>;
      };
      assignments: {
        Row: Assignment;
        Insert: Omit<Assignment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Assignment, 'id' | 'created_at' | 'updated_at'>>;
      };
      events: {
        Row: Event;
        Insert: Omit<Event, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}