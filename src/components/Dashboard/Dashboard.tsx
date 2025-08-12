import React, { useState } from 'react';
import { ViewMode, Note } from '../../types';
import { useApp } from '../../contexts/AppContext';
import Header from '../Layout/Header';
import NotesGrid from '../Notes/NotesGrid';
import NoteEditor from '../Notes/NoteEditor';
import ExportModal from '../Notes/ExportModal';

export default function Dashboard() {
  const { getFilteredNotes } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [exportingNote, setExportingNote] = useState<Note | null>(null);

  const notes = getFilteredNotes(viewMode);

  const handleCreateNote = () => {
    setEditingNote(null);
    setShowNoteEditor(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowNoteEditor(true);
  };

  const handleCloseEditor = () => {
    setEditingNote(null);
    setShowNoteEditor(false);
  };

  const handleExportNote = (note: Note) => {
    setExportingNote(note);
  };

  const handleCloseExport = () => {
    setExportingNote(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCreateNote={handleCreateNote}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
            {viewMode === 'all' ? 'All Notes' : `${viewMode} Notes`}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </p>
        </div>

        <NotesGrid
          notes={notes}
          viewMode={viewMode}
          onEditNote={handleEditNote}
          onExportNote={handleExportNote}
        />
      </main>

      {/* Note Editor Modal */}
      {showNoteEditor && (
        <NoteEditor
          note={editingNote}
          onClose={handleCloseEditor}
        />
      )}

      {/* Export Modal */}
      {exportingNote && (
        <ExportModal
          note={exportingNote}
          onClose={handleCloseExport}
        />
      )}
    </div>
  );
}