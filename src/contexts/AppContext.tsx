import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Note, AppState, ViewMode } from '../types';

interface AppContextType {
  state: AppState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  createNote: (title: string, content: string, color?: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  permanentlyDeleteNote: (id: string) => void;
  restoreNote: (id: string) => void;
  togglePin: (id: string) => void;
  toggleArchive: (id: string) => void;
  moveToTrash: (id: string) => void;
  addTag: (noteId: string, tag: string) => void;
  removeTag: (noteId: string, tag: string) => void;
  setSearchQuery: (query: string) => void;
  toggleDarkMode: () => void;
  updateProfile: (updates: Partial<User>) => void;
  getFilteredNotes: (viewMode: ViewMode) => Note[];
  getAllTags: () => string[];
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: { id: string; updates: Partial<Note> } }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'LOAD_STATE'; payload: AppState };

const initialState: AppState = {
  user: null,
  notes: [],
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  searchQuery: '',
  selectedTags: [],
};

const AppContext = createContext<AppContextType | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id
            ? { ...note, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : note
        ),
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload),
      };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load saved state on mount
  useEffect(() => {
    const savedState = localStorage.getItem('quicknotes-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  // Save state changes
  useEffect(() => {
    localStorage.setItem('quicknotes-state', JSON.stringify(state));
    document.documentElement.classList.toggle('dark', state.darkMode);
  }, [state]);

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('quicknotes-users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      dispatch({ type: 'SET_USER', payload: userWithoutPassword });
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('quicknotes-users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      return false; // User already exists
    }

    const newUser = {
      id: generateId(),
      email,
      password,
      name,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('quicknotes-users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    dispatch({ type: 'SET_USER', payload: userWithoutPassword });
    return true;
  };

  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_NOTES', payload: [] });
  };

  const createNote = (title: string, content: string, color = '#ffffff') => {
    if (!state.user) return;

    const newNote: Note = {
      id: generateId(),
      title: title || 'Untitled',
      content,
      color,
      tags: [],
      isPinned: false,
      isArchived: false,
      isInTrash: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: state.user.id,
    };

    dispatch({ type: 'ADD_NOTE', payload: newNote });
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    dispatch({ type: 'UPDATE_NOTE', payload: { id, updates } });
  };

  const deleteNote = (id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: id });
  };

  const permanentlyDeleteNote = (id: string) => {
    deleteNote(id);
  };

  const restoreNote = (id: string) => {
    updateNote(id, { isInTrash: false, isArchived: false });
  };

  const togglePin = (id: string) => {
    const note = state.notes.find(n => n.id === id);
    if (note) {
      updateNote(id, { isPinned: !note.isPinned });
    }
  };

  const toggleArchive = (id: string) => {
    const note = state.notes.find(n => n.id === id);
    if (note) {
      updateNote(id, { isArchived: !note.isArchived, isInTrash: false });
    }
  };

  const moveToTrash = (id: string) => {
    updateNote(id, { isInTrash: true, isArchived: false, isPinned: false });
  };

  const addTag = (noteId: string, tag: string) => {
    const note = state.notes.find(n => n.id === noteId);
    if (note && !note.tags.includes(tag)) {
      updateNote(noteId, { tags: [...note.tags, tag] });
    }
  };

  const removeTag = (noteId: string, tag: string) => {
    const note = state.notes.find(n => n.id === noteId);
    if (note) {
      updateNote(noteId, { tags: note.tags.filter(t => t !== tag) });
    }
  };

  const setSearchQuery = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!state.user) return;
    
    const updatedUser = { ...state.user, ...updates };
    dispatch({ type: 'SET_USER', payload: updatedUser });

    // Update in localStorage
    const users = JSON.parse(localStorage.getItem('quicknotes-users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === state.user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('quicknotes-users', JSON.stringify(users));
    }
  };

  const getFilteredNotes = (viewMode: ViewMode): Note[] => {
    let filtered = state.notes.filter(note => {
      if (!state.user || note.userId !== state.user.id) return false;

      switch (viewMode) {
        case 'pinned':
          return note.isPinned && !note.isInTrash && !note.isArchived;
        case 'archived':
          return note.isArchived && !note.isInTrash;
        case 'trash':
          return note.isInTrash;
        default:
          return !note.isInTrash && !note.isArchived;
      }
    });

    if (state.searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(state.searchQuery.toLowerCase()))
      );
    }

    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  };

  const getAllTags = (): string[] => {
    const allTags = state.notes
      .filter(note => note.userId === state.user?.id && !note.isInTrash)
      .flatMap(note => note.tags);
    return [...new Set(allTags)].sort();
  };

  const value: AppContextType = {
    state,
    login,
    register,
    logout,
    createNote,
    updateNote,
    deleteNote,
    permanentlyDeleteNote,
    restoreNote,
    togglePin,
    toggleArchive,
    moveToTrash,
    addTag,
    removeTag,
    setSearchQuery,
    toggleDarkMode,
    updateProfile,
    getFilteredNotes,
    getAllTags,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}