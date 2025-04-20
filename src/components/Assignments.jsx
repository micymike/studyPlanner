import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { toast } from 'react-hot-toast';

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        course: '',
        due_date: '',
        priority: 'medium',
        status: 'not-started'
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const { data, error } = await supabase
                .from('assignments')
                .select('*')
                .order('due_date', { ascending: true });

            if (error) throw error;

            setAssignments(data || []);
        } catch (error) {
            toast(`Error fetching assignments: ${error.message}`);
        }
    };

    const updateAssignmentStatus = async (id, newStatus) => {
        try {
            const { data, error } = await supabase
                .from('assignments')
                .update({ status: newStatus })
                .eq('id', id)
                .select();

            if (error) throw error;

            // Update local state to reflect the status change
            setAssignments(prev => 
                prev.map(assignment => 
                    assignment.id === id 
                        ? { ...assignment, status: newStatus } 
                        : assignment
                )
            );

            toast(`Assignment Updated: Assignment status changed to ${newStatus}`);
        } catch (error) {
            toast(`Error Updating Assignment: ${error.message}`);
        }
    };

    const scheduleAssignment = async () => {
        // Validate form inputs
        if (!newAssignment.title.trim()) {
            toast('Validation Error: Please enter an assignment title');
            return;
        }

        if (!newAssignment.course.trim()) {
            toast('Validation Error: Please enter the course name');
            return;
        }

        if (!newAssignment.due_date) {
            toast('Validation Error: Please select a due date');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('assignments')
                .insert({
                    ...newAssignment,
                    title: newAssignment.title.trim(),
                    course: newAssignment.course.trim()
                })
                .select();

            if (error) throw error;

            setAssignments(prev => [...prev, data[0]]);
            setNewAssignment({
                title: '',
                course: '',
                due_date: '',
                priority: 'medium',
                status: 'not-started'
            });
            setIsDialogOpen(false);

            toast('Your new assignment has been added.');
        } catch (error) {
            toast(`Error creating assignment: ${error.message}`);
        }
    };

    return (
        <div className='p-5'>
            <div className='flex justify-between items-center mb-5'>
                <h1 className='text-2xl font-bold'>Assignments</h1>
                <div className='relative'>
                    <button 
                        onClick={() => setIsDialogOpen(true)}
                        className='bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors'
                    >
                        Create Assignment
                    </button>
                    {isDialogOpen && (
                        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                            <div className='bg-white rounded-lg p-6 w-full max-w-md'>
                                <div className='flex justify-between items-center mb-4'>
                                    <h3 className='text-lg font-semibold'>Create New Assignment</h3>
                                    <button 
                                        onClick={() => setIsDialogOpen(false)}
                                        className='text-gray-500 hover:text-gray-700'
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className='grid gap-4 py-4'>
                                    <input
                                        placeholder='Assignment Title'
                                        value={newAssignment.title || ''}
                                        onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md'
                                    />
                                    <input
                                        placeholder='Course'
                                        value={newAssignment.course || ''}
                                        onChange={(e) => setNewAssignment(prev => ({ ...prev, course: e.target.value }))}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md'
                                    />
                                    <input
                                        type='date'
                                        value={newAssignment.due_date || ''}
                                        onChange={(e) => setNewAssignment(prev => ({ ...prev, due_date: e.target.value }))}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md'
                                    />
                                    <select
                                        value={newAssignment.priority || ''}
                                        onChange={(e) => setNewAssignment(prev => ({ ...prev, priority: e.target.value }))}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md'
                                    >
                                        <option value=''>Select Priority</option>
                                        <option value='high'>High</option>
                                        <option value='medium'>Medium</option>
                                        <option value='low'>Low</option>
                                    </select>
                                </div>
                                <div className='flex justify-end gap-2'>
                                    <button 
                                        onClick={() => setIsDialogOpen(false)}
                                        className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={scheduleAssignment}
                                        className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className='space-y-4'>
                {assignments.map(assignment => (
                    <div
                        key={assignment.id}
                        className={`border rounded-lg p-4 ${
                            assignment.status === 'completed' ? 'bg-green-50' :
                            assignment.status === 'in-progress' ? 'bg-yellow-50' :
                            'bg-gray-50'
                        }`}
                    >
                        <div className='flex justify-between items-center'>
                            <div>
                                <p className='font-bold'>{assignment.title}</p>
                                <p className='text-gray-600'>{assignment.course}</p>
                                <p className='text-sm'>Due: {assignment.due_date}</p>
                            </div>
                            <select
                                value={assignment.status || 'not-started'}
                                onChange={(e) => updateAssignmentStatus(assignment.id, e.target.value)}
                                className='border rounded px-2 py-1'
                            >
                                <option value='not-started'>Not Started</option>
                                <option value='pending'>Pending</option>
                                <option value='in-progress'>In Progress</option>
                                <option value='completed'>Completed</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Assignments;