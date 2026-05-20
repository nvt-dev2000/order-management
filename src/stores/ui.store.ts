import { create } from "zustand";
import { persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/constants";
import i18n from "@/i18n";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

interface UiState {
  sidebarCollapsed: boolean;
  locale: Locale;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setLocale: (locale: Locale) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      locale: DEFAULT_LOCALE,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setLocale: (locale) => {
        void i18n.changeLanguage(locale);
        set({ locale });
      },
    }),
    {
      name: STORAGE_KEYS.UI,
      onRehydrateStorage: () => (state) => {
        if (state?.locale) void i18n.changeLanguage(state.locale);
      },
    },
  ),
);
