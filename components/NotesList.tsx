'use client';

import { useNotesStore } from '@/lib/store';
import NoteListItem from './NoteListItem';
import { useEffect } from 'react';

interface NotesListProps {
  onDeleteClick: (id: string) => void;
}

export default function NotesList({ onDeleteClick }: NotesListProps) {
  const { notes, isLoading, selectedNoteId, setSelectedNoteId, fetchNotes } = useNotesStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 animate-spin">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading notes...</p>
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">No notes yet</p>
          <p className="text-sm text-gray-500 mt-2">Create your first note to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {notes.map((note) => (
        <NoteListItem
          key={note.id}
          note={note}
          isSelected={selectedNoteId === note.id}
          onSelect={() => setSelectedNoteId(note.id)}
          onDeleteClick={() => onDeleteClick(note.id)}
        />
      ))}
    </div>
  );
}
