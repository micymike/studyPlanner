import React, { useState, useEffect } from 'react';
import { Users, Save, Upload, Download, Trash, Edit, Check, X } from 'lucide-react';
import { getItem, setItem, STORAGE_KEYS } from '../utils/localStorage';

export default function GroupNotes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = getItem(STORAGE_KEYS.GROUP_NOTES, []);
    setNotes(savedNotes);
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    setItem(STORAGE_KEYS.GROUP_NOTES, notes);
  }, [notes]);

  // Add a new note
  const addNote = () => {
    if (!title.trim()) {
      alert('Please enter a title for your note');
      return;
    }

    const newNote = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotes([...notes, newNote]);
    setTitle('');
    setContent('');
  };

  // Delete a note
  const deleteNote = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  // Start editing a note
  const startEditing = (note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
  };

  // Save edited note
  const saveEdit = () => {
    if (!editTitle.trim()) {
      alert('Please enter a title for your note');
      return;
    }

    setNotes(notes.map(note => 
      note.id === editingId 
        ? {
            ...note,
            title: editTitle.trim(),
            content: editContent.trim(),
            updatedAt: new Date().toISOString(),
          }
        : note
    ));
    
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
  };

  // Export notes as JSON file
  const exportNotes = () => {
    if (notes.length === 0) {
      alert('No notes to export');
      return;
    }

    const dataStr = JSON.stringify(notes, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `group-notes-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import notes from JSON file
  const importNotes = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedNotes = JSON.parse(e.target.result);
        
        if (!Array.isArray(importedNotes)) {
          throw new Error('Invalid format');
        }
        
        // Validate each note has required fields
        importedNotes.forEach(note => {
          if (!note.id || !note.title || !note.createdAt) {
            throw new Error('Invalid note format');
          }
        });
        
        if (window.confirm(`Import ${importedNotes.length} notes? This will replace your current notes.`)) {
          setNotes(importedNotes);
        }
      } catch (error) {
        alert(`Error importing notes: ${error.message}`);
      }
    };
    
    reader.readAsText(file);
    event.target.value = null; // Reset input
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-600" />
          Group Notes
        </h2>
        <div className="flex space-x-2">
          <button
            className="flex items-center gap-1 px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            onClick={exportNotes}
            title="Export Notes"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          
          <label className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Import</span>
            <input
              type="file"
              accept=".json"
              onChange={importNotes}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* New Note Form */}
      <div className="mb-4 p-3 border border-gray-200 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Add New Note</h3>
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-sm"
        />
        <textarea
          placeholder="Note Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-sm min-h-[100px]"
        />
        <button
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={addNote}
        >
          <Save className="h-4 w-4" />
          <span>Save Note</span>
        </button>
      </div>

      {/* Notes List */}
      {notes.length > 0 ? (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="p-3 border border-gray-200 rounded-lg">
              {editingId === note.id ? (
                // Edit Mode
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-sm"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-sm min-h-[100px]"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      onClick={cancelEditing}
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      className="flex items-center gap-1 px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={saveEdit}
                    >
                      <Check className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                  </div>
                </>
              ) : (
                // View Mode
                <>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{note.title}</h3>
                    <div className="flex space-x-1">
                      <button
                        className="p-1 text-gray-500 hover:text-blue-600"
                        onClick={() => startEditing(note)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1 text-gray-500 hover:text-red-600"
                        onClick={() => deleteNote(note.id)}
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    Last updated: {new Date(note.updatedAt).toLocaleString()}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <p>No notes yet. Create your first note above!</p>
        </div>
      )}
    </div>
  );
}
