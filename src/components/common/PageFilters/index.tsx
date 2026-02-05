// src/components/common/PageFilters/index.tsx
// 🔍 PAGE FILTERS REUTILIZÁVEL
// Componente de filtros usado em todas as páginas
// Design baseado em LeadFilters (visual) e EventFilters (perfeição funcional)

import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, Download, RefreshCw, X } from 'lucide-react';
import ViewModeSelector from './ViewModeSelector';

// ============================================
// TYPES
// ============================================

interface ViewMode {
  value: string;
  icon: ReactNode;
  label: string;
}

interface PageFiltersProps {
  // ========== BUSCA ==========
  /** Termo de busca atual */
  searchTerm: string;
  
  /** Callback quando o termo de busca muda */
  onSearchChange: (value: string) => void;
  
  /** Placeholder do campo de busca */
  searchPlaceholder?: string;
  
  // ========== VIEW MODE ==========
  /** Modo de visualização atual (grid, list, kanban, etc) */
  viewMode?: string;
  
  /** Modos de visualização disponíveis */
  viewModes?: ViewMode[];
  
  /** Callback quando o modo de visualização muda */
  onViewModeChange?: (mode: string) => void;
  
  // ========== AÇÕES PRINCIPAIS ==========
  /** Callback para criar novo item */
  onNew?: () => void;
  
  /** Label do botão de novo (ex: "Novo Lead", "Novo Evento") */
  newLabel?: string;
  
  /** Callback para exportar dados */
  onExport?: () => void;
  
  /** Callback para atualizar dados */
  onRefresh?: () => void;
  
  // ========== FILTROS AVANÇADOS ==========
  /** Conteúdo dos filtros avançados (slot customizável) */
  advancedFilters?: ReactNode;
  
  /** Se há filtros ativos */
  hasActiveFilters?: boolean;
  
  /** Callback para limpar todos os filtros */
  onClearFilters?: () => void;
  
  // ========== ESTADOS ==========
  /** Estado de loading */
  loading?: boolean;
  
  /** Se está desabilitado */
  disabled?: boolean;
  
  /** Classes CSS adicionais */
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export default function PageFilters({
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  viewMode,
  viewModes,
  onViewModeChange,
  onNew,
  newLabel = 'Novo',
  onExport,
  onRefresh,
  advancedFilters,
  hasActiveFilters = false,
  onClearFilters,
  loading = false,
  disabled = false,
  className = '',
}: PageFiltersProps) {
  
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      
      {/* ========================================== */}
      {/* HEADER PRINCIPAL */}
      {/* ========================================== */}
      
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          
          {/* ========== BUSCA ========== */}
          <div className="flex-1 min-w-[300px] max-w-md">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                disabled={disabled}
                className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Limpar busca"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* ========== AÇÕES DIREITA ========== */}
          <div className="flex items-center gap-3">
            
            {/* Filtros avançados */}
            {advancedFilters && (
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                disabled={disabled}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 ${
                  showAdvanced || hasActiveFilters
                    ? 'bg-blue-50 text-blue-600 border-2 border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Filtros avançados"
              >
                <Filter size={18} />
                <span className="hidden sm:inline">Filtros</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                )}
              </button>
            )}

            {/* View mode selector */}
            {viewModes && viewMode && onViewModeChange && (
              <ViewModeSelector
                modes={viewModes}
                currentMode={viewMode}
                onChange={onViewModeChange}
                disabled={disabled}
              />
            )}

            {/* Refresh */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={disabled || loading}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all disabled:opacity-50"
                title="Atualizar"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin text-blue-600' : 'text-gray-700'} />
              </button>
            )}

            {/* Export */}
            {onExport && (
              <button
                onClick={onExport}
                disabled={disabled || loading}
                className="hidden lg:flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all disabled:opacity-50"
                title="Exportar dados"
              >
                <Download size={18} />
                <span>Exportar</span>
              </button>
            )}

            {/* Novo */}
            {onNew && (
              <button
                onClick={onNew}
                disabled={disabled}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">{newLabel}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* FILTROS AVANÇADOS (SLOT CUSTOMIZÁVEL) */}
      {/* ========================================== */}
      
      <AnimatePresence>
        {showAdvanced && advancedFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-gray-100 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              {/* Conteúdo customizável por página */}
              {advancedFilters}
              
              {/* Botão de limpar filtros */}
              {hasActiveFilters && onClearFilters && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={onClearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                  >
                    <X size={16} />
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* INDICADOR DE FILTROS ATIVOS */}
      {/* ========================================== */}
      
      {hasActiveFilters && !showAdvanced && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-blue-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              Filtros ativos
            </span>
            {onClearFilters && (
              <button
                onClick={onClearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}