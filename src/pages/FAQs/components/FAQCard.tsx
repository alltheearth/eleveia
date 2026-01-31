// src/pages/FAQs/components/FAQCard.tsx
// 💬 CARD DE FAQ PROFISSIONAL

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit2, 
  Trash2, 
  ChevronDown,
  ChevronUp,
  Calendar,
  Tag,
  MoreVertical
} from 'lucide-react';
import { useState } from 'react';
import type { FAQ } from '../../../services';

// ============================================
// TYPES
// ============================================

interface FAQCardProps {
  faq: FAQ;
  onEdit: (faq: FAQ) => void;
  onDelete: (faq: FAQ) => void;
  onStatusChange?: (faq: FAQ, newStatus: FAQ['status']) => void;
  variant?: 'default' | 'compact' | 'accordion';
}

// ============================================
// CATEGORY CONFIG
// ============================================

const CATEGORY_CONFIG: Record<FAQ['category'], {
  color: string;
  gradient: string;
  icon: string;
}> = {
  General: { 
    color: 'bg-gray-50 text-gray-700 border-gray-200', 
    gradient: 'from-gray-500 to-gray-600',
    icon: '📋' 
  },
  Admission: { 
    color: 'bg-blue-50 text-blue-700 border-blue-200', 
    gradient: 'from-blue-500 to-blue-600',
    icon: '🎓' 
  },
  Pricing: { 
    color: 'bg-green-50 text-green-700 border-green-200', 
    gradient: 'from-green-500 to-green-600',
    icon: '💰' 
  },
  Uniform: { 
    color: 'bg-purple-50 text-purple-700 border-purple-200', 
    gradient: 'from-purple-500 to-purple-600',
    icon: '👔' 
  },
  Schedule: { 
    color: 'bg-orange-50 text-orange-700 border-orange-200', 
    gradient: 'from-orange-500 to-orange-600',
    icon: '📅' 
  },
  Documentation: { 
    color: 'bg-blue-50 text-blue-700 border-blue-200', 
    gradient: 'from-blue-500 to-blue-600',
    icon: '📄' 
  },
  Activities: { 
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200', 
    gradient: 'from-yellow-500 to-yellow-600',
    icon: '🎨' 
  },
  Meals: { 
    color: 'bg-orange-50 text-orange-700 border-orange-200', 
    gradient: 'from-orange-500 to-orange-600',
    icon: '🍽️' 
  },
  Transport: { 
    color: 'bg-purple-50 text-purple-700 border-purple-200', 
    gradient: 'from-purple-500 to-purple-600',
    icon: '🚌' 
  },
  Pedagogical: { 
    color: 'bg-red-50 text-red-700 border-red-200', 
    gradient: 'from-red-500 to-red-600',
    icon: '📚' 
  },
};

const STATUS_CONFIG: Record<FAQ['status'], {
  label: string;
  color: string;
  icon: string;
}> = {
  active: {
    label: 'Ativa',
    color: 'bg-green-100 text-green-700 border-green-300',
    icon: '✅',
  },
  inactive: {
    label: 'Inativa',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    icon: '⛔',
  },
};

// ============================================
// COMPONENT
// ============================================

export default function FAQCard({
  faq,
  onEdit,
  onDelete,
  onStatusChange,
  variant = 'default',
}: FAQCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  const categoryConfig = CATEGORY_CONFIG[faq.category];
  const statusConfig = STATUS_CONFIG[faq.status];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // ============================================
  // VARIANT: COMPACT (para lista)
  // ============================================
  
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 4 }}
        className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all group"
      >
        <div className="flex items-start gap-4">
          {/* Ícone da categoria */}
          <div className={`w-12 h-12 bg-gradient-to-br ${categoryConfig.gradient} rounded-xl flex items-center justify-center text-2xl shadow-md flex-shrink-0`}>
            {categoryConfig.icon}
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-bold text-gray-900 line-clamp-1">
                {faq.question}
              </h4>
              <span className={`px-2 py-1 rounded-full text-xs font-bold border-2 ${statusConfig.color} whitespace-nowrap`}>
                {statusConfig.icon}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {faq.answer}
            </p>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className={`px-2 py-1 rounded-full border ${categoryConfig.color} font-semibold`}>
                {faq.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(faq.created_at)}
              </span>
            </div>
          </div>

          {/* Ações */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(faq);
              }}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit2 size={16} className="text-blue-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(faq);
              }}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              title="Deletar"
            >
              <Trash2 size={16} className="text-red-600" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ============================================
  // VARIANT: ACCORDION
  // ============================================
  
  if (variant === 'accordion') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        {/* Header clicável */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
        >
          {/* Ícone */}
          <div className={`w-10 h-10 bg-gradient-to-br ${categoryConfig.gradient} rounded-lg flex items-center justify-center text-xl flex-shrink-0 shadow-md`}>
            {categoryConfig.icon}
          </div>

          {/* Pergunta */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 mb-1">
              {faq.question}
            </h3>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${categoryConfig.color} font-semibold`}>
                {faq.category}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full border-2 ${statusConfig.color} font-bold`}>
                {statusConfig.icon} {statusConfig.label}
              </span>
            </div>
          </div>

          {/* Ícone de expandir */}
          {isExpanded ? (
            <ChevronUp className="text-gray-400" size={20} />
          ) : (
            <ChevronDown className="text-gray-400" size={20} />
          )}
        </button>

        {/* Resposta expansível */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-gray-100"
            >
              <div className="p-5 bg-gray-50">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {faq.answer}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={12} />
                    Criado em {formatDate(faq.created_at)}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(faq);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      <Edit2 size={14} />
                      Editar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(faq);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    >
                      <Trash2 size={14} />
                      Deletar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ============================================
  // VARIANT: DEFAULT (Card completo)
  // ============================================

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15)' }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
    >
      {/* Header com gradiente */}
      <div className={`bg-gradient-to-r ${categoryConfig.gradient} px-6 py-4`}>
        <div className="flex items-start justify-between">
          {/* Categoria */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl border border-white/30">
              {categoryConfig.icon}
            </div>
            <div>
              <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                {faq.category}
              </span>
              <div className="mt-1">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-bold border border-white/30">
                  {statusConfig.icon} {statusConfig.label}
                </span>
              </div>
            </div>
          </div>

          {/* Menu de ações */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <MoreVertical size={20} className="text-white" />
            </button>

            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10 min-w-[160px]"
              >
                {onStatusChange && (
                  <button
                    onClick={() => {
                      const newStatus: FAQ['status'] = faq.status === 'active' ? 'inactive' : 'active';
                      onStatusChange(faq, newStatus);
                      setShowActions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-lg">
                      {faq.status === 'active' ? '⛔' : '✅'}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">
                      {faq.status === 'active' ? 'Desativar' : 'Ativar'}
                    </span>
                  </button>
                )}
                <button
                  onClick={() => {
                    onEdit(faq);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left"
                >
                  <Edit2 size={16} className="text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">Editar</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(faq);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left"
                >
                  <Trash2 size={16} className="text-red-600" />
                  <span className="text-sm font-semibold text-red-600">Deletar</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        {/* Pergunta */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
          {faq.question}
        </h3>

        {/* Resposta */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
          {faq.answer}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(faq.created_at)}
          </span>
          
          {faq.school_name && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Tag size={12} />
              {faq.school_name}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}   