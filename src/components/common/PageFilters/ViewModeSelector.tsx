// src/components/common/PageFilters/ViewModeSelector.tsx
// 🎯 SELETOR DE MODO DE VISUALIZAÇÃO
// Componente para alternar entre Grid, List, Kanban, Calendar, etc.

import type { ReactNode } from 'react';

// ============================================
// TYPES
// ============================================

interface ViewMode {
  value: string;
  icon: ReactNode;
  label: string;
}

interface ViewModeSelectorProps {
  modes: ViewMode[];
  currentMode: string;
  onChange: (mode: string) => void;
  disabled?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export default function ViewModeSelector({
  modes,
  currentMode,
  onChange,
  disabled = false,
}: ViewModeSelectorProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onChange(mode.value)}
          disabled={disabled}
          className={`p-2 rounded-lg transition-all disabled:opacity-50 ${
            currentMode === mode.value
              ? 'bg-white shadow-sm text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          title={mode.label}
        >
          {mode.icon}
        </button>
      ))}
    </div>
  );
}