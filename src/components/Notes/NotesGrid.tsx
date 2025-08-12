import React from 'react';
import { FileText, Archive, Trash2, Pin } from 'lucide-react';
import { Note, ViewMode } from '../../types';
import NoteCard from './NoteCard';

interface NotesGridProps {
  notes: Note[];
  viewMode: ViewMode;
  onEditNote: (note: Note) => void;
  onExportNote: (note: Note) => void;
}

export default function NotesGrid({ notes, viewMode, onEditNote, onExportNote }: NotesGridProps) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          {viewMode === 'pinned' ? (
            <Pin className="w-8 h-8 text-gray-400" />
          ) : viewMode === 'archived' ? (
            <Archive className="w-8 h-8 text-gray-400" />
          ) : viewMode === 'trash' ? (
            <Trash2 className="w-8 h-8 text-gray-400" />
          ) : (
            <FileText className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {viewMode === 'pinned' && 'No pinned notes'}
          {viewMode === 'archived' && 'No archived notes'}
          {viewMode === 'trash' && 'Trash is empty'}
          {viewMode === 'all' && 'No notes yet'}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          {viewMode === 'pinned' && 'Pin your important notes to keep them at the top.'}
          {viewMode === 'archived' && 'Archived notes will appear here.'}
          {viewMode === 'trash' && 'Deleted notes will appear here for 30 days before being permanently deleted.'}
          {viewMode === 'all' && 'Create your first note to get started with QuickNotes+.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          viewMode={viewMode}
          onEdit={onEditNote}
          onExport={onExportNote}
        />
      ))}
    </div>
  );
}