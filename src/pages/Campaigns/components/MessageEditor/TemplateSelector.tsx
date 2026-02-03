// src/pages/Campaigns/components/MessageEditor/TemplateSelector.tsx
// 📋 SELETOR DE TEMPLATES DE MENSAGENS

import { motion } from 'framer-motion';
import { FileText, X, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { MessageTemplate } from '../../types/campaign.types';

// ============================================
// TYPES
// ============================================

interface TemplateSelectorProps {
  templates: MessageTemplate[];
  onSelect: (template: MessageTemplate) => void;
  onClose: () => void;
}

// ============================================
// COMPONENT
// ============================================

export default function TemplateSelector({
  templates,
  onSelect,
  onClose,
}: TemplateSelectorProps) {
  
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [templates, searchTerm]);

  return (
    <div className="bg-white rounded-xl border-2 border-blue-200 shadow-lg p-4">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="text-blue-600" size={20} />
          <h4 className="font-bold text-gray-900">Selecionar Template</h4>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={18} className="text-gray-400" />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-3 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Buscar templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Templates List */}
      <div className="max-h-64 overflow-y-auto space-y-2">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Nenhum template encontrado</p>
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <motion.button
              key={template.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => onSelect(template)}
              className="w-full p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg text-left transition-all"
            >
              <p className="font-semibold text-gray-900 text-sm mb-1">
                {template.name}
              </p>
              {template.description && (
                <p className="text-xs text-gray-600 line-clamp-2">
                  {template.description}
                </p>
              )}
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}