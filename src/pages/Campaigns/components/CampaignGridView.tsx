// src/pages/Campaigns/components/CampaignGridView.tsx
// 🎴 VISUALIZAÇÃO EM GRADE

import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';

import CampaignCard from './CampaignCard';
import type { Campaign } from '../types/campaign.types';

// ============================================
// TYPES
// ============================================

interface CampaignGridViewProps {
  campaigns: Campaign[];
  onView?: (campaign: Campaign) => void;
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (campaign: Campaign) => void;
  onPause?: (campaign: Campaign) => void;
  onResume?: (campaign: Campaign) => void;
  onDuplicate?: (campaign: Campaign) => void;
  loading?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export default function CampaignGridView({
  campaigns,
  onView,
  onEdit,
  onDelete,
  onPause,
  onResume,
  onDuplicate,
  loading = false,
}: CampaignGridViewProps) {
  
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
            <div className="h-32 bg-gray-200" />
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-16 bg-gray-200 rounded-xl" />
                <div className="h-16 bg-gray-200 rounded-xl" />
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300"
      >
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <LayoutGrid className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Nenhuma campanha encontrada
        </h3>
        <p className="text-gray-600 text-center max-w-md mb-6">
          Não há campanhas cadastradas ou nenhuma campanha corresponde aos filtros selecionados.
        </p>
      </motion.div>
    );
  }

  // ============================================
  // MAIN RENDER
  // ============================================
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {campaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onPause={onPause}
            onResume={onResume}
            onDuplicate={onDuplicate}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}