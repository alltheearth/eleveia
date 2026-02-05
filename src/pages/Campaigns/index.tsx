// src/pages/Campaigns/index.tsx
// 📢 PÁGINA PRINCIPAL DE CAMPANHAS - REFATORADA E INTEGRADA COM WIZARD
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

// ✅ WIZARD INTEGRADO
import CampaignWizard from './components/CampaignWizard';
import {mockCampaigns }from './data/mockCampaigns';
// Types e dados mockados
import type { 
  Campaign, 
  CampaignType, 
  CampaignStatus,
  CampaignFormData, // ✅ Type para o wizard
  MessageContent,
  AudienceFilter
} from '../../types/campaigns/campaign.types';
import { MOCK_CAMPAIGNS } from './utils/campaignConfig';
import PageModel from '../../components/layout/PageModel';
import { ListPageHeader } from '../../components/layout/PageHeader';
import TemplateLibrary, { type MessageTemplate } from './components/TemplateLibrary';
import MessageEditor from './components/MessageEditor';
import FollowUpConfig from './components/FollowUpConfig';
import CampaignSettings from './components/CampaignSettings';
import CampaignAnalytics from './components/CampaignAnalytics';
import AudienceSelector from './components/AudienceSelector';

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
  // SCHOOL ID - Ajuste conforme seu projeto
  // ============================================
  
  // Opção 1: Se você tiver um hook useCurrentSchool (recomendado)
  // const { currentSchoolId } = useCurrentSchool();
  
  // Opção 2: Pegar do Redux/Context
  // const currentSchoolId = useSelector((state) => state.auth.currentSchoolId);
  
  // Opção 3: Pegar do localStorage
  // const currentSchoolId = parseInt(localStorage.getItem('currentSchoolId') || '1');
  
  // Opção 4: Hardcoded temporário (para desenvolvimento)
  const currentSchoolId = 1;

  // ============================================
  // STATE
  // ============================================
  
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<CampaignType | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // Modal states
  const [showWizard, setShowWizard] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    setShowWizard(true);
  };

  // ✅ HANDLER PRINCIPAL DO WIZARD
  const handleCreateCampaign = async (data: CampaignFormData) => {
    try {
      console.log('📋 Dados da nova campanha:', data);
      console.log('🎯 Resumo:', {
        nome: data.name,
        tipo: data.type,
        canais: data.channels,
        audiencia: data.audience_filters.length,
        agendamento: data.schedule_type,
        followUps: data.follow_ups.length,
      });
      
      // ============================================
      // TODO: INTEGRAÇÃO COM API REAL
      // ============================================
      
      // Quando tiver a API pronta, descomente e use:
      /*
      const result = await createCampaignMutation(data).unwrap();
      toast.success('✅ Campanha criada com sucesso!');
      setShowWizard(false);
      
      // Opção 1: Redirecionar para detalhes da campanha
      navigate(`/campanha/${result.id}`);
      
      // Opção 2: Atualizar lista e permanecer na página
      setCampaigns(prev => [...prev, result]);
      refetch(); // se estiver usando RTK Query
      */
      
      // ============================================
      // MOCK - SIMULAÇÃO DE CRIAÇÃO (Remover quando API estiver pronta)
      // ============================================
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Criar campanha mock
      const newCampaign: Campaign = {
        id: Date.now(),
        school: data.school,
        school_name: 'Minha Escola',
        
        // Dados do wizard
        name: data.name,
        type: data.type,
        description: data.description,
        tags: data.tags || [],
        
        audience_filters: data.audience_filters,
        audience_count: Math.floor(Math.random() * 500) + 50,
        
        channels: data.channels,
        channel_priority: data.channel_priority,
        fallback_enabled: data.fallback_enabled,
        
        message_template_id: data.message_template_id,
        message_content: data.message_content,
        
        schedule_type: data.schedule_type,
        scheduled_at: data.scheduled_at,
        recurring_config: data.recurring_config,
        
        follow_ups: data.follow_ups,
        
        // Status inicial
        status: data.schedule_type === 'immediate' ? 'sending' : 'scheduled',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        
        // Analytics iniciais
        analytics: {
          total_recipients: Math.floor(Math.random() * 500) + 50,
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
      
      // Adicionar à lista
      setCampaigns(prev => [newCampaign, ...prev]);
      
      // Fechar wizard
      setShowWizard(false);
      
      // Feedback de sucesso
      toast.success('✅ Campanha criada com sucesso!', {
        duration: 4000,
        icon: '🎉',
      });
      
      // Opcional: Navegar para detalhes (quando a página estiver pronta)
      // navigate(`/campanha/${newCampaign.id}`);
      
    } catch (error: any) {
      console.error('❌ Erro ao criar campanha:', error);
      toast.error(`❌ Erro ao criar campanha: ${error.message || 'Erro desconhecido'}`);
      
      // Re-throw para o wizard poder tratar
      throw error;
    }
  };

  const handleViewCampaign = (campaign: Campaign) => {
    navigate(`/campanha/${campaign.id}`);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    toast.success(`✏️ Editar campanha: ${campaign.name}`);
    // TODO: Implementar edição via wizard
    // setEditingCampaign(campaign);
    // setShowWizard(true);
  };

  const handleDeleteCampaign = (campaign: Campaign) => {
    if (window.confirm(`Tem certeza que deseja excluir a campanha "${campaign.name}"?`)) {
      setCampaigns(prev => prev.filter(c => c.id !== campaign.id));
      toast.success('✅ Campanha excluída!');
      // TODO: Implementar delete na API
    }
  };

  const handlePauseCampaign = (campaign: Campaign) => {
    toast.success(`⏸️ Campanha pausada: ${campaign.name}`);
    // TODO: Implementar pause na API
  };

  const handleResumeCampaign = (campaign: Campaign) => {
    toast.success(`▶️ Campanha retomada: ${campaign.name}`);
    // TODO: Implementar resume na API
  };

  const handleDuplicateCampaign = (campaign: Campaign) => {
    const duplicated: Campaign = {
      ...campaign,
      id: Date.now(),
      name: `${campaign.name} (Cópia)`,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setCampaigns(prev => [duplicated, ...prev]);
    toast.success(`📋 Campanha duplicada: ${campaign.name}`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simular refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('🔄 Campanhas atualizadas!');
    }, 1000);
    
    // TODO: Implementar refresh real
    // refetch();
  };

  const handleExport = () => {
    toast.success('📥 Exportando campanhas...');
    
    // TODO: Implementar export
    // Exemplo: gerar CSV ou Excel
    console.log('Exportando:', filteredCampaigns);
  };

  const hasActiveFilters = statusFilter !== 'all' || typeFilter !== 'all';

  const handleClearFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setSearchTerm('');
  };

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
          onNew={handleNewCampaign}
          isRefreshing={isRefreshing}
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
        {/* WIZARD - MODAL DE CRIAÇÃO */}
        {/* ========================================== */}
        
        {showWizard && (
          <CampaignWizard
            isOpen={showWizard}
            onClose={() => setShowWizard(false)}
            onSubmit={handleCreateCampaign}
            currentSchoolId={currentSchoolId}
          />
        )}
        <TemplateLibrary isOpen={false} onClose={function (): void {
          throw new Error('Function not implemented.');
        } } onSelectTemplate={function (template: MessageTemplate): void {
          throw new Error('Function not implemented.');
        } } />

        {/* <MessageEditor value={'ghhjghjgjh'} onChange={function (content: MessageContent): void {
          throw new Error('Function not implemented.');
        } } activeChannels={[]}/> */}
{/* 
      <FollowUpConfig rules={[]} onChange={function (rules: FollowUpRuleType[]): void {
          throw new Error('Function not implemented.');
        } }/> */}

      {/* <CampaignSettings campaign={mockCampaigns[0]} onUpdate={function (updates: Partial<Campaign>): void {
          throw new Error('Function not implemented.');
        } }/>*/}
      {/* <CampaignAnalytics campaign={mockCampaigns[0]}/> */}
      {/* <AudienceSelector value={{
        filters: [],
        manual_contacts: null
      }} onChange={function (value: { filters: AudienceFilter[]; manual_contacts?: number[]; }): void {
        throw new Error('Function not implemented.');
      } } schoolId={0}/> */}
      </PageModel> 
    </div>
  );
}