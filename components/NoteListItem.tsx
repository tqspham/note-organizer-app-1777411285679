'use client';

import { Trash2 } from 'lucide-react';
import { Note } from '@/lib/store';
import { formatDate } from '@/lib/utils';

interface NoteListItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
  onDeleteClick: () => void;
}

export default function NoteListItem({
  note,
  isSelected,
  onSelect,
  onDeleteClick,
}: NoteListItemProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
        isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{note.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{note.content}</p>
          <p className="text-xs text-gray-500 mt-2">{formatDate(note.createdAt)}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick();
          }}
          aria-label={`Delete note: ${note.title}`}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </button>
  );
}
