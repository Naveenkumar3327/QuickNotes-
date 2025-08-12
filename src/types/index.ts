export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  isInTrash: boolean;
  reminder?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface AppState {
  user: User | null;
  notes: Note[];
  darkMode: boolean;
  searchQuery: string;
  selectedTags: string[];
}

export type ViewMode = 'all' | 'pinned' | 'archived' | 'trash';

export const NOTE_COLORS = [
  { name: 'Default', value: '#ffffff', dark: '#2d3748' },
  { name: 'Yellow', value: '#fef3c7', dark: '#92400e' },
  { name: 'Green', value: '#d1fae5', dark: '#065f46' },
  { name: 'Blue', value: '#dbeafe', dark: '#1e3a8a' },
  { name: 'Purple', value: '#e9d5ff', dark: '#581c87' },
  { name: 'Pink', value: '#fce7f3', dark: '#be185d' },
  { name: 'Orange', value: '#fed7aa', dark: '#c2410c' },
  { name: 'Red', value: '#fee2e2', dark: '#b91c1c' },
];