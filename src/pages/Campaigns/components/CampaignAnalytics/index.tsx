// src/pages/Campaigns/components/CampaignAnalytics/index.tsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, RefreshCw, Calendar, TrendingUp } from 'lucide-react';
import MetricsOverview from './MetricsOverview';
import DeliveryChart from './DeliveryChart';
import EngagementChart from './EngagementChart';
import ConversionFunnel from './ConversionFunnel';
import TimelineChart from './TimelineChart';
import ContactsTable from './ContactsTable';
import ExportReportButton from './ExportReportButton';
import type { Campaign, CampaignAnalytics as CampaignAnalyticsType } from '../../types/campaign.types';

interface CampaignAnalyticsProps {
  campaign: Campaign;
  analytics: CampaignAnalyticsType;
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export default function CampaignAnalytics({
  campaign,
  analytics,
  isOpen,
  onClose,
  onRefresh,
}: CampaignAnalyticsProps) {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'all'>('7d');
  const [selectedChannel, setSelectedChannel] = useState<'all' | 'whatsapp' | 'email' | 'sms'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  if (!isOpen) return null;

  const campaignStatus = campaign.status;
  const isActive = ['sending', 'sent', 'completed'].includes(campaignStatus);

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-4 md:inset-8 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Analytics da Campanha
              </h2>
              <p className="text-purple-100 text-sm">
                {campaign.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Refresh */}
            {onRefresh && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                title="Atualizar dados"
              >
                <RefreshCw
                  className={`text-white ${isRefreshing ? 'animate-spin' : ''}`}
                  size={20}
                />
              </button>
            )}

            {/* Export */}
            <ExportReportButton
              campaign={campaign}
              analytics={analytics}
            />

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="text-white" size={24} />
            </button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 bg-gray-50">
          <div className="flex items-center gap-4">
            {/* Date range */}
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-600" />
              <div className="flex gap-1 bg-white rounded-lg p-1 border border-gray-200">
                <button
                  onClick={() => setDateRange('7d')}
                  className={`px-3 py-1.5 rounded text-sm font-semibold transition-all ${
                    dateRange === '7d'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  7 dias
                </button>
                <button
                  onClick={() => setDateRange('30d')}
                  className={`px-3 py-1.5 rounded text-sm font-semibold transition-all ${
                    dateRange === '30d'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  30 dias
                </button>
                <button
                  onClick={() => setDateRange('all')}
                  className={`px-3 py-1.5 rounded text-sm font-semibold transition-all ${
                    dateRange === 'all'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Tudo
                </button>
              </div>
            </div>

            {/* Channel filter */}
            <div className="flex gap-1 bg-white rounded-lg p-1 border border-gray-200">
              <button
                onClick={() => setSelectedChannel('all')}
                className={`px-3 py-1.5 rounded text-sm font-semibold transition-all ${
                  selectedChannel === 'all'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Todos
              </button>
              {campaign.channels.includes('whatsapp') && (
                <button
                  onClick={() => setSelectedChannel('whatsapp')}
                  className={`px-3 py-1.5 rounded text-sm font-semibold transition-all ${
                    selectedChannel === 'whatsapp'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📱 WhatsApp
                </button>
              )}
              {campaign.channels.includes('email') && (
                <button
                  onClick={() => setSelectedChannel('email')}
                  className={`px-3 py-1.5 rounded text-sm font-semibold transition-all ${
                    selectedChannel === 'email'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📧 Email
                </button>
              )}
              {campaign.channels.includes('sms') && (
                <button
                  onClick={() => setSelectedChannel('sms')}
                  className={`px-3 py-1.5 rounded text-sm font-semibold transition-all ${
                    selectedChannel === 'sms'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  💬 SMS
                </button>
              )}
            </div>
          </div>

          {/* Status badge */}
          <div className={`px-4 py-2 rounded-lg border-2 font-semibold text-sm ${
            campaignStatus === 'completed'
              ? 'bg-green-50 text-green-700 border-green-200'
              : campaignStatus === 'sending'
              ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
              : campaignStatus === 'sent'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-gray-50 text-gray-700 border-gray-200'
          }`}>
            {campaignStatus === 'completed' && '✅ Concluída'}
            {campaignStatus === 'sending' && '🚀 Enviando'}
            {campaignStatus === 'sent' && '📤 Enviada'}
            {campaignStatus === 'draft' && '📝 Rascunho'}
            {campaignStatus === 'scheduled' && '⏰ Agendada'}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
          {!isActive ? (
            /* Empty state para campanhas não ativas */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="text-gray-400" size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Ainda sem dados de análise
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                Esta campanha ainda não foi enviada. Os dados de análise estarão disponíveis
                assim que a campanha começar a ser enviada.
              </p>
            </motion.div>
          ) : (
            <>
              {/* Metrics Overview */}
              <MetricsOverview
                analytics={analytics}
                selectedChannel={selectedChannel}
              />

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Delivery Chart */}
                <DeliveryChart
                  analytics={analytics}
                  selectedChannel={selectedChannel}
                />

                {/* Engagement Chart */}
                <EngagementChart
                  analytics={analytics}
                  selectedChannel={selectedChannel}
                />
              </div>

              {/* Conversion Funnel */}
              <ConversionFunnel
                analytics={analytics}
                selectedChannel={selectedChannel}
              />

              {/* Timeline */}
              <TimelineChart
                timeline={analytics.timeline}
                dateRange={dateRange}
              />

              {/* Contacts Table */}
              <ContactsTable
                campaignId={campaign.id}
                selectedChannel={selectedChannel}
              />
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 bg-white text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>
              Última atualização: {new Date().toLocaleString('pt-BR')}
            </span>
            {campaign.sent_at && (
              <span>
                • Enviada em: {new Date(campaign.sent_at).toLocaleString('pt-BR')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Dados em tempo real</span>
          </div>
        </div>
      </motion.div>
    </>
  );
}