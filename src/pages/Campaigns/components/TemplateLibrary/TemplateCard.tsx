// src/pages/Campaigns/components/TemplateLibrary/TemplateCard.tsx

import { motion } from 'framer-motion';
import { Eye, Edit2, Star, TrendingUp, Calendar } from 'lucide-react';
import type { MessageTemplate } from './index';

interface TemplateCardProps {
  template: MessageTemplate;
  viewMode: 'grid' | 'list';
  onSelect: () => void;
  onPreview: () => void;
  onEdit?: () => void;
}

const CATEGORY_CONFIG = {
  matricula: {
    label: 'Matrícula',
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: '🎓',
  },
  rematricula: {
    label: 'Rematrícula',
    gradient: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    text: 'text-green-700',
    icon: '🔄',
  },
  evento: {
    label: 'Evento',
    gradient: 'from-pink-500 to-pink-600',
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    icon: '🎉',
  },
  reuniao: {
    label: 'Reunião',
    gradient: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    icon: '📅',
  },
  cobranca: {
    label: 'Cobrança',
    gradient: 'from-red-500 to-red-600',
    bg: 'bg-red-50',
    text: 'text-red-700',
    icon: '💰',
  },
  comunicado: {
    label: 'Comunicado',
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    icon: '📢',
  },
  custom: {
    label: 'Personalizado',
    gradient: 'from-gray-500 to-gray-600',
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    icon: '⚙️',
  },
  all: {
    label: 'Todos',
    gradient: 'from-gray-500 to-gray-600',
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    icon: '📚',
  },
};

export default function TemplateCard({
  template,
  viewMode,
  onSelect,
  onPreview,
  onEdit,
}: TemplateCardProps) {
  const config = CATEGORY_CONFIG[template.category];
  const previewText = template.content.whatsapp?.text || template.content.email?.subject || '';
  const truncatedPreview = previewText.length > 150 
    ? previewText.substring(0, 150) + '...' 
    : previewText;

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 4 }}
        className="bg-white rounded-xl border-2 border-gray-100 hover:border-blue-200 transition-all duration-200 overflow-hidden cursor-pointer group"
        onClick={onSelect}
      >
        <div className="flex items-center gap-4 p-4">
          {/* Icon */}
          <div className={`w-16 h-16 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <span className="text-3xl">{config.icon}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {template.name}
                </h4>
                <p className="text-sm text-gray-600 truncate">
                  {template.description}
                </p>
              </div>

              {template.is_default && (
                <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded-lg flex-shrink-0">
                  <Star size={12} className="text-amber-600 fill-amber-600" />
                  <span className="text-xs font-semibold text-amber-700">Destaque</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <TrendingUp size={14} />
                <span>{template.usage_count} usos</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{new Date(template.updated_at).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className={`px-2 py-1 ${config.bg} rounded-lg`}>
                <span className={`font-semibold ${config.text}`}>
                  {config.label}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
              className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
              title="Visualizar"
            >
              <Eye size={18} />
            </button>
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit2 size={18} />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer group"
      onClick={onSelect}
    >
      {/* Header com gradiente */}
      <div className={`bg-gradient-to-r ${config.gradient} px-5 py-4 relative`}>
        <div className="flex items-start justify-between">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">{config.icon}</span>
          </div>

          {template.is_default && (
            <div className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg flex items-center gap-1">
              <Star size={14} className="text-white fill-white" />
              <span className="text-xs font-bold text-white">TOP</span>
            </div>
          )}
        </div>

        {/* Category badge */}
        <div className="mt-3">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
            {config.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h4 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {template.name}
        </h4>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {template.description}
        </p>

        {/* Preview */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
          <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed font-mono">
            {truncatedPreview}
          </p>
        </div>

        {/* Tags */}
        {template.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {template.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
            {template.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                +{template.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <TrendingUp size={14} />
            <span className="font-semibold">{template.usage_count}</span>
            <span>usos</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
              className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
              title="Visualizar preview"
            >
              <Eye size={18} />
            </button>
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
                title="Editar template"
              >
                <Edit2 size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}