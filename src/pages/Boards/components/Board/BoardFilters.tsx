// src/pages/Boards/components/Board/BoardFilters.tsx
// 🔍 FILTROS AVANÇADOS DO BOARD

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X,
  ChevronDown,
  Calendar,
  Tag,
  AlertTriangle,
  User,
  SlidersHorizontal,
} from 'lucide-react';
import { useState } from 'react';
import { PRIORITY_CONFIG, LABEL_OPTIONS } from '../../../../constants/boards';

// ============================================
// TYPES
// ============================================

export interface FilterOptions {
  search: string;
  labels: string[];
  priorities: ('low' | 'medium' | 'high')[];
  dueDateFilter: 'all' | 'overdue' | 'today' | 'week' | 'month' | 'no_date';
  members: string[];
  showCompleted: boolean;
}

interface BoardFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  availableMembers?: string[];
  totalCards: number;
  filteredCount: number;
}

// ============================================
// CONSTANTS
// ============================================

const DUE_DATE_OPTIONS = [
  { value: 'all', label: 'Todas as datas', icon: Calendar },
  { value: 'overdue', label: 'Atrasadas', icon: AlertTriangle },
  { value: 'today', label: 'Hoje', icon: Calendar },
  { value: 'week', label: 'Esta semana', icon: Calendar },
  { value: 'month', label: 'Este mês', icon: Calendar },
  { value: 'no_date', label: 'Sem prazo', icon: X },
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function BoardFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  availableMembers = [],
  totalCards,
  filteredCount,
}: BoardFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters = 
    filters.search !== '' ||
    filters.labels.length > 0 ||
    filters.priorities.length > 0 ||
    filters.dueDateFilter !== 'all' ||
    filters.members.length > 0 ||
    !filters.showCompleted;

  const activeFilterCount = [
    filters.search ? 1 : 0,
    filters.labels.length,
    filters.priorities.length,
    filters.dueDateFilter !== 'all' ? 1 : 0,
    filters.members.length,
    !filters.showCompleted ? 1 : 0,
  ].reduce((acc, curr) => acc + curr, 0);

  const handleToggleLabel = (label: string) => {
    const newLabels = filters.labels.includes(label)
      ? filters.labels.filter(l => l !== label)
      : [...filters.labels, label];
    onFiltersChange({ ...filters, labels: newLabels });
  };

  const handleTogglePriority = (priority: 'low' | 'medium' | 'high') => {
    const newPriorities = filters.priorities.includes(priority)
      ? filters.priorities.filter(p => p !== priority)
      : [...filters.priorities, priority];
    onFiltersChange({ ...filters, priorities: newPriorities });
  };

  const handleToggleMember = (member: string) => {
    const newMembers = filters.members.includes(member)
      ? filters.members.filter(m => m !== member)
      : [...filters.members, member];
    onFiltersChange({ ...filters, members: newMembers });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Main Bar */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* Search */}
          <div className="flex-1 min-w-[250px] relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar cards..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm"
            />
            {filters.search && (
              <button
                onClick={() => onFiltersChange({ ...filters, search: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition"
              >
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              showAdvanced || hasActiveFilters
                ? 'bg-blue-50 text-blue-600 border-2 border-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
            }`}
          >
            <Filter size={18} />
            <span>Filtros</span>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-blue-600 text-white rounded-full text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown 
              size={16} 
              className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={onClearFilters}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-semibold text-sm border-2 border-red-200"
            >
              <X size={16} />
              Limpar
            </motion.button>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-gray-100 overflow-hidden"
          >
            <div className="p-4 space-y-4 bg-gray-50">
              
              {/* Labels */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={16} className="text-gray-600" />
                  <label className="text-sm font-bold text-gray-900">Labels</label>
                  {filters.labels.length > 0 && (
                    <span className="text-xs text-gray-500">
                      ({filters.labels.length} selecionadas)
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {LABEL_OPTIONS.map((label) => (
                    <button
                      key={label.value}
                      onClick={() => handleToggleLabel(label.value)}
                      className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${
                        filters.labels.includes(label.value)
                          ? `${label.color} ring-2 ring-gray-900 scale-105`
                          : `${label.color} opacity-60 hover:opacity-100`
                      }`}
                    >
                      {label.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priorities */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <SlidersHorizontal size={16} className="text-gray-600" />
                  <label className="text-sm font-bold text-gray-900">Prioridade</label>
                  {filters.priorities.length > 0 && (
                    <span className="text-xs text-gray-500">
                      ({filters.priorities.length} selecionadas)
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => handleTogglePriority(key as any)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all border-2 ${
                        filters.priorities.includes(key as any)
                          ? `${config.color} border-gray-900 scale-105`
                          : `${config.color} border-transparent opacity-60 hover:opacity-100`
                      }`}
                    >
                      {config.icon} {config.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={16} className="text-gray-600" />
                  <label className="text-sm font-bold text-gray-900">Prazo</label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {DUE_DATE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onFiltersChange({ ...filters, dueDateFilter: option.value as any })}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all border-2 ${
                        filters.dueDateFilter === option.value
                          ? 'bg-blue-50 text-blue-600 border-blue-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <option.icon size={14} />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Members */}
              {availableMembers.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <User size={16} className="text-gray-600" />
                    <label className="text-sm font-bold text-gray-900">Membros</label>
                    {filters.members.length > 0 && (
                      <span className="text-xs text-gray-500">
                        ({filters.members.length} selecionados)
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableMembers.map((member) => (
                      <button
                        key={member}
                        onClick={() => handleToggleMember(member)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all border-2 ${
                          filters.members.includes(member)
                            ? 'bg-purple-50 text-purple-600 border-purple-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                          {member[0]}
                        </div>
                        {member}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Show Completed */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-bold text-gray-900">
                    Mostrar cards arquivados
                  </label>
                  <span className="text-xs text-gray-500">
                    (incluir cards concluídos)
                  </span>
                </div>
                <button
                  onClick={() => onFiltersChange({ ...filters, showCompleted: !filters.showCompleted })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    filters.showCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <motion.div
                    layout
                    className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                    animate={{ x: filters.showCompleted ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Counter */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">
              Mostrando {filteredCount} de {totalCards} cards
            </span>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                Filtrado
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              Limpar todos os filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
}