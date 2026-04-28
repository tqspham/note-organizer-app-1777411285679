'use client';

import { useEffect, useState } from 'react';
import { useNotesStore } from '@/lib/store';
import NotesHeader from './NotesHeader';
import NotesList from './NotesList';
import NoteDetail from './NoteDetail';
import CreateNoteModal from './CreateNoteModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

export default function NotesApp() {
  const {
    notes,
    isLoading,
    error,
    selectedNoteId,
    fetchNotes,
  } = useNotesStore();

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  const handleDeleteClick = (id: string) => {
    setNoteToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (noteToDelete) {
      try {
        const { deleteNote } = useNotesStore.getState();
        await deleteNote(noteToDelete);
        setShowDeleteConfirm(false);
        setNoteToDelete(null);
      } catch (error) {
        setShowDeleteConfirm(false);
        setNoteToDelete(null);
      }
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <NotesHeader onCreateClick={() => setShowCreateModal(true)} />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-full md:w-96 border-r border-gray-200 bg-white overflow-y-auto">
          <NotesList onDeleteClick={handleDeleteClick} />
        </div>
        
        <div className="hidden md:flex flex-1 flex-col bg-gray-50">
          {selectedNote ? (
            <NoteDetail
              note={selectedNote}
              onDeleteClick={handleDeleteClick}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <p className="text-lg font-medium">Select a note to view</p>
                <p className="text-sm mt-2">Click on a note from the list to see its contents</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateNoteModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          mode="create"
        />
      )}

      {showDeleteConfirm && (
        <ConfirmDeleteModal
          isOpen={showDeleteConfirm}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setNoteToDelete(null);
          }}
        />
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
