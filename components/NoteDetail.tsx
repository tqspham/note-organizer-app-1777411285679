'use client';

import { Note } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { Edit2, Trash2, Tag, Folder } from 'lucide-react';
import { useState } from 'react';
import CreateNoteModal from './CreateNoteModal';

interface NoteDetailProps {
  note: Note;
  onDeleteClick: (id: string) => void;
}

export default function NoteDetail({ note, onDeleteClick }: NoteDetailProps) {
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{note.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Created: {formatDate(note.createdAt)}</span>
              {note.updatedAt !== note.createdAt && (
                <span>Modified: {formatDate(note.updatedAt)}</span>
              )}
            </div>
          </div>

          {(note.folder || note.tags.length > 0) && (
            <div className="mb-6 flex flex-wrap gap-3">
              {note.folder && (
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                  <Folder size={14} />
                  {note.folder}
                </div>
              )}
              {note.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full text-sm text-blue-700"
                >
                  <Tag size={14} />
                  {tag}
                </div>
              ))}
            </div>
          )}

          <div className="prose prose-sm max-w-none mb-8">
            <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{note.content}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white px-6 py-4 flex items-center justify-end gap-3">
        <button
          onClick={() => setShowEditModal(true)}
          aria-label={`Edit note: ${note.title}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Edit2 size={18} />
          Edit
        </button>
        <button
          onClick={() => onDeleteClick(note.id)}
          aria-label={`Delete note: ${note.title}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <Trash2 size={18} />
          Delete
        </button>
      </div>

      {showEditModal && (
        <CreateNoteModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          mode="edit"
          initialNote={note}
        />
      )}
    </>
  );
}
