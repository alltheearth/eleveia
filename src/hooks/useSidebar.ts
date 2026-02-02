// src/hooks/useSidebar.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapse: () => void;
  toggleMobile: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setMobileOpen: (open: boolean) => void;
}

/**
 * Hook global para gerenciar o estado do Sidebar
 * Persiste preferência do usuário no localStorage
 */
export const useSidebar = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      isMobileOpen: false,
      
      toggleCollapse: () => set((state) => ({ 
        isCollapsed: !state.isCollapsed 
      })),
      
      toggleMobile: () => set((state) => ({ 
        isMobileOpen: !state.isMobileOpen 
      })),
      
      setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
      
      setMobileOpen: (open) => set({ isMobileOpen: open }),
    }),
    {
      name: 'sidebar-storage',
      partialize: (state) => ({ isCollapsed: state.isCollapsed }),
    }
  )
);