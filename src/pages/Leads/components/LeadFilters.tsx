// EXEMPLO: LeadFilters.tsx REFATORADO
// src/pages/Leads/components/LeadFilters.tsx

import { PageFilters } from '../../../components/common';
import { Grid3x3, List, Kanban } from 'lucide-react';
import type { Lead } from '../../../services';

// ============================================
// TYPES
// ============================================

export type LeadViewMode = 'grid' | 'list' | 'kanban';

interface LeadFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  origemFilter: string;
  onOrigemFilterChange: (value: string) => void;
  viewMode: LeadViewMode;
  onViewModeChange: (mode: LeadViewMode) => void;
  onNewLead: () => void;
  onExport?: () => void;
  onRefresh?: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  isExporting?: boolean;
  isRefreshing?: boolean;
}

// ============================================
// OPÇÕES DE FILTRO
// ============================================

const STATUS_OPTIONS: { value: string; label: string; emoji: string }[] = [
  { value: 'todos', label: 'Todos os Status', emoji: '📊' },
  { value: 'novo', label: 'Novos', emoji: '🆕' },
  { value: 'contato', label: 'Em Contato', emoji: '📞' },
  { value: 'qualificado', label: 'Qualificados', emoji: '⭐' },
  { value: 'conversao', label: 'Convertidos', emoji: '✅' },
  { value: 'perdido', label: 'Perdidos', emoji: '❌' },
];

const ORIGEM_OPTIONS: { value: string; label: string }[] = [
  { value: 'todas', label: 'Todas as Origens' },
  { value: 'site', label: 'Site' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'indicacao', label: 'Indicação' },
  { value: 'ligacao', label: 'Ligação' },
  { value: 'email', label: 'Email' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
];

// ============================================
// COMPONENT
// ============================================

export default function LeadFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  origemFilter,
  onOrigemFilterChange,
  viewMode,
  onViewModeChange,
  onNewLead,
  onExport,
  onRefresh,
  onClearFilters,
  hasActiveFilters,
  isExporting = false,
  isRefreshing = false,
}: LeadFiltersProps) {
  
  return (
    <PageFilters
      // ========== BUSCA ==========
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      searchPlaceholder="Buscar por nome, email ou telefone..."
      
      // ========== VIEW MODE ==========
      viewMode={viewMode}
      viewModes={[
        { value: 'grid', icon: <Grid3x3 size={18} />, label: 'Grade' },
        { value: 'list', icon: <List size={18} />, label: 'Lista' },
        { value: 'kanban', icon: <Kanban size={18} />, label: 'Kanban' },
      ]}
      onViewModeChange={(mode) => onViewModeChange(mode as LeadViewMode)}
      
      // ========== AÇÕES ==========
      onNew={onNewLead}
      newLabel="Novo Lead"
      onExport={onExport}
      onRefresh={onRefresh}
      
      // ========== FILTROS AVANÇADOS (SLOT CUSTOMIZÁVEL) ==========
      advancedFilters={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Status do Lead */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status do Lead
            </label>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.emoji} {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Origem do Lead */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Origem do Lead
            </label>
            <select
              value={origemFilter}
              onChange={(e) => onOrigemFilterChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              {ORIGEM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      }
      
      // ========== ESTADO ==========
      hasActiveFilters={hasActiveFilters}
      onClearFilters={onClearFilters}
      loading={isRefreshing}
    />
  );
}