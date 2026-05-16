import { create } from 'zustand';
import api from '../services/api';

// global note state — all CRUD operations and filter state live here
// keeping this separate from authStore makes each store focused and easy to test
export const useNoteStore = create((set, get) => ({
  notes: [],
  currentNote: null,
  isLoading: false,

  // filter state — used by SearchBar, TagFilter, and Sidebar
  searchQuery: '',
  activeTag: '',
  activeCategory: '',
  showArchived: false,

  setSearch:         (q) => set({ searchQuery: q }),
  setActiveTag:      (t) => set({ activeTag: t }),
  setActiveCategory: (c) => set({ activeCategory: c }),
  setShowArchived:   (v) => set({ showArchived: v }),
  setCurrentNote:    (n) => set({ currentNote: n }),

  // fetch notes with current filter state applied
  fetchNotes: async () => {
    set({ isLoading: true });
    try {
      const { searchQuery, activeTag, activeCategory, showArchived } = get();
      const params = { archived: showArchived };
      if (searchQuery)    params.search   = searchQuery;
      if (activeTag)      params.tag      = activeTag;
      if (activeCategory) params.category = activeCategory;
      const { data } = await api.get('/notes', { params });
      set({ notes: data.notes });
    } finally {
      set({ isLoading: false });
    }
  },

  // fetch a single note and store it as currentNote (used by the editor)
  fetchNote: async (id) => {
    const { data } = await api.get(`/notes/${id}`);
    set({ currentNote: data.note });
    return data.note;
  },

  createNote: async (payload = {}) => {
    const { data } = await api.post('/notes', payload);
    // prepend to list so it appears at the top immediately
    set((s) => ({ notes: [data.note, ...s.notes] }));
    return data.note;
  },

  updateNote: async (id, payload) => {
    const { data } = await api.put(`/notes/${id}`, payload);
    // update in-place in the list and also update currentNote if it's the same note
    set((s) => ({
      notes: s.notes.map((n) => (n._id === id ? data.note : n)),
      currentNote: s.currentNote?._id === id ? data.note : s.currentNote,
    }));
    return data.note;
  },

  deleteNote: async (id) => {
    await api.delete(`/notes/${id}`);
    set((s) => ({ notes: s.notes.filter((n) => n._id !== id), currentNote: null }));
  },

  // remove from current list after archive — the note moves to the other view
  toggleArchive: async (id) => {
    const { data } = await api.patch(`/notes/${id}/archive`);
    set((s) => ({ notes: s.notes.filter((n) => n._id !== id) }));
    return data.note;
  },

  togglePin: async (id) => {
    const { data } = await api.patch(`/notes/${id}/pin`);
    set((s) => ({ notes: s.notes.map((n) => (n._id === id ? data.note : n)) }));
  },

  toggleShare: async (id) => {
    const { data } = await api.patch(`/notes/${id}/share`);
    set((s) => ({
      notes: s.notes.map((n) => (n._id === id ? data.note : n)),
      currentNote: s.currentNote?._id === id ? data.note : s.currentNote,
    }));
    return data.note;
  },
}));
