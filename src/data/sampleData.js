import { Assignment, ClassSession, Event } from '../types';

export const sampleClasses: ClassSession[] = [
  {
    id: '1',
    course: 'Mathematics 101',
    day: 'Monday',
    startTime: '09:00',
    endTime: '11:00',
    location: 'Room 201',
    instructor: 'Dr. Smith'
  },
  {
    id: '2',
    course: 'Physics 101',
    day: 'Tuesday',
    startTime: '14:00',
    endTime: '16:00',
    location: 'Lab 102',
    instructor: 'Prof. Johnson'
  },
  {
    id: '3',
    course: 'Computer Science',
    day: 'Wednesday',
    startTime: '11:00',
    endTime: '13:00',
    location: 'Lab 305',
    instructor: 'Dr. Williams'
  }
];

export const sampleAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Math Assignment 1',
    description: 'Complete exercises 1-10 from Chapter 3',
    course: 'Mathematics 101',
    dueDate: new Date('2024-03-20'),
    priority: 'high',
    status: 'not-started'
  },
  {
    id: '2',
    title: 'Physics Lab Report',
    description: 'Write up findings from Experiment 2',
    course: 'Physics 101',
    dueDate: new Date('2024-03-25'),
    priority: 'medium',
    status: 'in-progress'
  }
];

export const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Mathematics CAT 1',
    date: new Date('2024-03-22'),
    type: 'cat',
    description: 'Chapters 1-3'
  },
  {
    id: '2',
    title: 'Physics Mid-term',
    date: new Date('2024-04-05'),
    type: 'exam',
    description: 'Covering all topics from first half of semester'
  }
];