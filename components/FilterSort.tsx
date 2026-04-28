'use client';

import { Filter, X } from 'lucide-react';
import { useNotesStore } from '@/lib/store';
import { useState, useMemo } from 'react';

export default function FilterSort() {
  const {
    notes,
    sortBy,
    setSortBy,
    selectedFolder,
    setSelectedFolder,
    selectedTag,
    setSelectedTag,
    clearFilters,
    fetchNotes,
  } = useNotesStore();

  const [showFilters, setShowFilters] = useState<boolean>(false);

  const folders = useMemo(
    () => Array.from(new Set(notes.map((n) => n.folder))),
    [notes]
  );

  const tags = useMemo(
    () => Array.from(new Set(notes.flatMap((n) => n.tags))),
    [notes]
  );

  const handleFolderChange = (folder: string) => {
    setSelectedFolder(selectedFolder === folder ? null : folder);
    fetchNotes();
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
    fetchNotes();
  };

  const handleSortChange = (newSort: 'createdAt' | 'updatedAt' | 'title') => {
    setSortBy(newSort);
    fetchNotes();
  };

  const hasActiveFilters = selectedFolder || selectedTag;

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Filter size={16} />
          Filter & Sort
        </button>

        {hasActiveFilters && (
          <button
            onClick={() => {
              clearFilters();
              fetchNotes();
            }}
            className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <X size={16} />
            Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10 w-80">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Sort By</h3>
              <div className="space-y-2">
                {[
                  { value: 'createdAt', label: 'Creation Date' },
                  { value: 'updatedAt', label: 'Modification Date' },
                  { value: 'title', label: 'Alphabetically' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      value={option.value}
                      checked={sortBy === option.value}
                      onChange={() => handleSortChange(option.value as 'createdAt' | 'updatedAt' | 'title')}
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {folders.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Folders</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {folders.map((folder) => (
                    <label key={folder} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFolder === folder}
                        onChange={() => handleFolderChange(folder)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{folder}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {tags.map((tag) => (
                    <label key={tag} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTag === tag}
                        onChange={() => handleTagChange(tag)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
