// src/pages/Campaigns/index.tsx
// 📢 PÁGINA DE CAMPANHAS - DESIGN PROFISSIONAL E COMPLETO

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, RefreshCw, Download, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

// Layout
import PageModel from '../../components/layout/PageModel';

// Componentes Comuns
import { 
  ConfirmDialog,
  FormModal,
  LoadingState,
} from '../../components/common';

// Componentes Locais
import CampaignStats from './components/CampaignStats';
import CampaignFilters, { type CampaignViewMode, type CampaignFiltersData } from './components/CampaignFilters';
import CampaignGridView from './components/CampaignGridView';
import CampaignListView from './components/CampaignListView';
import CampaignKanbanView from './components/CampaignKanbanView';

// Types
import type { Campaign, CampaignType, CampaignStatus } from '../../types/campaigns/campaign.types';

// ============================================
// DADOS MOCADOS (substituir por API depois)
// ============================================

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    school: 1,
    school_name: 'Escola ABC',
    name: 'Campanha de Matrícula 2026',
    type: 'matricula',
    description: 'Campanha para captação de novos alunos para o ano letivo de 2026',
    tags: ['matricula', 'novos-alunos'],
    audience_filters: [],
    audience_count: 450,
    channels: ['whatsapp', 'email'],
    channel_priority: ['whatsapp', 'email'],
    fallback_enabled: true,
    message_content: {
      whatsapp: {
        text: 'Olá {{nome}}! Venha fazer parte da nossa escola!',
      },
      email: {
        subject: 'Matrículas Abertas 2026',
        body_html: '<p>Olá {{nome}}!</p>',
        body_text: 'Olá {{nome}}!',
      },
    },
    schedule_type: 'scheduled',
    scheduled_at: '2026-02-10T10:00:00',
    follow_ups: [],
    status: 'scheduled',
    created_at: '2026-01-20T14:30:00',
    updated_at: '2026-01-25T10:00:00',
    analytics: {
      total_recipients: 450,
      messages_sent: 450,
      messages_delivered: 441,
      messages_failed: 9,
      messages_opened: 315,
      messages_clicked: 142,
      messages_responded: 89,
      conversions: 67,
      delivery_rate: 98.0,
      open_rate: 71.4,
      click_rate: 32.2,
      response_rate: 20.2,
      conversion_rate: 15.2,
      by_channel: {
        whatsapp: {
          sent: 300,
          delivered: 295,
          failed: 5,
          opened: 220,
          clicked: 98,
          responded: 65,
        },
        email: {
          sent: 150,
          delivered: 146,
          failed: 4,
          opened: 95,
          clicked: 44,
          responded: 24,
        },
      },
      timeline: [],
    },
  },
  {
    id: 2,
    school: 1,
    school_name: 'Escola ABC',
    name: 'Lembrete de Reunião de Pais',
    type: 'reuniao',
    description: 'Lembrete para reunião trimestral com responsáveis',
    tags: ['reuniao', 'pais'],
    audience_filters: [],
    audience_count: 320,
    channels: ['whatsapp', 'sms'],
    channel_priority: ['whatsapp', 'sms'],
    fallback_enabled: true,
    message_content: {
      whatsapp: {
        text: 'Olá {{nome}}! Lembramos que a reunião será amanhã às 19h.',
      },
    },
    schedule_type: 'immediate',
    follow_ups: [],
    status: 'sending',
    created_at: '2026-02-02T09:00:00',
    updated_at: '2026-02-02T09:30:00',
    sent_at: '2026-02-02T10:00:00',
  },
  {
    id: 3,
    school: 1,
    school_name: 'Escola ABC',
    name: 'Comunicado - Volta às Aulas',
    type: 'comunicado',
    description: 'Informações importantes sobre o retorno das aulas',
    tags: ['comunicado', 'inicio-ano'],
    audience_filters: [],
    audience_count: 780,
    channels: ['email', 'whatsapp'],
    channel_priority: ['email', 'whatsapp'],
    fallback_enabled: false,
    message_content: {
      email: {
        subject: 'Volta às Aulas - Informações Importantes',
        body_html: '<p>Prezado(a) {{nome}},</p><p>As aulas retornam em 10/02/2026.</p>',
        body_text: 'Prezado(a) {{nome}}, As aulas retornam em 10/02/2026.',
      },
    },
    schedule_type: 'immediate',
    follow_ups: [],
    status: 'completed',
    created_at: '2026-01-28T14:00:00',
    updated_at: '2026-01-28T15:00:00',
    sent_at: '2026-01-28T15:00:00',
    completed_at: '2026-01-28T16:30:00',
    analytics: {
      total_recipients: 780,
      messages_sent: 780,
      messages_delivered: 765,
      messages_failed: 15,
      messages_opened: 612,
      messages_clicked: 245,
      messages_responded: 128,
      conversions: 98,
      delivery_rate: 98.1,
      open_rate: 80.0,
      click_rate: 32.0,
      response_rate: 16.7,
      conversion_rate: 12.8,
      by_channel: {},
      timeline: [],
    },
  },
  {
    id: 4,
    school: 1,
    school_name: 'Escola ABC',
    name: 'Campanha Passei Direto',
    type: 'passei_direto',
    description: 'Captação via parceria Passei Direto',
    tags: ['passei-direto', 'parceria'],
    audience_filters: [],
    audience_count: 230,
    channels: ['email'],
    channel_priority: ['email'],
    fallback_enabled: false,
    message_content: {
      email: {
        subject: 'Seja bem-vindo à nossa escola!',
        body_html: '<p>Olá {{nome}}!</p>',
        body_text: 'Olá {{nome}}!',
      },
    },
    schedule_type: 'immediate',
    follow_ups: [],
    status: 'draft',
    created_at: '2026-02-01T11:00:00',
    updated_at: '2026-02-01T11:30:00',
  },
  {
    id: 5,
    school: 1,
    school_name: 'Escola ABC',
    name: 'Cobrança - Mensalidade Janeiro',
    type: 'cobranca',
    description: 'Lembrete de vencimento da mensalidade',
    tags: ['cobranca', 'financeiro'],
    audience_filters: [],
    audience_count: 125,
    channels: ['whatsapp', 'email', 'sms'],
    channel_priority: ['whatsapp', 'email', 'sms'],
    fallback_enabled: true,
    message_content: {
      whatsapp: {
        text: 'Olá {{nome}}! Sua mensalidade vence amanhã.',
      },
    },
    schedule_type: 'scheduled',
    scheduled_at: '2026-02-05T08:00:00',
    follow_ups: [],
    status: 'paused',
    created_at: '2026-02-01T16:00:00',
    updated_at: '2026-02-02T10:00:00',
  },
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function CampaignsPage() {
  
  // ============================================
  // STATE
  // ============================================
  
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<CampaignViewMode>('kanban');
  
  const [filters, setFilters] = useState<CampaignFiltersData>({
    search: '',
    status: 'all',
    type: 'all',
    dateFrom: '',
    dateTo: '',
  });

  const [showWizard, setShowWizard] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);

  // ============================================
  // COMPUTED
  // ============================================
  
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const matchesSearch =
        filters.search === '' ||
        campaign.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        campaign.description?.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus = filters.status === 'all' || campaign.status === filters.status;
      const matchesType = filters.type === 'all' || campaign.type === filters.type;

      const matchesDateFrom = 
        !filters.dateFrom || 
        new Date(campaign.created_at) >= new Date(filters.dateFrom);

      const matchesDateTo = 
        !filters.dateTo || 
        new Date(campaign.created_at) <= new Date(filters.dateTo);

      return matchesSearch && matchesStatus && matchesType && matchesDateFrom && matchesDateTo;
    });
  }, [campaigns, filters]);

  const stats = useMemo(() => {
    const allCampaigns = campaigns;
    
    // Calcular médias de analytics
    const campaignsWithAnalytics = allCampaigns.filter(c => c.analytics);
    const avgDeliveryRate = campaignsWithAnalytics.length > 0
      ? campaignsWithAnalytics.reduce((sum, c) => sum + (c.analytics?.delivery_rate || 0), 0) / campaignsWithAnalytics.length
      : 0;
    const avgOpenRate = campaignsWithAnalytics.length > 0
      ? campaignsWithAnalytics.reduce((sum, c) => sum + (c.analytics?.open_rate || 0), 0) / campaignsWithAnalytics.length
      : 0;
    const avgClickRate = campaignsWithAnalytics.length > 0
      ? campaignsWithAnalytics.reduce((sum, c) => sum + (c.analytics?.click_rate || 0), 0) / campaignsWithAnalytics.length
      : 0;
    const avgConversionRate = campaignsWithAnalytics.length > 0
      ? campaignsWithAnalytics.reduce((sum, c) => sum + (c.analytics?.conversion_rate || 0), 0) / campaignsWithAnalytics.length
      : 0;

    // Enviadas hoje
    const today = new Date().toISOString().split('T')[0];
    const sentToday = allCampaigns.filter(c => 
      c.sent_at && c.sent_at.split('T')[0] === today
    ).length;

    return {
      total: allCampaigns.length,
      draft: allCampaigns.filter(c => c.status === 'draft').length,
      scheduled: allCampaigns.filter(c => c.status === 'scheduled').length,
      sending: allCampaigns.filter(c => c.status === 'sending').length,
      completed: allCampaigns.filter(c => c.status === 'completed').length,
      failed: allCampaigns.filter(c => c.status === 'failed').length,
      avg_delivery_rate: avgDeliveryRate,
      avg_open_rate: avgOpenRate,
      avg_click_rate: avgClickRate,
      avg_conversion_rate: avgConversionRate,
      sent_today: sentToday,
      active_campaigns: allCampaigns.filter(c => 
        ['scheduled', 'sending', 'sent'].includes(c.status)
      ).length,
    };
  }, [campaigns]);

  const hasActiveFilters = 
    filters.search !== '' || 
    filters.status !== 'all' || 
    filters.type !== 'all' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '';

  // ============================================
  // HANDLERS
  // ============================================
  
  const handleEdit = (campaign: Campaign): void => {
    setEditingCampaign(campaign);
    setShowWizard(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (): Promise<void> => {
    if (!campaignToDelete) return;
    
    setCampaigns(prev => prev.filter(c => c.id !== campaignToDelete.id));
    toast.success('✅ Campanha deletada com sucesso!');
    setCampaignToDelete(null);
  };

  const handleDuplicate = (campaign: Campaign): void => {
    const newCampaign: Campaign = {
      ...campaign,
      id: Math.max(...campaigns.map(c => c.id)) + 1,
      name: `${campaign.name} (Cópia)`,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sent_at: undefined,
      completed_at: undefined,
      analytics: undefined,
    };
    setCampaigns(prev => [newCampaign, ...prev]);
    toast.success('✅ Campanha duplicada com sucesso!');
  };

  const handlePause = (campaign: Campaign): void => {
    setCampaigns(prev => prev.map(c => 
      c.id === campaign.id ? { ...c, status: 'paused' as CampaignStatus } : c
    ));
    toast.success('⏸️ Campanha pausada!');
  };

  const handleResume = (campaign: Campaign): void => {
    setCampaigns(prev => prev.map(c => 
      c.id === campaign.id ? { ...c, status: 'sending' as CampaignStatus } : c
    ));
    toast.success('▶️ Campanha retomada!');
  };

  const handleSend = (campaign: Campaign): void => {
    setCampaigns(prev => prev.map(c => 
      c.id === campaign.id 
        ? { 
            ...c, 
            status: 'sending' as CampaignStatus,
            sent_at: new Date().toISOString() 
          } 
        : c
    ));
    toast.success('🚀 Campanha enviada!');
  };

  const handleViewAnalytics = (campaign: Campaign): void => {
    toast.success(`📊 Abrindo analytics de "${campaign.name}"`);
    // TODO: Implementar modal/página de analytics
  };

  const handleChangeStatus = (id: number, _fromStatus: string, toStatus: string): void => {
    setCampaigns(prev => prev.map(c => 
      c.id === id ? { ...c, status: toStatus as CampaignStatus } : c
    ));
    toast.success('✅ Status atualizado!');
  };

  const handleExport = (): void => {
    // Simular exportação
    const csv = convertToCSV(filteredCampaigns);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campanhas_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('✅ CSV exportado com sucesso!');
  };

  const handleRefresh = (): void => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('🔄 Dados atualizados!');
    }, 1000);
  };

  const handleClearFilters = (): void => {
    setFilters({
      search: '',
      status: 'all',
      type: 'all',
      dateFrom: '',
      dateTo: '',
    });
  };

  // ============================================
  // HELPERS
  // ============================================

  const convertToCSV = (data: Campaign[]): string => {
    const headers = ['ID', 'Nome', 'Tipo', 'Status', 'Audiência', 'Criada Em'];
    const rows = data.map(c => [
      c.id,
      c.name,
      c.type,
      c.status,
      c.audience_count,
      new Date(c.created_at).toLocaleDateString('pt-BR'),
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  // ============================================
  // LOADING STATE
  // ============================================
  
  if (isLoading && campaigns.length === 0) {
    return (
      <LoadingState 
        message="Carregando campanhas..."
        icon={<Send size={48} className="text-blue-600" />}
      />
    );
  }

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <PageModel>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Campanhas de Comunicação
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Send size={16} />
              Gerencie suas campanhas multicanal de forma profissional
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-semibold shadow-sm hover:shadow transition-all"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Exportar</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <CampaignStats stats={stats} loading={false} />

      {/* Filters */}
      <CampaignFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClear={handleClearFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewCampaign={() => setShowWizard(true)}
        onExport={handleExport}
        onRefresh={handleRefresh}
        hasActiveFilters={hasActiveFilters}
        isExporting={false}
        isRefreshing={isLoading}
      />

      {/* Views */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' && (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CampaignGridView
              campaigns={filteredCampaigns}
              onEdit={handleEdit}
              onDelete={setCampaignToDelete}
              onViewAnalytics={handleViewAnalytics}
              onDuplicate={handleDuplicate}
              onPause={handlePause}
              onResume={handleResume}
              onSend={handleSend}
              loading={false}
            />
          </motion.div>
        )}

        {viewMode === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CampaignListView
              campaigns={filteredCampaigns}
              onEdit={handleEdit}
              onDelete={setCampaignToDelete}
              onViewAnalytics={handleViewAnalytics}
              onDuplicate={handleDuplicate}
              onPause={handlePause}
              onResume={handleResume}
              onSend={handleSend}
              loading={false}
            />
          </motion.div>
        )}

        {viewMode === 'kanban' && (
          <motion.div
            key="kanban"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CampaignKanbanView
              campaigns={filteredCampaigns}
              onCampaignClick={handleEdit}
              onChangeStatus={handleChangeStatus}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Info */}
      {filteredCampaigns.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6"
        >
          <p className="text-gray-700 font-semibold">
            Mostrando <span className="text-blue-600 font-bold">{filteredCampaigns.length}</span> de{' '}
            <span className="text-blue-600 font-bold">{stats.total}</span> campanhas
            {hasActiveFilters && (
              <span className="text-gray-600 text-sm ml-2">(filtrado)</span>
            )}
          </p>
        </motion.div>
      )}

      {/* Wizard Modal (placeholder) */}
      {showWizard && (
        <FormModal
          isOpen={showWizard}
          title={editingCampaign ? '✏️ Editar Campanha' : '➕ Nova Campanha'}
          subtitle={editingCampaign ? 'Atualize as informações da campanha' : 'Crie uma nova campanha passo a passo'}
          onClose={() => {
            setShowWizard(false);
            setEditingCampaign(null);
          }}
          size="xl"
        >
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="text-blue-600" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Wizard em Desenvolvimento
            </h3>
            <p className="text-gray-600 mb-6">
              O wizard de criação de campanhas será implementado nos próximos passos.
            </p>
            <button
              onClick={() => {
                setShowWizard(false);
                setEditingCampaign(null);
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
            >
              Entendido
            </button>
          </div>
        </FormModal>
      )}

      {/* Delete Confirmation */}
      {campaignToDelete && (
        <ConfirmDialog
          isOpen={!!campaignToDelete}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja deletar a campanha "${campaignToDelete.name}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Deletar"
          cancelLabel="Cancelar"
          onConfirm={handleDelete}
          onCancel={() => setCampaignToDelete(null)}
          isLoading={false}
          variant="danger"
        />
      )}
    </PageModel>
  );
}