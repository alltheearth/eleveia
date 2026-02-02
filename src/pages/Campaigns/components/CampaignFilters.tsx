// src/pages/Campaigns/components/CampaignFilters.tsx
// 🔍 FILTROS AVANÇADOS DE CAMPANHAS - PROFISSIONAL

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  Plus,
  Download,
  Grid3x3,
  List,
  Kanban,
  RefreshCw
} from 'lucide-react';
import { useState } from 'react';
import type { CampaignType, CampaignStatus } from '../../../types/campaigns/campaign.types';

// ============================================
// TYPES
// ============================================

export type CampaignViewMode = 'grid' | 'list' | 'kanban';

export interface CampaignFiltersData {
  search: string;
  status: 'all' | CampaignStatus;
  type: 'all' | CampaignType;
  dateFrom: string;
  dateTo: string;
}

interface CampaignFiltersProps {
  filters: CampaignFiltersData;
  onFiltersChange: (filters: CampaignFiltersData) => void;
  onClear: () => void;
  viewMode: CampaignViewMode;
  onViewModeChange: (mode: CampaignViewMode) => void;
  onNewCampaign: () => void;
  onExport?: () => void;
  onRefresh?: () => void;
  hasActiveFilters: boolean;
  isExporting?: boolean;
  isRefreshing?: boolean;
}

// ============================================
// OPTIONS
// ============================================

const STATUS_OPTIONS: Array<{ value: string; label: string; emoji: string }> = [
  { value: 'all', label: 'Todos os Status', emoji: '📊' },
  { value: 'draft', label: 'Rascunho', emoji: '📝' },
  { value: 'scheduled', label: 'Agendada', emoji: '⏰' },
  { value: 'sending', label: 'Enviando', emoji: '🚀' },
  { value: 'sent', label: 'Enviada', emoji: '✅' },
  { value: 'completed', label: 'Concluída', emoji: '✅' },
  { value: 'paused', label: 'Pausada', emoji: '⏸️' },
  { value: 'cancelled', label: 'Cancelada', emoji: '🚫' },
  { value: 'failed', label: 'Falhou', emoji: '❌' },
];

const TYPE_OPTIONS: Array<{ value: string; label: string; emoji: string }> = [
  { value: 'all', label: 'Todos os Tipos', emoji: '📋' },
  { value: 'matricula', label: 'Matrícula', emoji: '🎓' },
  { value: 'rematricula', label: 'Rematrícula', emoji: '🔄' },
  { value: 'passei_direto', label: 'Passei Direto', emoji: '🎉' },
  { value: 'reuniao', label: 'Reunião', emoji: '📅' },
  { value: 'evento', label: 'Evento', emoji: '🎊' },
  { value: 'cobranca', label: 'Cobrança', emoji: '💰' },
  { value: 'comunicado', label: 'Comunicado', emoji: '📢' },
];

// ============================================
// COMPONENT
// ============================================

export default function CampaignFilters({
  filters,
  onFiltersChange,
  onClear,
  viewMode,
  onViewModeChange,
  onNewCampaign,
  onExport,
  onRefresh,
  hasActiveFilters,
  isExporting = false,
  isRefreshing = false,
}: CampaignFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof CampaignFiltersData, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      
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
                placeholder="Buscar por nome, tipo ou descrição..."
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
            
            {/* Filtros avançados */}
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
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
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
                <Grid3x3 size={18} />
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
                onClick={() => onViewModeChange('kanban')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Visualização Kanban"
              >
                <Kanban size={18} />
              </button>
            </div>

            {/* Refresh */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="hidden lg:flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                <span>Atualizar</span>
              </button>
            )}

            {/* Exportar */}
            {onExport && (
              <button
                onClick={onExport}
                disabled={isExporting}
                className="hidden lg:flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                <Download size={18} />
                <span>{isExporting ? 'Exportando...' : 'Exportar'}</span>
              </button>
            )}

            {/* Nova campanha */}
            <button
              onClick={onNewCampaign}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Nova Campanha</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filtros avançados */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-gray-100 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.emoji} {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de Campanha
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    {TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.emoji} {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Data inicial */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Data Inicial
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
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
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
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
      </AnimatePresence>

      {/* Indicador de filtros ativos */}
      {hasActiveFilters && !showAdvanced && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-blue-700">Filtros ativos:</span>
              
              {filters.search && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  Busca: "{filters.search.slice(0, 20)}{filters.search.length > 20 ? '...' : ''}"
                </span>
              )}
              
              {filters.status !== 'all' && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                  Status: {STATUS_OPTIONS.find(s => s.value === filters.status)?.label}
                </span>
              )}
              
              {filters.type !== 'all' && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  Tipo: {TYPE_OPTIONS.find(t => t.value === filters.type)?.label}
                </span>
              )}
              
              {(filters.dateFrom || filters.dateTo) && (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                  Período: {filters.dateFrom || '...'} até {filters.dateTo || '...'}
                </span>
              )}
            </div>
            
            <button
              onClick={onClear}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              Limpar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}