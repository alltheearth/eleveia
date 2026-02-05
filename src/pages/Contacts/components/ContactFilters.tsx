// src/pages/Contacts/components/ContactFilters.tsx
// 🔍 FILTROS AVANÇADOS DE CONTATOS

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  Plus,
  Download,
  Grid3x3,
  List,
  RefreshCw
} from 'lucide-react';
import { useState } from 'react';

// ============================================
// TYPES
// ============================================

export type ContactViewMode = 'grid' | 'list';

interface ContactFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  docStatusFilter: string;
  onDocStatusFilterChange: (value: string) => void;
  financeFilter: string;
  onFinanceFilterChange: (value: string) => void;
  viewMode: ContactViewMode;
  onViewModeChange: (mode: ContactViewMode) => void;
  onNewContact: () => void;
  onExport?: () => void;
  onRefresh?: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  isExporting?: boolean;
  isRefreshing?: boolean;
}

// ============================================
// OPTIONS
// ============================================

const STATUS_OPTIONS = [
  { value: 'todos', label: 'Todos os Status', emoji: '📊' },
  { value: 'ativo', label: 'Ativos', emoji: '✅' },
  { value: 'inativo', label: 'Inativos', emoji: '⛔' },
];

const DOC_STATUS_OPTIONS = [
  { value: 'todos', label: 'Toda Documentação', emoji: '📄' },
  { value: 'completa', label: 'Completa', emoji: '✅' },
  { value: 'incompleta', label: 'Incompleta', emoji: '⚠️' },
];

const FINANCE_OPTIONS = [
  { value: 'todos', label: 'Todas Situações', emoji: '💰' },
  { value: 'em_dia', label: 'Em Dia', emoji: '✅' },
  { value: 'pendente', label: 'Com Pendências', emoji: '🔴' },
];

// ============================================
// COMPONENT
// ============================================

export default function ContactFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  docStatusFilter,
  onDocStatusFilterChange,
  financeFilter,
  onFinanceFilterChange,
  viewMode,
  onViewModeChange,
  onNewContact,
  onExport,
  onRefresh,
  onClearFilters,
  hasActiveFilters,
  isExporting = false,
  isRefreshing = false,
}: ContactFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

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
                placeholder="Buscar por nome, email, telefone, CPF ou filho..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
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

            {/* Novo contato */}
            <button
              onClick={onNewContact}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Novo Contato</span>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status do Contato
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

                {/* Documentação */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Documentação
                  </label>
                  <select
                    value={docStatusFilter}
                    onChange={(e) => onDocStatusFilterChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    {DOC_STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.emoji} {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Financeiro */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Situação Financeira
                  </label>
                  <select
                    value={financeFilter}
                    onChange={(e) => onFinanceFilterChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    {FINANCE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.emoji} {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Botão de limpar */}
              {hasActiveFilters && (
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

      {/* Indicador de filtros ativos */}
      {hasActiveFilters && !showAdvanced && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-blue-700">Filtros ativos:</span>
              {searchTerm && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  Busca: "{searchTerm.slice(0, 20)}{searchTerm.length > 20 ? '...' : ''}"
                </span>
              )}
              {statusFilter !== 'todos' && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                  Status: {STATUS_OPTIONS.find(s => s.value === statusFilter)?.label}
                </span>
              )}
              {docStatusFilter !== 'todos' && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  Doc: {DOC_STATUS_OPTIONS.find(d => d.value === docStatusFilter)?.label}
                </span>
              )}
              {financeFilter !== 'todos' && (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                  Financeiro: {FINANCE_OPTIONS.find(f => f.value === financeFilter)?.label}
                </span>
              )}
            </div>
            <button
              onClick={onClearFilters}
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