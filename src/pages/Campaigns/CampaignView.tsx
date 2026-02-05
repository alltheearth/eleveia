// src/pages/Campaigns/CampaignView.tsx
// 📊 VISUALIZAÇÃO DETALHADA DE CAMPANHA - REFATORADA
// Página de detalhes e análise de uma campanha específica

import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  MoreVertical,
  Edit2,
  Copy,
  Archive,
  Play,
  Pause,
  Trash2,
  Download,
  RefreshCw,
  Users,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Componentes Reutilizáveis
import { StatCard } from '../../components/common';

// Componentes Locais
import CampaignAnalytics from './components/CampaignAnalytics';
import CampaignTimeline from './components/CampaignTimeline';
import CampaignContacts from './components/CampaignContacts';
import CampaignSettings from './components/CampaignSettings';

// Types e dados
import type { Campaign } from '../../types/campaigns/campaign.types'
import { MOCK_CAMPAIGNS } from './utils/campaignConfig';
import { CAMPAIGN_TYPE_CONFIG, CAMPAIGN_STATUS_CONFIG, CHANNEL_CONFIG } from './utils/campaignConfig';
import PageModel from '../../components/layout/PageModel';

// ============================================
// TYPES
// ============================================

type TabView = 'analytics' | 'contacts' | 'timeline' | 'settings';

// ============================================
// MAIN COMPONENT
// ============================================

