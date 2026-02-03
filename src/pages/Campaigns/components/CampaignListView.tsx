// src/pages/Campaigns/components/CampaignListView.tsx
// 📋 VISUALIZAÇÃO EM LISTA DE CAMPANHAS - PROFISSIONAL

import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import CampaignCard from './CampaignCard';
import { EmptyState } from '../../../components/common';
import type { Campaign, CampaignStatus } from '../../../types/campaigns/campaign.types';

// ============================================
// TYPES
// ============================================

interface CampaignListViewProps {
  campaigns: Campaign[];
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
  onStatusChange?: (campaign: Campaign, newStatus: CampaignStatus) => void;
  onPause?: (campaign: Campaign) => void;
  onResume?: (campaign: Campaign) => void;
  onSend?: (campaign: Campaign) => void;
  loading?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export default function CampaignListView({
  campaigns,
  onEdit,
  onDelete,
  onStatusChange,
  onPause,
  onResume,
  onSend,
  loading = false,
}: CampaignListViewProps) {
  
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
  
  if (campaigns.length === 0) {
    return (
      <EmptyState
        icon={<Send className="h-16 w-16 text-gray-400" />}
        title="Nenhuma campanha encontrada"
        description="Não há campanhas cadastradas ou nenhuma campanha corresponde aos filtros selecionados."
      />
    );
  }

  // ============================================
  // AGRUPAR POR STATUS
  // ============================================
  
  const campaignsByStatus = campaigns.reduce((acc, campaign) => {
    if (!acc[campaign.status]) {
      acc[campaign.status] = [];
    }
    acc[campaign.status].push(campaign);
    return acc;
  }, {} as Record<string, Campaign[]>);

  const statusOrder: CampaignStatus[] = ['draft', 'scheduled', 'sending', 'sent', 'completed', 'paused', 'cancelled', 'failed'];
  const statusLabels: Record<CampaignStatus, { label: string; icon: string; color: string }> = {
    draft: { label: 'Rascunhos', icon: '📝', color: 'text-gray-600' },
    scheduled: { label: 'Agendadas', icon: '⏰', color: 'text-blue-600' },
    sending: { label: 'Em Envio', icon: '🚀', color: 'text-yellow-600' },
    sent: { label: 'Enviadas', icon: '✅', color: 'text-green-600' },
    completed: { label: 'Concluídas', icon: '✅', color: 'text-green-600' },
    paused: { label: 'Pausadas', icon: '⏸️', color: 'text-orange-600' },
    cancelled: { label: 'Canceladas', icon: '🚫', color: 'text-red-600' },
    failed: { label: 'Falharam', icon: '❌', color: 'text-red-600' },
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-8">
      <AnimatePresence mode="popLayout">
        {statusOrder.map((status) => {
          const statusCampaigns = campaignsByStatus[status] || [];
          if (statusCampaigns.length === 0) return null;

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
                    {statusCampaigns.length}
                  </span>
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>

              {/* Lista de campanhas */}
              <div className="space-y-3">
                {statusCampaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <CampaignCard
                      campaign={campaign}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onStatusChange={onStatusChange}
                      onPause={onPause}
                      onResume={onResume}
                      onSend={onSend}
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