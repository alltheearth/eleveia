// src/pages/Calendar/components/EventFilters.tsx
// 🔍 FILTROS AVANÇADOS PARA EVENTOS

import { motion } from 'framer-motion';
import { 
  Search, 
  X, 
  Filter, 
  Calendar as CalendarIcon,
  Grid,
  List,
  Download,
  Plus
} from 'lucide-react';
import { useState } from 'react';

// ============================================
// TYPES
// ============================================

export interface EventFiltersData {
  search: string;
  eventType: string;
  startDate: string;
  endDate: string;
}

interface EventFiltersProps {
  filters: EventFiltersData;
  onFiltersChange: (filters: EventFiltersData) => void;
  onClear: () => void;
  viewMode: 'grid' | 'list' | 'calendar';
  onViewModeChange: (mode: 'grid' | 'list' | 'calendar') => void;
  onNewEvent: () => void;
  onExport?: () => void;
  loading?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export default function EventFilters({
  filters,
  onFiltersChange,
  onClear,
  viewMode,
  onViewModeChange,
  onNewEvent,
  onExport,
  loading = false,
}: EventFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters =
    filters.search ||
    (filters.eventType && filters.eventType !== 'all') ||
    filters.startDate ||
    filters.endDate;

  const handleFilterChange = (key: keyof EventFiltersData, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header principal */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Busca */}
          <div className="flex-1 min-w-[300px] max-w-md">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 transition-all"
              />
              {filters.search && (
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Ações direita */}
          <div className="flex items-center gap-3">
            {/* Toggle filtros avançados */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                showAdvanced || hasActiveFilters
                  ? 'bg-blue-50 text-blue-600 border-2 border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Filtros</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </button>

            {/* View mode */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Visualização em grade"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Visualização em lista"
              >
                <List size={18} />
              </button>
              <button
                onClick={() => onViewModeChange('calendar')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'calendar'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Visualização em calendário"
              >
                <CalendarIcon size={18} />
              </button>
            </div>

            {/* Exportar */}
            {onExport && (
              <button
                onClick={onExport}
                disabled={loading}
                className="hidden lg:flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                <Download size={18} />
                <span>Exportar</span>
              </button>
            )}

            {/* Novo evento */}
            <button
              onClick={onNewEvent}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Novo Evento</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filtros avançados */}
      {showAdvanced && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="border-b border-gray-100"
        >
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tipo de evento */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Evento
                </label>
                <select
                  value={filters.eventType}
                  onChange={(e) => handleFilterChange('eventType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="holiday">📌 Feriado</option>
                  <option value="exam">📝 Prova</option>
                  <option value="graduation">🎓 Formatura</option>
                  <option value="cultural">🎭 Cultural</option>
                </select>
              </div>

              {/* Data inicial */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              {/* Data final */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data Final
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            {/* Botão de limpar */}
            {hasActiveFilters && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={onClear}
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

      {/* Indicador de filtros ativos */}
      {hasActiveFilters && !showAdvanced && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-700 font-semibold">
              Filtros ativos aplicados
            </p>
            <button
              onClick={onClear}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold underline"
            >
              Limpar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}