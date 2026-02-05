// src/pages/Campaigns/index.tsx
// 📢 PÁGINA PRINCIPAL DE CAMPANHAS - REFATORADA
// Listagem de todas as campanhas com filtros, stats e múltiplas visualizações

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Megaphone, 
  TrendingUp,
  Send,
  Clock,
  CheckCircle2,
  Grid3x3,
  List as ListIcon,
  LayoutGrid,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Componentes Reutilizáveis
import { StatCard, PageFilters } from '../../components/common';

// Componentes Locais
import CampaignStats from './components/CampaignStats';
import CampaignFilters, { type CampaignViewMode } from './components/CampaignFilters';
import CampaignGridView from './components/CampaignGridView';
import CampaignListView from './components/CampaignListView';
import CampaignKanbanView from './components/CampaignKanbanView';
import CreateCampaignModal from './components/CreateCampaignModal';

// Types e dados mockados
import type { Campaign, CampaignType, CampaignStatus } from '../../types/campaigns/campaign.types';
import { MOCK_CAMPAIGNS } from './utils/campaignConfig';
import PageModel from '../../components/layout/PageModel';
import { ListPageHeader } from '../../components/layout/PageHeader';

// ============================================
// TYPES
// ============================================

type ViewMode = 'grid' | 'list' | 'kanban';

// ============================================
// MAIN COMPONENT
// ============================================

