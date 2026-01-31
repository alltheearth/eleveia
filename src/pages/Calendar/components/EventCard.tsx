// src/pages/Calendar/components/EventCard.tsx
// 🎨 CARD DE EVENTO PROFISSIONAL

import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Edit2, 
  Trash2, 
  MoreVertical,
  MapPin,
  User
} from 'lucide-react';
import { useState } from 'react';
import type { Event } from '../../../services';

// ============================================
// TYPES
// ============================================

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  variant?: 'default' | 'compact';
}

// ============================================
// CONSTANTS
// ============================================

const EVENT_TYPES_CONFIG = {
  holiday: {
    label: 'Feriado',
    gradient: 'from-red-500 to-rose-600',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: '🎉',
    emoji: '📌',
  },
  exam: {
    label: 'Prova',
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: '📝',
    emoji: '✏️',
  },
  graduation: {
    label: 'Formatura',
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: '🎓',
    emoji: '🎊',
  },
  cultural: {
    label: 'Cultural',
    gradient: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    icon: '🎭',
    emoji: '🎨',
  },
};

// ============================================
// COMPONENT
// ============================================

export default function EventCard({
  event,
  onEdit,
  onDelete,
  variant = 'default',
}: EventCardProps) {
  const [showActions, setShowActions] = useState(false);
  
  const config = EVENT_TYPES_CONFIG[event.event_type];
  
  // Formatar datas
  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const startDate = formatDate(event.start_date);
  const endDate = formatDate(event.end_date);
  const isSingleDay = event.is_single_day;

  // ============================================
  // VARIANT: COMPACT
  // ============================================
  
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 4 }}
        className={`flex items-center gap-4 p-4 rounded-xl border ${config.border} ${config.bg} hover:shadow-md transition-all cursor-pointer group`}
      >
        {/* Ícone */}
        <div className={`w-12 h-12 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
          {config.emoji}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 truncate">
            {event.title}
          </h4>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {startDate}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
              {config.label}
            </span>
          </div>
        </div>

        {/* Ações */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(event);
            }}
            className="p-2 hover:bg-white rounded-lg transition-colors"
            title="Editar"
          >
            <Edit2 size={16} className="text-blue-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(event);
            }}
            className="p-2 hover:bg-white rounded-lg transition-colors"
            title="Deletar"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      </motion.div>
    );
  }

  // ============================================
  // VARIANT: DEFAULT (Full Card)
  // ============================================

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15)' }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group"
    >
      {/* Header com gradiente */}
      <div className={`bg-gradient-to-r ${config.gradient} px-6 py-4 relative`}>
        <div className="flex items-start justify-between">
          {/* Tipo do evento */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-xl border border-white/30">
              {config.icon}
            </div>
            <div>
              <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                {config.label}
              </span>
              <div className="flex items-center gap-2 mt-1">
                {!isSingleDay && (
                  <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-semibold border border-white/30">
                    {event.duration_days} dias
                  </span>
                )}
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
                <button
                  onClick={() => {
                    onEdit(event);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <Edit2 size={16} className="text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">Editar</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(event);
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
        {/* Título */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
          {event.title}
        </h3>

        {/* Descrição */}
        {event.description && (
          <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Informações */}
        <div className="space-y-3">
          {/* Datas */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="font-semibold">
                {isSingleDay ? startDate : `${startDate} até ${endDate}`}
              </p>
              <p className="text-xs text-gray-500">
                {isSingleDay ? 'Dia único' : `${event.duration_days} dias`}
              </p>
            </div>
          </div>

          {/* Criado por */}
          {event.created_by_name && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <User size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Criado por</p>
                <p className="font-semibold">{event.created_by_name}</p>
              </div>
            </div>
          )}

          {/* Data de criação */}
          <div className="flex items-center gap-2 text-sm text-gray-500 pt-2 border-t border-gray-100">
            <Clock size={14} />
            <span>Criado em {formatDate(event.created_at.split('T')[0])}</span>
          </div>
        </div>
      </div>

      {/* Footer com badge */}
      <div className={`px-6 py-3 border-t ${config.border} ${config.bg}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold ${config.text} uppercase tracking-wider`}>
            {event.event_type_display}
          </span>
          {event.school_name && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <MapPin size={12} />
              <span className="truncate max-w-[150px]" title={event.school_name}>
                {event.school_name}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}