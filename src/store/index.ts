import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Theme, ToastMessage } from '@/src/types';
import { THEME_CONFIG, TOAST_CONFIG, STORAGE_KEYS } from '@/src/constants';

// Theme store
interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      (set, get) => ({
        theme: THEME_CONFIG.default as Theme,
        setTheme: (theme) => set({ theme }),
        toggleTheme: () => {
          const currentTheme = get().theme;
          const newTheme = currentTheme === 'light' ? 'dark' : 'light';
          set({ theme: newTheme });
        },
      }),
      {
        name: STORAGE_KEYS.THEME,
      }
    ),
    { name: 'theme-store' }
  )
);

// Toast store
interface ToastStore {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>()(
  devtools(
    (set, get) => ({
      toasts: [],
      addToast: (toast) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: ToastMessage = {
          ...toast,
          id,
          duration: toast.duration || TOAST_CONFIG.defaultDuration,
        };

        set((state) => {
          const newToasts = [...state.toasts, newToast];
          // Limit number of toasts
          if (newToasts.length > TOAST_CONFIG.maxToasts) {
            newToasts.shift();
          }
          return { toasts: newToasts };
        });

        // Auto-remove toast after duration
        if (newToast.duration && newToast.duration > 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, newToast.duration);
        }
      },
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
      clearToasts: () => set({ toasts: [] }),
    }),
    { name: 'toast-store' }
  )
);

// UI store for global UI state
interface UIStore {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      loading: false,
      setLoading: (loading) => set({ loading }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      selectedCategory: 'all',
      setSelectedCategory: (category) => set({ selectedCategory: category }),
    }),
    { name: 'ui-store' }
  )
);

// Draft store for auto-saving drafts
interface DraftData {
  title: string;
  content: string;
  author: string;
  image: string;
  selectedCategories: number[];
  lastSaved: Date;
}

interface DraftStore {
  draft: DraftData | null;
  saveDraft: (draft: Omit<DraftData, 'lastSaved'>) => void;
  loadDraft: () => DraftData | null;
  clearDraft: () => void;
  hasDraft: () => boolean;
}

export const useDraftStore = create<DraftStore>()(
  devtools(
    persist(
      (set, get) => ({
        draft: null,
        saveDraft: (draftData) => {
          const draft: DraftData = {
            ...draftData,
            lastSaved: new Date(),
          };
          set({ draft });
        },
        loadDraft: () => get().draft,
        clearDraft: () => set({ draft: null }),
        hasDraft: () => {
          const draft = get().draft;
          return draft !== null && (!!draft.title.trim() || !!draft.content.trim());
        },
      }),
      {
        name: STORAGE_KEYS.DRAFT,
      }
    ),
    { name: 'draft-store' }
  )
);

// User preferences store
interface UserPreferences {
  editorMode: 'simple' | 'rich';
  autoSave: boolean;
  showKeyboardShortcuts: boolean;
  defaultAuthor: string;
}

interface PreferencesStore {
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  editorMode: 'rich',
  autoSave: true,
  showKeyboardShortcuts: true,
  defaultAuthor: '',
};

export const usePreferencesStore = create<PreferencesStore>()(
  devtools(
    persist(
      (set) => ({
        preferences: defaultPreferences,
        updatePreferences: (newPreferences) =>
          set((state) => ({
            preferences: { ...state.preferences, ...newPreferences },
          })),
        resetPreferences: () => set({ preferences: defaultPreferences }),
      }),
      {
        name: STORAGE_KEYS.USER_PREFERENCES,
      }
    ),
    { name: 'preferences-store' }
  )
);