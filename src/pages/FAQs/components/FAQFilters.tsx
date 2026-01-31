// src/pages/FAQs/components/FAQFilters.tsx
// 🔍 FILTROS AVANÇADOS DE FAQs

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  Plus,
  Download,
//   ChevronDown,
  Grid3x3,
  List,
  AlignJustify
} from 'lucide-react';
import { useState } from 'react';
import type { FAQ } from '../../../services';

// ============================================
// TYPES
// ============================================

interface FAQFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | FAQ['status'];
  onStatusFilterChange: (value: 'all' | FAQ['status']) => void;
  categoryFilter: 'all' | FAQ['category'];
  onCategoryFilterChange: (value: 'all' | FAQ['category']) => void;
  viewMode: 'grid' | 'list' | 'accordion';
  onViewModeChange: (mode: 'grid' | 'list' | 'accordion') => void;
  onNewFAQ: () => void;
  onExport?: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const CATEGORIES: FAQ['category'][] = [
  'General',
  'Admission',
  'Pricing',
  'Uniform',
  'Schedule',
  'Documentation',
  'Activities',
  'Meals',
  'Transport',
  'Pedagogical',
];

// ============================================
// COMPONENT
// ============================================

export default function FAQFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  viewMode,
  onViewModeChange,
  onNewFAQ,
  onExport,
  onClearFilters,
  hasActiveFilters,
}: FAQFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
      {/* Primeira linha: Busca + Ações */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Campo de busca */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por pergunta ou resposta..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Botões de ação */}
        <div className="flex gap-2">
          {/* Filtros avançados */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all font-semibold ${
              showAdvanced || hasActiveFilters
                ? 'bg-blue-50 border-blue-600 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            <Filter size={18} />
            <span className="hidden sm:inline">Filtros</span>
            {hasActiveFilters && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                ●
              </span>
            )}
          </button>

          {/* Exportar (se disponível) */}
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-all font-semibold"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          )}

          {/* Nova FAQ */}
          <button
            onClick={onNewFAQ}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Nova FAQ</span>
          </button>
        </div>
      </div>

      {/* Filtros avançados (expansível) */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-gray-200 space-y-4">
              {/* Filtros de seleção */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Categoria */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => onCategoryFilterChange(e.target.value as typeof categoryFilter)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="all">Todas as Categorias</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => onStatusFilterChange(e.target.value as typeof statusFilter)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="active">✅ Ativas</option>
                    <option value="inactive">⛔ Inativas</option>
                  </select>
                </div>

                {/* Modo de visualização */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Visualização
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewModeChange('grid')}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all font-semibold ${
                        viewMode === 'grid'
                          ? 'bg-blue-50 border-blue-600 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                      title="Grade"
                    >
                      <Grid3x3 size={18} />
                      <span className="hidden sm:inline text-xs">Grade</span>
                    </button>
                    <button
                      onClick={() => onViewModeChange('list')}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all font-semibold ${
                        viewMode === 'list'
                          ? 'bg-blue-50 border-blue-600 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                      title="Lista"
                    >
                      <List size={18} />
                      <span className="hidden sm:inline text-xs">Lista</span>
                    </button>
                    <button
                      onClick={() => onViewModeChange('accordion')}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all font-semibold ${
                        viewMode === 'accordion'
                          ? 'bg-blue-50 border-blue-600 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                      title="Accordion"
                    >
                      <AlignJustify size={18} />
                      <span className="hidden sm:inline text-xs">FAQ</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Limpar filtros */}
              {hasActiveFilters && (
                <div className="flex justify-end">
                  <button
                    onClick={onClearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-semibold border border-red-200"
                  >
                    <X size={16} />
                    Limpar Filtros
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador de filtros ativos (quando fechado) */}
      {!showAdvanced && hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-semibold">Filtros ativos:</span>
          {searchTerm && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
              Busca: "{searchTerm}"
            </span>
          )}
          {categoryFilter !== 'all' && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
              Categoria: {categoryFilter}
            </span>
          )}
          {statusFilter !== 'all' && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              Status: {statusFilter === 'active' ? 'Ativas' : 'Inativas'}
            </span>
          )}
          <button
            onClick={onClearFilters}
            className="ml-2 text-red-600 hover:text-red-700 font-semibold hover:underline"
          >
            Limpar
          </button>
        </div>
      )}
    </div>
  );
}