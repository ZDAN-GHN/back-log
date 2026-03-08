import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '../types';

interface SettingsState extends Settings {
  updateSettings: (settings: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  enableSound: true,
  theme: 'system',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      updateSettings: (newSettings) => 
        set((state) => ({ ...state, ...newSettings })),
        
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'settings-storage',
    }
  )
);
