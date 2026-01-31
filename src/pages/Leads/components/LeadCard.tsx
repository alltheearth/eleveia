// src/pages/Leads/components/LeadCard.tsx
// 💼 CARD DE LEAD PROFISSIONAL - DESIGN ATUALIZADO

import { motion } from 'framer-motion';
import { 
  Edit2, 
  Trash2, 
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Tag,
  User,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import type { Lead } from '../../../services';

// ============================================
// TYPES
// ============================================

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onStatusChange?: (lead: Lead, newStatus: Lead['status']) => void;
  variant?: 'default' | 'compact';
}

// ============================================
// STATUS CONFIG (Seguindo padrão do projeto)
// ============================================

const STATUS_CONFIG: Record<Lead['status'], {
  label: string;
  gradient: string;
  icon: string;
  bg: string;
  text: string;
  border: string;
}> = {
  novo: {
    label: 'Novo',
    gradient: 'from-blue-500 to-blue-600',
    icon: '🆕',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  contato: {
    label: 'Em Contato',
    gradient: 'from-yellow-500 to-yellow-600',
    icon: '📞',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
  },
  qualificado: {
    label: 'Qualificado',
    gradient: 'from-purple-500 to-purple-600',
    icon: '⭐',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  conversao: {
    label: 'Convertido',
    gradient: 'from-green-500 to-green-600',
    icon: '✅',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  perdido: {
    label: 'Perdido',
    gradient: 'from-red-500 to-red-600',
    icon: '❌',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
};

const ORIGEM_ICONS: Record<string, string> = {
  site: '🌐',
  whatsapp: '💬',
  indicacao: '👥',
  ligacao: '📞',
  email: '📧',
  facebook: '📘',
  instagram: '📷',
};

// ============================================
// COMPONENT
// ============================================

export default function LeadCard({
  lead,
  onEdit,
  onDelete,
  onStatusChange,
  variant = 'default',
}: LeadCardProps) {
  const [showActions, setShowActions] = useState(false);
  
  const config = STATUS_CONFIG[lead.status];
  const origemIcon = ORIGEM_ICONS[lead.origem] || '📋';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  // ============================================
  // VARIANT: COMPACT
  // ============================================
  
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 4 }}
        className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-4">
          {/* Avatar com gradiente */}
          <div className={`w-12 h-12 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md flex-shrink-0`}>
            {lead.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-bold text-gray-900 line-clamp-1">
                {lead.nome}
              </h4>
              <span className={`px-2 py-1 rounded-full text-xs font-bold border-2 ${config.border} ${config.bg} ${config.text} whitespace-nowrap flex items-center gap-1`}>
                <span>{config.icon}</span>
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
              {lead.email && (
                <span className="flex items-center gap-1 line-clamp-1">
                  <Mail size={12} />
                  {lead.email}
                </span>
              )}
              {lead.telefone && (
                <span className="flex items-center gap-1">
                  <Phone size={12} />
                  {formatPhone(lead.telefone)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className={`px-2 py-0.5 rounded-full border ${config.border} ${config.bg} ${config.text} font-semibold flex items-center gap-1`}>
                <span>{origemIcon}</span>
                {lead.origem_display}
              </span>
              <span className="text-gray-500 flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(lead.criado_em)}
              </span>
            </div>
          </div>

          {/* Ações e indicador */}
          <div className="flex items-center gap-2">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(lead);
                }}
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit2 size={16} className="text-blue-600" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(lead);
                }}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="Deletar"
              >
                <Trash2 size={16} className="text-red-600" />
              </button>
            </div>
            <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
          </div>
        </div>
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
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group"
    >
      {/* Header com gradiente */}
      <div className={`bg-gradient-to-r ${config.gradient} px-6 py-4 relative`}>
        <div className="flex items-start justify-between">
          {/* Status e Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl border border-white/30 text-white font-bold">
              {lead.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                {config.label}
              </span>
              <div className="mt-1">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-bold border border-white/30 flex items-center gap-1 w-fit">
                  <span>{origemIcon}</span>
                  {lead.origem_display}
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
                className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10 min-w-[180px]"
              >
                {onStatusChange && (
                  <>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Alterar Status
                    </div>
                    {Object.entries(STATUS_CONFIG).map(([status, conf]) => {
                      if (status === lead.status) return null;
                      return (
                        <button
                          key={status}
                          onClick={() => {
                            onStatusChange(lead, status as Lead['status']);
                            setShowActions(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                        >
                          <span className="text-lg">{conf.icon}</span>
                          <span className="text-sm font-semibold text-gray-700">{conf.label}</span>
                        </button>
                      );
                    })}
                    <div className="h-px bg-gray-200 my-2" />
                  </>
                )}
                <button
                  onClick={() => {
                    onEdit(lead);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left"
                >
                  <Edit2 size={16} className="text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">Editar</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(lead);
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
        {/* Nome */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
          {lead.nome}
        </h3>

        {/* Contatos */}
        <div className="space-y-2 mb-4">
          {lead.email && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Mail size={16} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-semibold truncate">{lead.email}</p>
              </div>
            </div>
          )}

          {lead.telefone && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <Phone size={16} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Telefone</p>
                <p className="font-semibold">{formatPhone(lead.telefone)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Observações */}
        {lead.observacoes && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <Tag size={12} />
              Observações
            </p>
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
              {lead.observacoes}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={12} />
            <span>Criado em {formatDate(lead.criado_em)}</span>
          </div>
          
          {lead.escola_nome && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin size={12} />
              <span className="truncate max-w-[120px]" title={lead.escola_nome}>
                {lead.escola_nome}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Hover indicator */}
      <div className="h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}