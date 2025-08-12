import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Pin, 
  Archive, 
  Trash2, 
  RotateCcw, 
  Edit, 
  Palette, 
  Tag,
  MoreVertical,
  Download
} from 'lucide-react';
import { Note, NOTE_COLORS } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface NoteCardProps {
  note: Note;
  viewMode: string;
  onEdit: (note: Note) => void;
  onExport: (note: Note) => void;
}

export default function NoteCard({ note, viewMode, onEdit, onExport }: NoteCardProps) {
  const { togglePin, toggleArchive, moveToTrash, restoreNote, permanentlyDeleteNote, updateNote, addTag, removeTag, state } = useApp();
  const [showMenu, setShowMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');

  const currentColor = NOTE_COLORS.find(c => c.value === note.color) || NOTE_COLORS[0];
  const backgroundColor = state.darkMode ? currentColor.dark : currentColor.value;

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !note.tags.includes(newTag.trim())) {
      addTag(note.id, newTag.trim());
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const handleColorChange = (color: string) => {
    updateNote(note.id, { color });
    setShowColorPicker(false);
  };

  return (
    <div
      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200 dark:border-gray-700"
      style={{ backgroundColor }}
    >
      {/* Pin indicator */}
      {note.isPinned && viewMode !== 'trash' && (
        <div className="absolute top-3 right-3 z-10">
          <Pin className="w-4 h-4 text-yellow-600 dark:text-yellow-400 fill-current" />
        </div>
      )}

      <div className="p-4">
        {/* Note Content */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {note.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-4">
            {note.content}
          </p>
        </div>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
                <button
                  onClick={() => removeTag(note.id, tag)}
                  className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div>
            <p>Created {format(new Date(note.createdAt), 'MMM d, yyyy')}</p>
            {note.createdAt !== note.updatedAt && (
              <p>Updated {format(new Date(note.updatedAt), 'MMM d, yyyy')}</p>
            )}
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-20 min-w-[140px]">
                <button
                  onClick={() => {
                    onEdit(note);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>

                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Color
                </button>

                <button
                  onClick={() => setShowTagInput(!showTagInput)}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  Add Tag
                </button>

                <button
                  onClick={() => {
                    onExport(note);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>

                <hr className="my-1 border-gray-200 dark:border-gray-600" />

                {viewMode === 'trash' ? (
                  <>
                    <button
                      onClick={() => {
                        restoreNote(note.id);
                        setShowMenu(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Permanently delete this note? This cannot be undone.')) {
                          permanentlyDeleteNote(note.id);
                        }
                        setShowMenu(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Forever
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        togglePin(note.id);
                        setShowMenu(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <Pin className="w-4 h-4 mr-2" />
                      {note.isPinned ? 'Unpin' : 'Pin'}
                    </button>

                    <button
                      onClick={() => {
                        toggleArchive(note.id);
                        setShowMenu(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      {note.isArchived ? 'Unarchive' : 'Archive'}
                    </button>

                    <button
                      onClick={() => {
                        moveToTrash(note.id);
                        setShowMenu(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Move to Trash
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Color Picker */}
            {showColorPicker && (
              <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 p-3 z-30">
                <div className="grid grid-cols-4 gap-2">
                  {NOTE_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => handleColorChange(color.value)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                        color.value === note.color ? 'border-gray-800 dark:border-white' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      style={{ backgroundColor: state.darkMode ? color.dark : color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tag Input */}
            {showTagInput && (
              <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 p-3 z-30">
                <form onSubmit={handleAddTag} className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Enter tag"
                    className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click to edit overlay */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => onEdit(note)}
        style={{ zIndex: 1 }}
      />
    </div>
  );
}