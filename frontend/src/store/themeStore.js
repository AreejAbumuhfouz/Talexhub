import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
};

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light',

      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light';
        applyTheme(next);
        set({ theme: next });
      },

      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },

      // Call this once on app mount to sync DOM with persisted value
      init: () => {
        applyTheme(get().theme);
      },
    }),
    {
      name: 'talexhub-theme', // localStorage key
    }
  )
);

export default useThemeStore;