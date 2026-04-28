import { create } from 'zustand';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  folder: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotesStore {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  selectedNoteId: string | null;
  searchQuery: string;
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  selectedFolder: string | null;
  selectedTag: string | null;
  
  fetchNotes: () => Promise<void>;
  createNote: (title: string, content: string, tags: string[], folder: string) => Promise<void>;
  updateNote: (id: string, title: string, content: string, tags: string[], folder: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  setSelectedNoteId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: 'createdAt' | 'updatedAt' | 'title') => void;
  setSelectedFolder: (folder: string | null) => void;
  setSelectedTag: (tag: string | null) => void;
  clearFilters: () => void;
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: [],
  isLoading: false,
  error: null,
  selectedNoteId: null,
  searchQuery: '',
  sortBy: 'createdAt',
  selectedFolder: null,
  selectedTag: null,

  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const { searchQuery, sortBy, selectedFolder, selectedTag } = get();
      const params = new URLSearchParams();
      
      if (searchQuery) params.append('search', searchQuery);
      if (selectedFolder) params.append('folder', selectedFolder);
      if (selectedTag) params.append('tag', selectedTag);
      params.append('sortBy', sortBy);

      const response = await fetch(`/api/notes?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      
      const notes = await response.json();
      set({ notes, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch notes',
        isLoading: false 
      });
    }
  },

  createNote: async (title: string, content: string, tags: string[], folder: string) => {
    set({ error: null });
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, tags, folder }),
      });

      if (!response.ok) {
        throw new Error('Failed to create note');
      }

      const newNote = await response.json();
      set((state) => ({ notes: [newNote, ...state.notes] }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create note' });
      throw error;
    }
  },

  updateNote: async (id: string, title: string, content: string, tags: string[], folder: string) => {
    set({ error: null });
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, tags, folder }),
      });

      if (!response.ok) {
        throw new Error('Failed to update note');
      }

      const updatedNote = await response.json();
      set((state) => ({
        notes: state.notes.map((note) => (note.id === id ? updatedNote : note)),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update note' });
      throw error;
    }
  },

  deleteNote: async (id: string) => {
    set({ error: null });
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
        selectedNoteId: state.selectedNoteId === id ? null : state.selectedNoteId,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete note' });
      throw error;
    }
  },

  setSelectedNoteId: (id: string | null) => {
    set({ selectedNoteId: id });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setSortBy: (sortBy: 'createdAt' | 'updatedAt' | 'title') => {
    set({ sortBy });
  },

  setSelectedFolder: (folder: string | null) => {
    set({ selectedFolder: folder });
  },

  setSelectedTag: (tag: string | null) => {
    set({ selectedTag: tag });
  },

  clearFilters: () => {
    set({ searchQuery: '', selectedFolder: null, selectedTag: null });
  },
}));
