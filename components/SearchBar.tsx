'use client';

import { Search } from 'lucide-react';
import { useNotesStore } from '@/lib/store';
import { useCallback, useEffect, useState } from 'react';

export default function SearchBar() {
  const { searchQuery, setSearchQuery, fetchNotes } = useNotesStore();
  const [localSearch, setLocalSearch] = useState<string>(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
      fetchNotes();
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery, fetchNotes]);

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="search-notes" className="sr-only">
        Search notes
      </label>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          id="search-notes"
          type="text"
          placeholder="Search by title or content..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
