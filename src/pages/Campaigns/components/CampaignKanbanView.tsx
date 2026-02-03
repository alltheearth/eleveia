// src/pages/Campaigns/components/CampaignKanbanView.tsx

import { motion, AnimatePresence } from 'framer-motion';
import CampaignCard from './CampaignCard';
import type { Campaign, CampaignStatus } from '../../types/campaign.types';

interface CampaignKanbanViewProps {
  campaigns: Campaign[];
  loading?: boolean;
  onView?: (campaign: Campaign) => void;
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (campaign: Campaign) => void;
  onDuplicate?: (campaign: Campaign) => void;
  onSend?: (campaign: Campaign) => void;
  onPause?: (campaign: Campaign) => void;
  onResume?: (campaign: Campaign) => void;
  onViewAnalytics?: (campaign: Campaign) => void;
}

interface KanbanColumn {
  status: CampaignStatus;
  title: string;
  icon: string;
  color: string;
  campaigns: Campaign[];
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-100 rounded-2xl p-4 h-[600px] animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="space-y-3">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="h-48 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 bg-white rounded-2xl col-span-full"
    >
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
        <span className="text-5xl">📧</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Nenhuma campanha encontrada
      </h3>
      <p className="text-gray-600 mb-6">
        Comece criando sua primeira campanha de comunicação
      </p>
    </motion.div>
  );
}

export default function CampaignKanbanView({
  campaigns,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onSend,
  onPause,
  onResume,
  onViewAnalytics,
}: CampaignKanbanViewProps) {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (campaigns.length === 0) {
    return <EmptyState />;
  }

  // Define colunas do Kanban
  const columns: KanbanColumn[] = [
    {
      status: 'draft',
      title: 'Rascunhos',
      icon: '📝',
      color: 'from-gray-400 to-gray-500',
      campaigns: campaigns.filter(c => c.status === 'draft'),
    },
    {
      status: 'scheduled',
      title: 'Agendadas',
      icon: '⏰',
      color: 'from-blue-400 to-blue-500',
      campaigns: campaigns.filter(c => c.status === 'scheduled'),
    },
    {
      status: 'sending',
      title: 'Em Envio',
      icon: '🚀',
      color: 'from-orange-400 to-orange-500',
      campaigns: campaigns.filter(c => c.status === 'sending'),
    },
    {
      status: 'completed',
      title: 'Concluídas',
      icon: '✅',
      color: 'from-green-400 to-green-500',
      campaigns: campaigns.filter(c => c.status === 'completed'),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((column, columnIndex) => (
        <motion.div
          key={column.status}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: columnIndex * 0.1 }}
          className="flex flex-col h-full"
        >
          {/* Column Header */}
          <div className="mb-4">
            <div className={`bg-gradient-to-r ${column.color} rounded-2xl p-4 shadow-lg`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{column.icon}</span>
                  <h3 className="font-bold text-white text-lg">{column.title}</h3>
                </div>
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {column.campaigns.length}
                  </span>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="h-1 bg-white/20 rounded-full overflow-hidden mt-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((column.campaigns.length / campaigns.length) * 100, 100)}%` }}
                  transition={{ duration: 0.8, delay: columnIndex * 0.1 + 0.3 }}
                  className="h-full bg-white"
                />
              </div>
            </div>
          </div>

          {/* Column Content */}
          <div className="flex-1 bg-gray-50 rounded-2xl p-4 min-h-[500px] max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
            {column.campaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                  <span className="text-3xl opacity-50">{column.icon}</span>
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  Nenhuma campanha
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {column.status === 'draft' && 'Crie uma nova campanha'}
                  {column.status === 'scheduled' && 'Agende uma campanha'}
                  {column.status === 'sending' && 'Envie uma campanha'}
                  {column.status === 'completed' && 'Aguarde conclusões'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {column.campaigns.map((campaign, index) => (
                    <motion.div
                      key={campaign.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      layout
                    >
                      <CampaignCard
                        campaign={campaign}
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onDuplicate={onDuplicate}
                        onSend={onSend}
                        onPause={onPause}
                        onResume={onResume}
                        onViewAnalytics={onViewAnalytics}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Column Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              {column.campaigns.length} {column.campaigns.length === 1 ? 'campanha' : 'campanhas'}
            </p>
          </div>
        </motion.div>
      ))}

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #CBD5E0;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #A0AEC0;
        }
      `}</style>
    </div>
  );
}