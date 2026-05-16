import { create } from 'zustand';

// reads saved preference from localStorage, defaults to light
const saved = localStorage.getItem('theme') || 'light';
document.documentElement.classList.toggle('dark', saved === 'dark');

export const useThemeStore = create((set) => ({
  theme: saved,

  toggleTheme: () => {
    set((s) => {
      const next = s.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      // tailwind darkMode: 'class' watches for this class on <html>
      document.documentElement.classList.toggle('dark', next === 'dark');
      return { theme: next };
    });
  },
}));
