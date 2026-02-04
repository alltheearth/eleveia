// src/pages/Campaigns/components/CampaignFilters.tsx
// 🔍 FILTROS AVANÇADOS PARA CAMPANHAS
// Componente de filtros específico para a página de campanhas

import { motion } from 'framer-motion';
import type { CampaignType, CampaignStatus } from '../types/campaign.types';
import { CAMPAIGN_TYPE_CONFIG, CAMPAIGN_STATUS_CONFIG } from '../utils/campaignConfig';

// ============================================
// TYPES
// ============================================

export type CampaignViewMode = 'grid' | 'list' | 'kanban';

interface CampaignFiltersProps {
  statusFilter: CampaignStatus | 'all';
  typeFilter: CampaignType | 'all';
  onStatusChange: (status: CampaignStatus | 'all') => void;
  onTypeChange: (type: CampaignType | 'all') => void;
}

// ============================================
// COMPONENT
// ============================================

export default function CampaignFilters({
  statusFilter,
  typeFilter,
  onStatusChange,
  onTypeChange,
}: CampaignFiltersProps) {
  
  const statusOptions: Array<{ value: CampaignStatus | 'all'; label: string }> = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'draft', label: CAMPAIGN_STATUS_CONFIG.draft.label },
    { value: 'scheduled', label: CAMPAIGN_STATUS_CONFIG.scheduled.label },
    { value: 'sending', label: CAMPAIGN_STATUS_CONFIG.sending.label },
    { value: 'paused', label: CAMPAIGN_STATUS_CONFIG.paused.label },
    { value: 'completed', label: CAMPAIGN_STATUS_CONFIG.completed.label },
    { value: 'failed', label: CAMPAIGN_STATUS_CONFIG.failed.label },
  ];

  const typeOptions: Array<{ value: CampaignType | 'all'; label: string }> = [
    { value: 'all', label: 'Todos os Tipos' },
    { value: 'marketing', label: CAMPAIGN_TYPE_CONFIG.marketing.label },
    { value: 'transactional', label: CAMPAIGN_TYPE_CONFIG.transactional.label },
    { value: 'notification', label: CAMPAIGN_TYPE_CONFIG.notification.label },
    { value: 'educational', label: CAMPAIGN_TYPE_CONFIG.educational.label },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
    >
      <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
        Filtros Avançados
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ========================================== */}
        {/* FILTRO DE STATUS */}
        {/* ========================================== */}
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Status da Campanha
          </label>
          <div className="grid grid-cols-2 gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onStatusChange(option.value)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === option.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================== */}
        {/* FILTRO DE TIPO */}
        {/* ========================================== */}
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Tipo de Campanha
          </label>
          <div className="grid grid-cols-2 gap-2">
            {typeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onTypeChange(option.value)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  typeFilter === option.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 