export default function CampaignsPage() {
  const navigate = useNavigate();

  // ============================================
  // STATE
  // ============================================
  
  const [campaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<CampaignType | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);

  // ============================================
  // COMPUTED STATS
  // ============================================
  
  const stats = useMemo(() => {
    const total = campaigns.length;
    const active = campaigns.filter(c => c.status === 'sending' || c.status === 'scheduled').length;
    const completed = campaigns.filter(c => c.status === 'completed').length;
    const totalSent = campaigns.reduce((sum, c) => sum + (c.analytics?.messages_sent || 0), 0);
    
    // Calcula taxa média de conversão
    const campaignsWithConversion = campaigns.filter(c => c.analytics?.conversion_rate);
    const avgConversion = campaignsWithConversion.length > 0
      ? campaignsWithConversion.reduce((sum, c) => sum + (c.analytics?.conversion_rate || 0), 0) / campaignsWithConversion.length
      : 0;

    return {
      total,
      active,
      completed,
      totalSent,
      avgConversion,
    };
  }, [campaigns]);

  // ============================================
  // FILTERED DATA
  // ============================================
  
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      // Filtro de busca
      const matchesSearch = searchTerm === '' ||
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filtro de status
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;

      // Filtro de tipo
      const matchesType = typeFilter === 'all' || campaign.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [campaigns, searchTerm, statusFilter, typeFilter]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleNewCampaign = () => {
    setShowCreateModal(true);
  };

  const handleViewCampaign = (campaign: Campaign) => {
    navigate(`/campanha/${campaign.id}`);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    toast.success(`✏️ Editar campanha: ${campaign.name}`);
    // TODO: Implementar modal de edição
  };

  const handleDeleteCampaign = (campaign: Campaign) => {
    if (window.confirm(`Tem certeza que deseja excluir a campanha "${campaign.name}"?`)) {
      toast.success('✅ Campanha excluída!');
      // TODO: Implementar delete
    }
  };

  const handlePauseCampaign = (campaign: Campaign) => {
    toast.success(`⏸️ Campanha pausada: ${campaign.name}`);
    // TODO: Implementar pause
  };

  const handleResumeCampaign = (campaign: Campaign) => {
    toast.success(`▶️ Campanha retomada: ${campaign.name}`);
    // TODO: Implementar resume
  };

  const handleDuplicateCampaign = (campaign: Campaign) => {
    toast.success(`📋 Campanha duplicada: ${campaign.name}`);
    // TODO: Implementar duplicate
  };

  const handleRefresh = () => {
    toast.success('🔄 Campanhas atualizadas!');
  };

  const handleExport = () => {
    toast.success('📥 Exportando campanhas...');
  };

  const hasActiveFilters = statusFilter !== 'all' || typeFilter !== 'all';

  const handleClearFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setSearchTerm('');
  };

  function setShowModal(arg0: boolean): void {
    throw new Error('Function not implemented.');
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <PageModel>
      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}
      
      <ListPageHeader
        title="Campanhas"
        subtitle="Gerencie suas campanhas de marketing"
        icon={<Megaphone size={16} />}
        onRefresh={handleRefresh}
        onNew={() => setShowModal(true)}
        isRefreshing={false}
        // isRefreshing={isLoading}
        newLabel="Nova Campanha"
      />

      {/* ========================================== */}
      {/* STATS CARDS */}
      {/* ========================================== */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          label="Total de Campanhas"
          value={stats.total}
          icon={<Megaphone size={24} className="text-blue-600" />}
          color="blue"
          subtitle="Todas as campanhas"
        />

        <StatCard
          label="Campanhas Ativas"
          value={stats.active}
          icon={<Send size={24} className="text-green-600" />}
          color="green"
          subtitle="Em execução"
        />

        <StatCard
          label="Concluídas"
          value={stats.completed}
          icon={<CheckCircle2 size={24} className="text-purple-600" />}
          color="purple"
          subtitle="Finalizadas"
        />

        <StatCard
          label="Taxa de Conversão"
          value={`${stats.avgConversion.toFixed(1)}%`}
          icon={<TrendingUp size={24} className="text-orange-600" />}
          color="orange"
          subtitle="Média geral"
        />
      </div>

      {/* ========================================== */}
      {/* FILTERS */}
      {/* ========================================== */}
      
      <PageFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar campanhas por nome, descrição ou tags..."
        
        viewMode={viewMode}
        viewModes={[
          { value: 'grid', icon: <Grid3x3 size={18} />, label: 'Grade' },
          { value: 'list', icon: <ListIcon size={18} />, label: 'Lista' },
          { value: 'kanban', icon: <LayoutGrid size={18} />, label: 'Kanban' },
        ]}
        onViewModeChange={(mode) => setViewMode(mode as ViewMode)}
        
        onNew={handleNewCampaign}
        newLabel="Nova Campanha"
        
        onExport={handleExport}
        onRefresh={handleRefresh}
        
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
        
        advancedFilters={
          <CampaignFilters
            statusFilter={statusFilter}
            typeFilter={typeFilter}
            onStatusChange={setStatusFilter}
            onTypeChange={setTypeFilter}
          />
        }
      />

      {/* ========================================== */}
      {/* RESULTS INFO */}
      {/* ========================================== */}
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Mostrando <span className="font-semibold text-gray-900">{filteredCampaigns.length}</span> de{' '}
          <span className="font-semibold text-gray-900">{campaigns.length}</span> campanhas
        </p>
      </div>

      {/* ========================================== */}
      {/* CONTENT - DIFERENTES VIEWS */}
      {/* ========================================== */}
      
      {viewMode === 'grid' && (
        <CampaignGridView
          campaigns={filteredCampaigns}
          onView={handleViewCampaign}
          onEdit={handleEditCampaign}
          onDelete={handleDeleteCampaign}
          onPause={handlePauseCampaign}
          onResume={handleResumeCampaign}
          onDuplicate={handleDuplicateCampaign}
        />
      )}

      {viewMode === 'list' && (
        <CampaignListView
          campaigns={filteredCampaigns}
          onView={handleViewCampaign}
          onEdit={handleEditCampaign}
          onDelete={handleDeleteCampaign}
          onPause={handlePauseCampaign}
          onResume={handleResumeCampaign}
          onDuplicate={handleDuplicateCampaign}
        />
      )}

      {viewMode === 'kanban' && (
        <CampaignKanbanView
          campaigns={filteredCampaigns}
          onView={handleViewCampaign}
          onEdit={handleEditCampaign}
          onDelete={handleDeleteCampaign}
          onPause={handlePauseCampaign}
          onResume={handleResumeCampaign}
          onDuplicate={handleDuplicateCampaign}
        />
      )}

      {/* ========================================== */}
      {/* MODALS */}
      {/* ========================================== */}
      
      {showCreateModal && (
        <CreateCampaignModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={(newCampaign) => {
            setShowCreateModal(false);
            toast.success('✅ Campanha criada com sucesso!');
            // TODO: Adicionar campanha à lista
          }}
        />
      )}
      </PageModel>
    </div>
  );
}