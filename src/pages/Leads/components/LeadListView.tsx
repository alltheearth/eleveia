// src/pages/Leads/components/LeadListView.tsx
// 📋 VISUALIZAÇÃO EM LISTA DE LEADS - PROFISSIONAL

import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import LeadCard from './LeadCard';
import { EmptyState } from '../../../components/common';
import type { Lead } from '../../../services';

// ============================================
// TYPES
// ============================================

interface LeadListViewProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onStatusChange?: (lead: Lead, newStatus: Lead['status']) => void;
  loading?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export default function LeadListView({
  leads,
  onEdit,
  onDelete,
  onStatusChange,
  loading = false,
}: LeadListViewProps) {
  
  // ============================================
  // LOADING STATE
  // ============================================
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
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
      <EmptyState
        icon={<Users className="h-16 w-16 text-gray-400" />}
        title="Nenhum lead encontrado"
        description="Não há leads cadastrados ou nenhum lead corresponde aos filtros selecionados."
      />
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

              {/* Lista de leads */}
              <div className="space-y-3">
                {statusLeads.map((lead, index) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <LeadCard
                      lead={lead}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onStatusChange={onStatusChange}
                      variant="compact"
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