// src/pages/Campaigns/components/TemplateLibrary/TemplateFilters.tsx

import { Search, Grid, List, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TemplateFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  allTags: string[];
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onCreateCustom?: () => void;
}

export default function TemplateFilters({
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagsChange,
  allTags,
  viewMode,
  onViewModeChange,
  onCreateCustom,
}: TemplateFiltersProps) {
  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleClearAllTags = () => {
    onTagsChange([]);
  };

  return (
    <div className="space-y-4">
      {/* Linha principal: Busca, View Mode, Create */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar templates por nome, descrição ou tag..."
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={16} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-lg transition-all duration-200 ${
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
            className={`p-2 rounded-lg transition-all duration-200 ${
              viewMode === 'list'
                ? 'bg-white shadow-sm text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Visualização em lista"
          >
            <List size={18} />
          </button>
        </div>

        {/* Create Custom Template */}
        {onCreateCustom && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCreateCustom}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <Plus size={18} />
            <span className="hidden md:inline">Criar Template</span>
          </motion.button>
        )}
      </div>

      {/* Tags filter */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex-shrink-0">
            Filtrar por tags:
          </span>

          <div className="flex-1 flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {allTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);

                return (
                  <motion.button
                    key={tag}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleToggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                        : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:border-gray-300'
                    }`}
                  >
                    #{tag}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Clear tags */}
          {selectedTags.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleClearAllTags}
              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors flex items-center gap-1 flex-shrink-0"
            >
              <X size={14} />
              Limpar ({selectedTags.length})
            </motion.button>
          )}
        </div>
      )}

      {/* Active filters summary */}
      {(searchQuery || selectedTags.length > 0) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-blue-900">Filtros ativos:</span>
              {searchQuery && (
                <span className="px-2 py-1 bg-white rounded-lg text-blue-700 text-xs">
                  Busca: "{searchQuery}"
                </span>
              )}
              {selectedTags.length > 0 && (
                <span className="px-2 py-1 bg-white rounded-lg text-blue-700 text-xs">
                  {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            <button
              onClick={() => {
                onSearchChange('');
                handleClearAllTags();
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold underline"
            >
              Limpar todos os filtros
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}