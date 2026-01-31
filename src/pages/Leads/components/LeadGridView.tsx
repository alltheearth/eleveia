// src/pages/Leads/components/LeadGridView.tsx
// 📱 VISUALIZAÇÃO EM GRADE DE LEADS - PROFISSIONAL

import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import LeadCard from './LeadCard';
import { EmptyState } from '../../../components/common';
import type { Lead } from '../../../services';

// ============================================
// TYPES
// ============================================

interface LeadGridViewProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onStatusChange?: (lead: Lead, newStatus: Lead['status']) => void;
  loading?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export default function LeadGridView({
  leads,
  onEdit,
  onDelete,
  onStatusChange,
  loading = false,
}: LeadGridViewProps) {
  
  // ============================================
  // LOADING STATE
  // ============================================
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
          >
            <div className="bg-gray-200 h-24" />
            <div className="p-6 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="space-y-2 pt-3">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ============================================
  // EMPTY STATE
  // ============================================
  
  if (leads.length === 0) {
    return (
      <div className="col-span-full">
        <EmptyState
          icon={<Users className="h-16 w-16 text-gray-400" />}
          title="Nenhum lead encontrado"
          description="Não há leads cadastrados ou nenhum lead corresponde aos filtros selecionados. Crie um novo lead para começar."
          action={{
            label: 'Criar Primeiro Lead',
            onClick: () => {}, // Será passado via props se necessário
          }}
        />
      </div>
    );
  }

  // ============================================
  // AGRUPAR POR STATUS
  // ============================================
  
  const leadsByStatus = leads.reduce((acc, lead) => {
    if (!acc[lead.status]) {
      acc[lead.status] = [];
    }
    acc[lead.status].push(lead);
    return acc;
  }, {} as Record<string, Lead[]>);

  const statusOrder: Lead['status'][] = ['novo', 'contato', 'qualificado', 'conversao', 'perdido'];
  const statusLabels: Record<Lead['status'], { label: string; icon: string; color: string }> = {
    novo: { label: 'Novos Leads', icon: '🆕', color: 'text-blue-600' },
    contato: { label: 'Em Contato', icon: '📞', color: 'text-yellow-600' },
    qualificado: { label: 'Qualificados', icon: '⭐', color: 'text-purple-600' },
    conversao: { label: 'Convertidos', icon: '✅', color: 'text-green-600' },
    perdido: { label: 'Perdidos', icon: '❌', color: 'text-red-600' },
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-8">
      <AnimatePresence mode="popLayout">
        {statusOrder.map((status) => {
          const statusLeads = leadsByStatus[status] || [];
          if (statusLeads.length === 0) return null;

          const statusInfo = statusLabels[status];

          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header do grupo */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <h3 className={`text-lg font-bold ${statusInfo.color} capitalize px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-2`}>
                  <span className="text-2xl">{statusInfo.icon}</span>
                  {statusInfo.label}
                  <span className="ml-2 px-2 py-0.5 bg-white rounded-full text-xs">
                    {statusLeads.length}
                  </span>
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>

              {/* Grid de leads */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statusLeads.map((lead, index) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    layout
                  >
                    <LeadCard
                      lead={lead}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onStatusChange={onStatusChange}
                      variant="default"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}