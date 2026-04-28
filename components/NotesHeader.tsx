'use client';

import { Plus, Search } from 'lucide-react';
import { useNotesStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import FilterSort from './FilterSort';

interface NotesHeaderProps {
  onCreateClick: () => void;
}

export default function NotesHeader({ onCreateClick }: NotesHeaderProps) {
  const { fetchNotes } = useNotesStore();
  const [showFilters, setShowFilters] = useState<boolean>(false);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
          <button
            onClick={onCreateClick}
            aria-label="Create new note"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus size={20} />
            New Note
          </button>
        </div>

        <div className="space-y-3">
          <SearchBar />
          <FilterSort />
        </div>
      </div>
    </header>
  );
}
