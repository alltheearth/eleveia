// src/pages/Campaigns/components/CampaignFilters.tsx
// 🔍 FILTROS DE CAMPANHAS

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  Grid3x3,
  List,
  LayoutGrid,
  Plus,
  Download,
  RefreshCw,
} from 'lucide-react';

import {
  CAMPAIGN_TYPE_CONFIG,
  CAMPAIGN_STATUS_CONFIG,
} from '../utils/campaignConfig';

import type { CampaignType, CampaignStatus } from '../types/campaign.types';

// ============================================
// TYPES
// ============================================

export type CampaignViewMode = 'grid' | 'list' | 'kanban';

interface CampaignFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: CampaignStatus | 'all';
  onStatusChange: (status: CampaignStatus | 'all') => void;
  typeFilter: CampaignType | 'all';
  onTypeChange: (type: CampaignType | 'all') => void;
  viewMode: CampaignViewMode;
  onViewModeChange: (mode: CampaignViewMode) => void;
  onNewCampaign: () => void;
  onExport?: () => void;
  onRefresh?: () => void;
  totalResults?: number;
}

// ============================================
// COMPONENT
// ============================================

export default function CampaignFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  viewMode,
  onViewModeChange,
  onNewCampaign,
  onExport,
  onRefresh,
  totalResults = 0,
}: CampaignFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const hasActiveFilters = statusFilter !== 'all' || typeFilter !== 'all' || searchTerm.length > 0;

  const clearFilters = () => {
    onSearchChange('');
    onStatusChange('all');
    onTypeChange('all');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
      {/* Barra principal */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar campanhas por nome, descrição ou tags..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2">
            {/* Filtros avançados */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all font-semibold ${
                showAdvancedFilters || hasActiveFilters
                  ? 'bg-blue-50 border-blue-600 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Filtros</span>
              {hasActiveFilters && (
                <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">
                  {[statusFilter !== 'all', typeFilter !== 'all', searchTerm.length > 0].filter(Boolean).length}
                </span>
              )}
            </motion.button>

            {/* View mode */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Visualização em Grade"
              >
                <Grid3x3 size={20} />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Visualização em Lista"
              >
                <List size={20} />
              </button>
              <button
                onClick={() => onViewModeChange('kanban')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'kanban'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Visualização Kanban"
              >
                <LayoutGrid size={20} />
              </button>
            </div>

            {/* Refresh */}
            {onRefresh && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRefresh}
                className="p-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-all"
                title="Atualizar"
              >
                <RefreshCw size={20} />
              </motion.button>
            )}

            {/* Export */}
            {onExport && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onExport}
                className="hidden lg:flex items-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-all font-semibold"
              >
                <Download size={18} />
                Exportar
              </motion.button>
            )}

            {/* Nova Campanha */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNewCampaign}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all font-semibold"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Nova Campanha</span>
            </motion.button>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            <span className="font-bold text-gray-900">{totalResults}</span> campanhas encontradas
          </p>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              <X size={16} />
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Filtros avançados */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-200 overflow-hidden"
          >
            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Filtro por status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Status da Campanha
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onStatusChange('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        statusFilter === 'all'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      Todos
                    </button>
                    {Object.entries(CAMPAIGN_STATUS_CONFIG).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => onStatusChange(key as CampaignStatus)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          statusFilter === key
                            ? 'bg-blue-600 text-white shadow-md'
                            : `bg-white text-gray-700 border ${config.color.split(' ')[2]} hover:${config.color.split(' ')[0]}`
                        }`}
                      >
                        {config.icon} {config.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtro por tipo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Tipo de Campanha
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onTypeChange('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        typeFilter === 'all'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      Todos
                    </button>
                    {Object.entries(CAMPAIGN_TYPE_CONFIG).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => onTypeChange(key as CampaignType)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          typeFilter === key
                            ? 'bg-blue-600 text-white shadow-md'
                            : `bg-white ${config.text} border ${config.border} hover:${config.bg}`
                        }`}
                      >
                        {config.icon} {config.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}