export default function CampaignView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ============================================
  // STATE
  // ============================================

  const [campaign, setCampaign] = useState<Campaign | null>(
    MOCK_CAMPAIGNS.find(c => c.id === parseInt(id || '0')) || null
  );

  const [activeTab, setActiveTab] = useState<TabView>('analytics');
  const [isStarred, setIsStarred] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // ============================================
  // COMPUTED
  // ============================================

  const stats = useMemo(() => {
    if (!campaign?.analytics) {
      return {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        failed: 0,
        deliveryRate: 0,
        openRate: 0,
        clickRate: 0,
        conversionRate: 0,
      };
    }

    const a = campaign.analytics;
    return {
      sent: a.messages_sent,
      delivered: a.messages_delivered,
      opened: a.messages_opened,
      clicked: a.messages_clicked,
      converted: a.conversions,
      failed: a.messages_failed,
      deliveryRate: a.delivery_rate,
      openRate: a.open_rate,
      clickRate: a.click_rate,
      conversionRate: a.conversion_rate,
    };
  }, [campaign]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleBack = () => {
    navigate('/campaigns');
  };

  const handleToggleStar = () => {
    setIsStarred(!isStarred);
    toast.success(isStarred ? '⭐ Removido dos favoritos' : '⭐ Adicionado aos favoritos!');
  };

  const handleEdit = () => {
    toast.success('✏️ Editar campanha');
    // TODO: Implementar modal de edição
  };

  const handleDuplicate = () => {
    toast.success('📋 Campanha duplicada!');
    // TODO: Implementar duplicação
  };

  const handleArchive = () => {
    if (window.confirm('Tem certeza que deseja arquivar esta campanha?')) {
      toast.success('📦 Campanha arquivada!');
      navigate('/campaigns');
    }
  };

  const handlePause = () => {
    toast.success('⏸️ Campanha pausada!');
    // TODO: Implementar pause
  };

  const handleResume = () => {
    toast.success('▶️ Campanha retomada!');
    // TODO: Implementar resume
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita.')) {
      toast.success('✅ Campanha excluída!');
      navigate('/campaigns');
    }
  };

  const handleExport = () => {
    toast.success('📥 Exportando dados da campanha...');
  };

  const handleRefresh = () => {
    toast.success('🔄 Dados atualizados!');
  };

  // ============================================
  // GUARDS
  // ============================================

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Campanha não encontrada</h2>
          <p className="text-gray-600 mb-6">A campanha que você está procurando não existe.</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
          >
            Voltar para Campanhas
          </button>
        </div>
      </div>
    );
  }

  const typeConfig = CAMPAIGN_TYPE_CONFIG[campaign.type];
  const statusConfig = CAMPAIGN_STATUS_CONFIG[campaign.status];
  const canBePaused = ['sending', 'scheduled'].includes(campaign.status);
  const canBeResumed = campaign.status === 'paused';

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <PageModel>
      
      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 sticky top-0 z-30"
      >
        <div className="px-6 py-4">
          
          {/* Top row - Navegação e ações */}
          <div className="flex items-center justify-between mb-4">
            
            {/* Voltar */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
            >
              <ArrowLeft size={20} />
              Voltar para Campanhas
            </button>

            {/* Ações */}
            <div className="flex items-center gap-3">
              
              {/* Favoritar */}
              <button
                onClick={handleToggleStar}
                className={`p-2 rounded-lg transition-colors ${
                  isStarred
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Star size={20} fill={isStarred ? 'currentColor' : 'none'} />
              </button>

              {/* Pause/Resume */}
              {canBePaused && (
                <button
                  onClick={handlePause}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg font-semibold transition-colors"
                >
                  <Pause size={18} />
                  Pausar
                </button>
              )}

              {canBeResumed && (
                <button
                  onClick={handleResume}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-semibold transition-colors"
                >
                  <Play size={18} />
                  Retomar
                </button>
              )}

              {/* Refresh */}
              <button
                onClick={handleRefresh}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw size={20} />
              </button>

              {/* Export */}
              <button
                onClick={handleExport}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <Download size={20} />
              </button>

              {/* More Actions */}
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  <MoreVertical size={20} />
                </button>

                {showActions && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowActions(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20"
                    >
                      <button
                        onClick={() => {
                          handleEdit();
                          setShowActions(false);
                        }}
                        className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 text-gray-700 text-sm font-medium"
                      >
                        <Edit2 size={16} />
                        Editar Campanha
                      </button>

                      <button
                        onClick={() => {
                          handleDuplicate();
                          setShowActions(false);
                        }}
                        className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 text-gray-700 text-sm font-medium"
                      >
                        <Copy size={16} />
                        Duplicar
                      </button>

                      <button
                        onClick={() => {
                          handleArchive();
                          setShowActions(false);
                        }}
                        className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 text-gray-700 text-sm font-medium"
                      >
                        <Archive size={16} />
                        Arquivar
                      </button>

                      <div className="border-t border-gray-200 my-2" />
                      
                      <button
                        onClick={() => {
                          handleDelete();
                          setShowActions(false);
                        }}
                        className="w-full px-4 py-2 flex items-center gap-3 hover:bg-red-50 text-red-700 text-sm font-medium"
                      >
                        <Trash2 size={16} />
                        Excluir
                      </button>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Campaign Info */}
          <div className="flex items-start gap-6">
            
            {/* Icon + Type */}
            <div className={`w-16 h-16 bg-gradient-to-br ${typeConfig.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
              {typeConfig.icon}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 truncate">
                    {campaign.name}
                  </h1>
                  {campaign.description && (
                    <p className="text-gray-600 line-clamp-2">
                      {campaign.description}
                    </p>
                  )}
                </div>

                {/* Status Badge */}
                <span className={`inline-flex items-center gap-2 px-4 py-2 ${statusConfig.color} rounded-full text-sm font-bold border flex-shrink-0`}>
                  <span className={`w-2 h-2 ${statusConfig.dotColor} rounded-full animate-pulse`} />
                  {statusConfig.label}
                </span>
              </div>

              {/* Meta info */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 ${typeConfig.bg} rounded-lg text-xs font-semibold ${typeConfig.text}`}>
                    {typeConfig.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span className="font-semibold text-gray-900">
                    {campaign.audience_count.toLocaleString()}
                  </span>
                  <span>contatos</span>
                </div>

                {/* Channels */}
                <div className="flex items-center gap-2">
                  {campaign.channels.map((channel) => {
                    const channelConfig = CHANNEL_CONFIG[channel];
                    return (
                      <span
                        key={channel}
                        className={`inline-flex items-center gap-1 px-2 py-1 ${channelConfig.bgColor} rounded-md text-xs font-semibold ${channelConfig.color}`}
                        title={channelConfig.label}
                      >
                        {channelConfig.icon}
                      </span>
                    );
                  })}
                </div>

                {/* Tags */}
                {campaign.tags && campaign.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    {campaign.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                    {campaign.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{campaign.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-6 border-t border-gray-200 pt-4">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📊 Analytics
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                activeTab === 'contacts'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              👥 Contatos
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                activeTab === 'timeline'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📅 Timeline
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                activeTab === 'settings'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ⚙️ Configurações
            </button>
          </div>
        </div>
      </motion.div>

      {/* ========================================== */}
      {/* STATS CARDS */}
      {/* ========================================== */}
      
      <div className="px-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            label="Mensagens Enviadas"
            value={stats.sent.toLocaleString()}
            icon={<Send size={24} className="text-blue-600" />}
            color="blue"
            subtitle={`${stats.deliveryRate.toFixed(1)}% entregues`}
          />

          <StatCard
            label="Taxa de Abertura"
            value={`${stats.openRate.toFixed(1)}%`}
            icon={<MessageSquare size={24} className="text-green-600" />}
            color="green"
            subtitle={`${stats.opened.toLocaleString()} aberturas`}
          />

          <StatCard
            label="Taxa de Cliques"
            value={`${stats.clickRate.toFixed(1)}%`}
            icon={<TrendingUp size={24} className="text-purple-600" />}
            color="purple"
            subtitle={`${stats.clicked.toLocaleString()} cliques`}
          />

          <StatCard
            label="Conversões"
            value={stats.converted.toLocaleString()}
            icon={<CheckCircle2 size={24} className="text-orange-600" />}
            color="orange"
            subtitle={`${stats.conversionRate.toFixed(1)}% convertidos`}
          />
        </div>
      </div>

      {/* ========================================== */}
      {/* CONTENT - TAB VIEWS */}
      {/* ========================================== */}
      
      <div className="px-6">
        {activeTab === 'analytics' && (
          <CampaignAnalytics campaign={campaign} />
        )}

        {activeTab === 'contacts' && (
          <CampaignContacts campaign={campaign} />
        )}

        {activeTab === 'timeline' && (
          <CampaignTimeline campaign={campaign} />
        )}

        {activeTab === 'settings' && (
          <CampaignSettings campaign={campaign} onUpdate={setCampaign} />
        )}
      </div>
      </PageModel>
    </div>
  );
}