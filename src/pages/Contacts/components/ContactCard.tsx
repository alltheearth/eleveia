// src/pages/Contacts/components/ContactCard.tsx
// 👤 CARD DE CONTATO PROFISSIONAL

import { motion } from 'framer-motion';
import { 
  Eye,
  Trash2, 
  MoreVertical,
  Mail,
  Phone,
  Users,
  FileCheck,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Calendar
} from 'lucide-react';
import { useState } from 'react';
import type { Contact } from '../index';

// ============================================
// TYPES
// ============================================

interface ContactCardProps {
  contact: Contact;
  onViewDetails: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  variant?: 'default' | 'compact';
}

// ============================================
// COMPONENT
// ============================================

export default function ContactCard({
  contact,
  onViewDetails,
  onDelete,
  variant = 'default',
}: ContactCardProps) {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = () => {
    if (!contact.documentacao_completa) return 'border-orange-200 bg-orange-50';
    if (!contact.mensalidades_em_dia) return 'border-red-200 bg-red-50';
    return 'border-green-200 bg-green-50';
  };

  const getStatusIcon = () => {
    if (!contact.documentacao_completa) return <AlertCircle className="text-orange-600" size={20} />;
    if (!contact.mensalidades_em_dia) return <AlertCircle className="text-red-600" size={20} />;
    return <CheckCircle2 className="text-green-600" size={20} />;
  };

  const getStatusText = () => {
    if (!contact.documentacao_completa) return 'Documentação Pendente';
    if (!contact.mensalidades_em_dia) return 'Pendências Financeiras';
    return 'Situação Regular';
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
        onClick={() => onViewDetails(contact)}
        className={`cursor-pointer bg-white rounded-xl border-2 ${getStatusColor()} p-4 hover:shadow-md transition-all group`}
      >
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg flex-shrink-0">
            {contact.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 line-clamp-1 mb-1">
                  {contact.nome}
                </h4>
                <span className="text-xs text-gray-600 font-medium">
                  {contact.parentesco_display}
                  {contact.responsavel_financeiro && ' • Resp. Financeiro'}
                </span>
              </div>
              {getStatusIcon()}
            </div>
            
            <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
              <span className="flex items-center gap-1 line-clamp-1">
                <Mail size={12} />
                {contact.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone size={12} />
                {contact.telefone}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1">
                <Users size={10} />
                {contact.filhos.length} {contact.filhos.length === 1 ? 'filho' : 'filhos'}
              </span>
              
              {!contact.documentacao_completa && (
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold flex items-center gap-1">
                  <FileCheck size={10} />
                  Doc. Pendente
                </span>
              )}
              
              {!contact.mensalidades_em_dia && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1">
                  <DollarSign size={10} />
                  {contact.debitos_pendentes} débito{contact.debitos_pendentes > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(contact);
              }}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
              title="Ver Detalhes"
            >
              <Eye size={16} className="text-blue-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(contact);
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
  // VARIANT: DEFAULT (Card completo)
  // ============================================

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15)' }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-2xl border-2 ${getStatusColor()} overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer`}
      onClick={() => onViewDetails(contact)}
    >
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 relative">
        <div className="flex items-start justify-between">
          {/* Avatar e Info */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-2xl font-bold border-2 border-white/30 shadow-xl">
              {contact.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">
                {contact.nome}
              </h3>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-bold border border-white/30">
                  {contact.parentesco_display}
                </span>
                {contact.responsavel_financeiro && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-bold border border-white/30">
                    💰 Financeiro
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Menu de ações */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <MoreVertical size={20} className="text-white" />
            </button>

            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10 min-w-[180px]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(contact);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left"
                >
                  <Eye size={16} className="text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">Ver Detalhes</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(contact);
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
        {/* Status geral */}
        <div className={`p-3 rounded-lg border-2 mb-4 ${getStatusColor()}`}>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-bold text-gray-900">
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Contatos */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Mail size={16} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-semibold truncate">{contact.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <Phone size={16} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Telefone</p>
              <p className="font-semibold">{contact.telefone}</p>
            </div>
          </div>
        </div>

        {/* Filhos */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-purple-600" />
            <span className="text-sm font-bold text-gray-900">
              {contact.filhos.length} {contact.filhos.length === 1 ? 'Filho' : 'Filhos'}
            </span>
          </div>
          <div className="space-y-1">
            {contact.filhos.slice(0, 2).map((filho) => (
              <div key={filho.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{filho.nome}</span>
                <span className="text-xs text-gray-600">{filho.turma}</span>
              </div>
            ))}
            {contact.filhos.length > 2 && (
              <p className="text-xs text-gray-500 text-center py-1">
                +{contact.filhos.length - 2} {contact.filhos.length - 2 === 1 ? 'outro' : 'outros'}
              </p>
            )}
          </div>
        </div>

        {/* Badges de status */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${
            contact.documentacao_completa 
              ? 'bg-green-100 text-green-700' 
              : 'bg-orange-100 text-orange-700'
          }`}>
            <FileCheck size={12} />
            {contact.documentacao_completa ? 'Doc. Completa' : 'Doc. Pendente'}
          </div>
          
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${
            contact.mensalidades_em_dia 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <DollarSign size={12} />
            {contact.mensalidades_em_dia ? 'Em Dia' : `${contact.debitos_pendentes} Débitos`}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>Cadastro: {formatDate(contact.data_cadastro)}</span>
          </div>
          {contact.endereco && (
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              <span>{contact.endereco.cidade}/{contact.endereco.estado}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover indicator */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}