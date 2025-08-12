import React, { useState, useEffect } from 'react';
import { Save, X, Palette, Tag } from 'lucide-react';
import { Note, NOTE_COLORS } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface NoteEditorProps {
  note?: Note | null;
  onClose: () => void;
}

export default function NoteEditor({ note, onClose }: NoteEditorProps) {
  const { createNote, updateNote, state } = useApp();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setColor(note.color);
    } else {
      setTitle('');
      setContent('');
      setColor('#ffffff');
    }
  }, [note]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      onClose();
      return;
    }

    if (note) {
      updateNote(note.id, {
        title: title.trim() || 'Untitled',
        content: content.trim(),
        color,
      });
    } else {
      createNote(title.trim() || 'Untitled', content.trim(), color);
    }

    onClose();
  };

  const currentColor = NOTE_COLORS.find(c => c.value === color) || NOTE_COLORS[0];
  const backgroundColor = state.darkMode ? currentColor.dark : currentColor.value;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
        style={{ backgroundColor }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {note ? 'Edit Note' : 'Create Note'}
            </h2>
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>

              {showColorPicker && (
                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 p-3 z-10">
                  <div className="grid grid-cols-4 gap-2">
                    {NOTE_COLORS.map((noteColor) => (
                      <button
                        key={noteColor.value}
                        onClick={() => {
                          setColor(noteColor.value);
                          setShowColorPicker(false);
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                          noteColor.value === color ? 'border-gray-800 dark:border-white' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        style={{ backgroundColor: state.darkMode ? noteColor.dark : noteColor.value }}
                        title={noteColor.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-semibold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            autoFocus
          />
          
          <textarea
            placeholder="Start writing your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-96 bg-transparent border-none outline-none resize-none text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          {note ? (
            <p>Last updated: {new Date(note.updatedAt).toLocaleString()}</p>
          ) : (
            <p>Press Cmd+Enter or click Save to create note</p>
          )}
        </div>
      </div>
    </div>
  );
}