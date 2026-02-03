// src/pages/Campaigns/index.tsx
// 📢 PÁGINA DE CAMPANHAS - DESIGN PROFISSIONAL E COERENTE

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, RefreshCw, Download } from 'lucide-react';
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
import CampaignFilters, { type CampaignViewMode } from './components/CampaignFilters';
import CampaignGridView from './components/CampaignGridView';
import CampaignListView from './components/CampaignListView';
import CampaignKanbanView from './components/CampaignKanbanView';

// Types
import type { Campaign, CampaignType, CampaignStatus } from '../../types/campaigns/campaign.types';

interface CampaignFormData {
  name: string;
  type: CampaignType;
  description: string;
  channels: string[];
  audience_count: number;
  scheduled_at?: string;
}

// ============================================
// DADOS MOCADOS
// ============================================

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    school: 1,
    school_name: 'Escola ABC',
    name: 'Matrícula 2026 - Campanha Principal',
    type: 'matricula',
    description: 'Campanha principal de captação de novos alunos para 2026',
    tags: ['matricula', 'captacao', '2026'],
    audience_count: 450,
    channels: ['whatsapp', 'email'],
    status: 'scheduled',
    created_at: '2026-01-20T10:00:00',
    updated_at: '2026-01-30T14:00:00',
    scheduled_at: '2026-02-05T09:00:00',
    analytics: {
      total_recipients: 450,
      messages_sent: 0,
      messages_delivered: 0,
      messages_failed: 0,
      messages_opened: 0,
      messages_clicked: 0,
      messages_responded: 0,
      conversions: 0,
      delivery_rate: 0,
      open_rate: 0,
      click_rate: 0,
      response_rate: 0,
      conversion_rate: 0,
      by_channel: {},
      timeline: [],
    },
  },
  {
    id: 2,
    school: 1,
    school_name: 'Escola ABC',
    name: 'Rematrícula - Lembrete Final',
    type: 'rematricula',
    description: 'Lembrete final para pais que ainda não renovaram matrícula',
    tags: ['rematricula', 'urgente'],
    audience_count: 120,
    channels: ['whatsapp', 'sms'],
    status: 'sending',
    created_at: '2026-01-25T08:00:00',
    updated_at: '2026-02-03T10:30:00',
    sent_at: '2026-02-03T10:30:00',
    analytics: {
      total_recipients: 120,
      messages_sent: 85,
      messages_delivered: 82,
      messages_failed: 3,
      messages_opened: 65,
      messages_clicked: 28,
      messages_responded: 15,
      conversions: 8,
      delivery_rate: 96.5,
      open_rate: 79.3,
      click_rate: 43.1,
      response_rate: 23.1,
      conversion_rate: 12.3,
      by_channel: {
        whatsapp: {
          sent: 60,
          delivered: 58,
          failed: 2,
          opened: 45,
          clicked: 20,
          responded: 12,
        },
        sms: {
          sent: 25,
          delivered: 24,
          failed: 1,
          opened: 20,
          clicked: 8,
          responded: 3,
        },
      },
      timeline: [],
    },
  },
  {
    id: 3,
    school: 1,
    school_name: 'Escola ABC',
    name: 'Reunião de Pais - Fevereiro',
    type: 'reuniao',
    description: 'Convite para reunião de pais e mestres do mês de fevereiro',
    tags: ['reuniao', 'pais'],
    audience_count: 280,
    channels: ['email', 'whatsapp'],
    status: 'completed',
    created_at: '2026-01-15T09:00:00',
    updated_at: '2026-01-28T16:00:00',
    sent_at: '2026-01-28T09:00:00',
    completed_at: '2026-01-28T16:00:00',
    analytics: {
      total_recipients: 280,
      messages_sent: 280,
      messages_delivered: 275,
      messages_failed: 5,
      messages_opened: 245,
      messages_clicked: 180,
      messages_responded: 95,
      conversions: 210,
      delivery_rate: 98.2,
      open_rate: 89.1,
      click_rate: 73.5,
      response_rate: 38.8,
      conversion_rate: 85.7,
      by_channel: {
        email: {
          sent: 180,
          delivered: 177,
          failed: 3,
          opened: 155,
          clicked: 110,
          responded: 60,
        },
        whatsapp: {
          sent: 100,
          delivered: 98,
          failed: 2,
          opened: 90,
          clicked: 70,
          responded: 35,
        },
      },
      timeline: [],
    },
  },
  {
    id: 4,
    school: 1,
    school_name: 'Escola ABC',
    name: 'Passei Direto - Vestibular 2026',
    type: 'passei_direto',
    description: 'Divulgação dos aprovados no vestibular de 2026',
    tags: ['passei_direto', 'vestibular'],
    audience_count: 350,
    channels: ['whatsapp', 'email', 'sms'],
    status: 'draft',
    created_at: '2026-02-01T11:00:00',
    updated_at: '2026-02-03T09:00:00',
    analytics: {
      total_recipients: 350,
      messages_sent: 0,
      messages_delivered: 0,
      messages_failed: 0,
      messages_opened: 0,
      messages_clicked: 0,
      messages_responded: 0,
      conversions: 0,
      delivery_rate: 0,
      open_rate: 0,
      click_rate: 0,
      response_rate: 0,
      conversion_rate: 0,
      by_channel: {},
      timeline: [],
    },
  },
  {
    id: 5,
    school: 1,
    school_name: 'Escola ABC',
    name: 'Evento - Feira de Ciências',
    type: 'evento',
    description: 'Convite para a Feira de Ciências anual da escola',
    tags: ['evento', 'feira', 'ciencias'],
    audience_count: 520,
    channels: ['email', 'whatsapp'],
    status: 'scheduled',
    created_at: '2026-01-28T14:00:00',
    updated_at: '2026-02-02T10:00:00',
    scheduled_at: '2026-02-10T08:00:00',
    analytics: {
      total_recipients: 520,
      messages_sent: 0,
      messages_delivered: 0,
      messages_failed: 0,
      messages_opened: 0,
      messages_clicked: 0,
      messages_responded: 0,
      conversions: 0,
      delivery_rate: 0,
      open_rate: 0,
      click_rate: 0,
      response_rate: 0,
      conversion_rate: 0,
      by_channel: {},
      timeline: [],
    },
  },
  {
    id: 6,
    school: 1,
    school_name: 'Escola ABC',
    name: 'Cobrança - Mensalidade Janeiro',
    type: 'cobranca',
    description: 'Lembrete de pagamento da mensalidade de janeiro',
    tags: ['cobranca', 'mensalidade'],
    audience_count: 85,
    channels: ['whatsapp', 'email'],
    status: 'completed',
    created_at: '2026-01-10T08:00:00',
    updated_at: '2026-01-15T18:00:00',
    sent_at: '2026-01-15T09:00:00',
    completed_at: '2026-01-15T18:00:00',
    analytics: {
      total_recipients: 85,
      messages_sent: 85,
      messages_delivered: 84,
      messages_failed: 1,
      messages_opened: 75,
      messages_clicked: 65,
      messages_responded: 50,
      conversions: 72,
      delivery_rate: 98.8,
      open_rate: 89.3,
      click_rate: 86.7,
      response_rate: 66.7,
      conversion_rate: 96.0,
      by_channel: {
        whatsapp: {
          sent: 60,
          delivered: 60,
          failed: 0,
          opened: 55,
          clicked: 48,
          responded: 40,
        },
        email: {
          sent: 25,
          delivered: 24,
          failed: 1,
          opened: 20,
          clicked: 17,
          responded: 10,
        },
      },
      timeline: [],
    },
  },
  {
    id: 7,
    school: 1,
    school_name: 'Escola ABC',
    name: 'Comunicado - Volta às Aulas',
    type: 'comunicado',
    description: 'Informações importantes sobre o retorno das aulas',
    tags: ['comunicado', 'volta_aulas'],
    audience_count: 650,
    channels: ['email', 'whatsapp'],
    status: 'paused',
    created_at: '2026-01-18T10:00:00',
    updated_at: '2026-01-22T15:00:00',
    sent_at: '2026-01-22T09:00:00',
    analytics: {
      total_recipients: 650,
      messages_sent: 320,
      messages_delivered: 315,
      messages_failed: 5,
      messages_opened: 280,
      messages_clicked: 150,
      messages_responded: 45,
      conversions: 0,
      delivery_rate: 98.4,
      open_rate: 88.9,
      click_rate: 47.6,
      response_rate: 14.3,
      conversion_rate: 0,
      by_channel: {
        email: {
          sent: 200,
          delivered: 197,
          failed: 3,
          opened: 175,
          clicked: 95,
          responded: 30,
        },
        whatsapp: {
          sent: 120,
          delivered: 118,
          failed: 2,
          opened: 105,
          clicked: 55,
          responded: 15,
        },
      },
      timeline: [],
    },
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);

  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    type: 'matricula',
    description: '',
    channels: ['whatsapp'],
    audience_count: 0,
  });

  // ============================================
  // COMPUTED
  // ============================================
  
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const matchesSearch =
        searchTerm === '' ||
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (campaign.description && campaign.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
      const matchesType = typeFilter === 'all' || campaign.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [campaigns, searchTerm, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    const allAnalytics = campaigns
      .filter(c => c.analytics)
      .map(c => c.analytics!);

    const avgDelivery = allAnalytics.length > 0
      ? allAnalytics.reduce((sum, a) => sum + a.delivery_rate, 0) / allAnalytics.length
      : 0;

    const avgOpen = allAnalytics.length > 0
      ? allAnalytics.reduce((sum, a) => sum + a.open_rate, 0) / allAnalytics.length
      : 0;

    const avgConversion = allAnalytics.length > 0
      ? allAnalytics.reduce((sum, a) => sum + a.conversion_rate, 0) / allAnalytics.length
      : 0;

    const today = new Date().toISOString().split('T')[0];
    const sentToday = campaigns.filter(c => 
      c.sent_at && c.sent_at.split('T')[0] === today
    ).length;

    return {
      total: campaigns.length,
      draft: campaigns.filter(c => c.status === 'draft').length,
      scheduled: campaigns.filter(c => c.status === 'scheduled').length,
      sending: campaigns.filter(c => c.status === 'sending').length,
      completed: campaigns.filter(c => c.status === 'completed').length,
      paused: campaigns.filter(c => c.status === 'paused').length,
      cancelled: campaigns.filter(c => c.status === 'cancelled').length,
      failed: campaigns.filter(c => c.status === 'failed').length,
      avg_delivery_rate: avgDelivery,
      avg_open_rate: avgOpen,
      avg_conversion_rate: avgConversion,
      sent_today: sentToday,
    };
  }, [campaigns]);

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all' || typeFilter !== 'all';

  // ============================================
  // HANDLERS
  // ============================================
  
  const resetForm = (): void => {
    setFormData({
      name: '',
      type: 'matricula',
      description: '',
      channels: ['whatsapp'],
      audience_count: 0,
    });
    setEditingCampaign(null);
    setShowForm(false);
  };

  const validate = (): string | null => {
    if (!formData.name.trim()) return 'Nome é obrigatório';
    if (formData.name.trim().length < 3) return 'Nome deve ter no mínimo 3 caracteres';
    if (formData.channels.length === 0) return 'Selecione pelo menos um canal';
    if (formData.audience_count <= 0) return 'Audiência deve ser maior que zero';
    return null;
  };

  const handleSubmit = (): void => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    if (editingCampaign) {
      setCampaigns(prev => prev.map(c => 
        c.id === editingCampaign.id 
          ? { 
              ...c, 
              name: formData.name,
              type: formData.type,
              description: formData.description,
              channels: formData.channels as any,
              audience_count: formData.audience_count,
              scheduled_at: formData.scheduled_at,
              updated_at: new Date().toISOString(),
            } 
          : c
      ));
      toast.success('✅ Campanha atualizada com sucesso!');
    } else {
      const newCampaign: Campaign = {
        id: Math.max(...campaigns.map(c => c.id)) + 1,
        school: 1,
        school_name: 'Escola ABC',
        name: formData.name,
        type: formData.type,
        description: formData.description,
        channels: formData.channels as any,
        audience_count: formData.audience_count,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        scheduled_at: formData.scheduled_at,
        analytics: {
          total_recipients: formData.audience_count,
          messages_sent: 0,
          messages_delivered: 0,
          messages_failed: 0,
          messages_opened: 0,
          messages_clicked: 0,
          messages_responded: 0,
          conversions: 0,
          delivery_rate: 0,
          open_rate: 0,
          click_rate: 0,
          response_rate: 0,
          conversion_rate: 0,
          by_channel: {},
          timeline: [],
        },
      };
      setCampaigns(prev => [newCampaign, ...prev]);
      toast.success('✅ Campanha criada com sucesso!');
    }
    resetForm();
  };

  const handleEdit = (campaign: Campaign): void => {
    setFormData({
      name: campaign.name,
      type: campaign.type,
      description: campaign.description || '',
      channels: campaign.channels,
      audience_count: campaign.audience_count,
      scheduled_at: campaign.scheduled_at,
    });
    setEditingCampaign(campaign);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (): void => {
    if (!campaignToDelete) return;
    setCampaigns(prev => prev.filter(c => c.id !== campaignToDelete.id));
    toast.success('✅ Campanha deletada com sucesso!');
    setCampaignToDelete(null);
  };

  const handleStatusChange = (campaign: Campaign, newStatus: CampaignStatus): void => {
    setCampaigns(prev => prev.map(c => 
      c.id === campaign.id ? { ...c, status: newStatus, updated_at: new Date().toISOString() } : c
    ));
    toast.success('✅ Status atualizado!');
  };

  const handleStatusChangeKanban = (id: number, _fromStatus: string, toStatus: string): void => {
    setCampaigns(prev => prev.map(c => 
      c.id === id ? { ...c, status: toStatus as CampaignStatus, updated_at: new Date().toISOString() } : c
    ));
    toast.success('✅ Campanha movida com sucesso!');
  };

  const handlePause = (campaign: Campaign): void => {
    handleStatusChange(campaign, 'paused');
  };

  const handleResume = (campaign: Campaign): void => {
    handleStatusChange(campaign, 'sending');
  };

  const handleSend = (campaign: Campaign): void => {
    handleStatusChange(campaign, 'sending');
    toast.success('🚀 Campanha iniciada!');
  };

  const handleExport = (): void => {
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
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  // ============================================
  // HELPERS
  // ============================================

  const convertToCSV = (data: Campaign[]): string => {
    const headers = ['ID', 'Nome', 'Tipo', 'Status', 'Audiência', 'Canais', 'Criada Em'];
    const rows = data.map(c => [
      c.id,
      c.name,
      c.type,
      c.status,
      c.audience_count,
      c.channels.join('; '),
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
              Gerencie suas campanhas de WhatsApp, Email e SMS
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
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewCampaign={() => setShowForm(true)}
        onExport={handleExport}
        onRefresh={handleRefresh}
        onClearFilters={handleClearFilters}
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
              onStatusChange={handleStatusChange}
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
              onStatusChange={handleStatusChange}
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
              onChangeStatus={handleStatusChangeKanban}
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

      {/* Form Modal */}
      {showForm && (
        <FormModal
          isOpen={showForm}
          title={editingCampaign ? '✏️ Editar Campanha' : '➕ Nova Campanha'}
          subtitle={editingCampaign ? 'Atualize as informações da campanha' : 'Preencha os dados da nova campanha'}
          onClose={resetForm}
          size="lg"
        >
          <CampaignForm
            formData={formData}
            onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            isLoading={false}
            isEditing={!!editingCampaign}
          />
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

// ============================================
// CAMPAIGN FORM COMPONENT
// ============================================

interface CampaignFormProps {
  formData: CampaignFormData;
  onChange: (field: keyof CampaignFormData, value: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

function CampaignForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
}: CampaignFormProps) {
  return (
    <div className="space-y-6">
      
      {/* Nome */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nome da Campanha *
        </label>
        <input
          type="text"
          placeholder="Ex: Matrícula 2026 - Campanha Principal"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
        />
      </div>

      {/* Tipo e Audiência */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tipo de Campanha
          </label>
          <select
            value={formData.type}
            onChange={(e) => onChange('type', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="matricula">🎓 Matrícula</option>
            <option value="rematricula">🔄 Rematrícula</option>
            <option value="passei_direto">🎉 Passei Direto</option>
            <option value="reuniao">📅 Reunião</option>
            <option value="evento">🎊 Evento</option>
            <option value="cobranca">💰 Cobrança</option>
            <option value="comunicado">📢 Comunicado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tamanho da Audiência *
          </label>
          <input
            type="number"
            placeholder="Ex: 450"
            value={formData.audience_count || ''}
            onChange={(e) => onChange('audience_count', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Descrição
        </label>
        <textarea
          placeholder="Descreva o objetivo da campanha..."
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 resize-none"
        />
      </div>

      {/* Canais */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Canais de Comunicação *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(['whatsapp', 'email', 'sms'] as const).map((channel) => (
            <label
              key={channel}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData.channels.includes(channel)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.channels.includes(channel)}
                onChange={(e) => {
                  const newChannels = e.target.checked
                    ? [...formData.channels, channel]
                    : formData.channels.filter(c => c !== channel);
                  onChange('channels', newChannels);
                }}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {channel === 'whatsapp' && '💬 WhatsApp'}
                  {channel === 'email' && '📧 Email'}
                  {channel === 'sms' && '📱 SMS'}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Agendamento */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Agendar Envio (Opcional)
        </label>
        <input
          type="datetime-local"
          value={formData.scheduled_at || ''}
          onChange={(e) => onChange('scheduled_at', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50"
        >
          {isLoading 
            ? (isEditing ? 'Atualizando...' : 'Criando...')
            : (isEditing ? 'Atualizar Campanha' : 'Criar Campanha')
          }
        </button>

        <button
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}