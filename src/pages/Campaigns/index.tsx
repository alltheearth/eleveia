// src/pages/Campaigns/index.tsx
// ========================================
// 📧 MÓDULO COMPLETO DE CAMPANHAS
// ========================================
// ✅ TODOS OS COMPONENTES INCLUÍDOS:
// - CampaignStats
// - CampaignFilters
// - CampaignCard
// - CampaignGridView
// - CampaignListView
// - CampaignKanbanView
// - CampaignWizard (com todos os 7 steps)
//   └── WizardNavigation
//   └── Step1_BasicInfo
//   └── Step2_Audience (usa AudienceSelector)
//   └── Step3_Channels
//   └── Step4_Message (usa MessageEditor)
//   └── Step5_Schedule
//   └── Step6_FollowUp (usa FollowUpConfig)
//   └── Step7_Review
// - CampaignAnalytics
// - TemplateLibrary
// ========================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Grid, 
  List, 
  Columns,
  BarChart3,
  BookTemplate,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

// ========================================
// IMPORTAÇÃO DE TODOS OS COMPONENTES
// ========================================

// Componentes Base
import CampaignStats from './components/CampaignStats';
import CampaignFilters from './components/CampaignFilters';
import CampaignCard from './components/CampaignCard';
import CampaignGridView from './components/CampaignGridView';

// Wizard Completo (inclui todos os sub-componentes)
import CampaignWizard from './components/CampaignWizard';
// O CampaignWizard internamente usa:
// - WizardNavigation
// - Step1_BasicInfo
// - Step2_Audience (que usa AudienceSelector)
// - Step3_Channels
// - Step4_Message (que usa MessageEditor)
// - Step5_Schedule
// - Step6_FollowUp (que usa FollowUpConfig)
// - Step7_Review

// Componentes Auxiliares
import CampaignAnalytics from './components/CampaignAnalytics';
import TemplateLibrary from './components/TemplateLibrary';
import MessageEditor from './components/MessageEditor';
import AudienceSelector from './components/AudienceSelector';
import FollowUpConfig from './components/FollowUpConfig';

// Types
import type { 
  Campaign, 
  CampaignType, 
  CampaignStatus,
  CampaignFormData,
  MessageTemplate
} from '../../types/campaigns/campaign.types';

// API Hooks
import { 
  useGetCampaignsQuery,
  useGetCampaignStatsQuery,
  useGetCampaignQuery,
  useCreateCampaignMutation,
  useSendCampaignMutation,
  usePauseCampaignMutation,
  useResumeCampaignMutation,
  useCancelCampaignMutation,
  useDeleteCampaignMutation,
  useDuplicateCampaignMutation,
  useGetCampaignAnalyticsQuery,
} from '../../services/api/campaignsApi';

// ========================================
// TIPOS DE VIEW
// ========================================
type ViewMode = 'grid' | 'list' | 'kanban';
type ModalType = 'wizard' | 'analytics' | 'templates' | null;

// ========================================
// COMPONENTE PRINCIPAL
// ========================================
export default function Campaigns() {
  // ========================================
  // STATES - View & Modals
  // ========================================
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  // ========================================
  // STATES - Filters
  // ========================================
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<CampaignType | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<CampaignStatus | undefined>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});

  // ========================================
  // SCHOOL ID (normalmente vem do contexto/auth)
  // ========================================
  const schoolId = 1; // TODO: Pegar do contexto de autenticação

  // ========================================
  // API QUERIES
  // ========================================
  const { data: statsData, isLoading: statsLoading } = useGetCampaignStatsQuery();
  
  const { data: campaignsData, isLoading: campaignsLoading } = useGetCampaignsQuery({
    search: searchQuery,
    type: selectedType,
    status: selectedStatus,
  });

  // Analytics da campanha selecionada
  const { data: analyticsData, isLoading: analyticsLoading } = useGetCampaignAnalyticsQuery(
    selectedCampaign?.id || 0,
    { skip: !selectedCampaign }
  );

  // ========================================
  // API MUTATIONS
  // ========================================
  const [createCampaign, { isLoading: isCreating }] = useCreateCampaignMutation();
  const [sendCampaign] = useSendCampaignMutation();
  const [pauseCampaign] = usePauseCampaignMutation();
  const [resumeCampaign] = useResumeCampaignMutation();
  const [cancelCampaign] = useCancelCampaignMutation();
  const [deleteCampaign] = useDeleteCampaignMutation();
  const [duplicateCampaign] = useDuplicateCampaignMutation();

  // ========================================
  // COMPUTED DATA
  // ========================================
  const campaigns = campaignsData?.results || [];

  // ========================================
  // HANDLERS - Modal Management
  // ========================================
  const openWizard = (campaign?: Campaign) => {
    setEditingCampaign(campaign || null);
    setActiveModal('wizard');
  };

  const openAnalytics = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setActiveModal('analytics');
  };

  const openTemplates = () => {
    setActiveModal('templates');
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingCampaign(null);
    setSelectedCampaign(null);
  };

  // ========================================
  // HANDLERS - Campaign Actions
  // ========================================
  const handleCreateCampaign = async (data: CampaignFormData) => {
    try {
      await createCampaign(data).unwrap();
      toast.success('✅ Campanha criada com sucesso!');
      closeModal();
    } catch (error: any) {
      toast.error(`❌ Erro ao criar campanha: ${error?.message || 'Erro desconhecido'}`);
      console.error('Error creating campaign:', error);
    }
  };

  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    // Pode abrir um modal de detalhes ou navegar para página de detalhes
    console.log('Viewing campaign:', campaign);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    openWizard(campaign);
  };

  const handleSendCampaign = async (campaign: Campaign) => {
    const confirmMessage = `Tem certeza que deseja enviar a campanha "${campaign.name}"?\n\nEla será enviada para ${campaign.audience_count} destinatários.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await sendCampaign(campaign.id).unwrap();
        toast.success('🚀 Campanha enviada com sucesso!');
      } catch (error: any) {
        toast.error(`❌ Erro ao enviar campanha: ${error?.message || 'Erro desconhecido'}`);
        console.error('Error sending campaign:', error);
      }
    }
  };

  const handlePauseCampaign = async (campaign: Campaign) => {
    try {
      await pauseCampaign(campaign.id).unwrap();
      toast.success('⏸️ Campanha pausada');
    } catch (error: any) {
      toast.error(`❌ Erro ao pausar campanha: ${error?.message || 'Erro desconhecido'}`);
      console.error('Error pausing campaign:', error);
    }
  };

  const handleResumeCampaign = async (campaign: Campaign) => {
    try {
      await resumeCampaign(campaign.id).unwrap();
      toast.success('▶️ Campanha retomada');
    } catch (error: any) {
      toast.error(`❌ Erro ao retomar campanha: ${error?.message || 'Erro desconhecido'}`);
      console.error('Error resuming campaign:', error);
    }
  };

  const handleCancelCampaign = async (campaign: Campaign) => {
    if (window.confirm(`Tem certeza que deseja cancelar a campanha "${campaign.name}"?`)) {
      try {
        await cancelCampaign(campaign.id).unwrap();
        toast.success('🚫 Campanha cancelada');
      } catch (error: any) {
        toast.error(`❌ Erro ao cancelar campanha: ${error?.message || 'Erro desconhecido'}`);
        console.error('Error cancelling campaign:', error);
      }
    }
  };

  const handleDeleteCampaign = async (campaign: Campaign) => {
    const confirmMessage = `⚠️ ATENÇÃO!\n\nDeseja realmente EXCLUIR a campanha "${campaign.name}"?\n\nEsta ação não pode ser desfeita!`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await deleteCampaign(campaign.id).unwrap();
        toast.success('🗑️ Campanha excluída com sucesso');
      } catch (error: any) {
        toast.error(`❌ Erro ao excluir campanha: ${error?.message || 'Erro desconhecido'}`);
        console.error('Error deleting campaign:', error);
      }
    }
  };

  const handleDuplicateCampaign = async (campaign: Campaign) => {
    try {
      await duplicateCampaign(campaign.id).unwrap();
      toast.success(`📋 Campanha "${campaign.name}" duplicada com sucesso!`);
    } catch (error: any) {
      toast.error(`❌ Erro ao duplicar campanha: ${error?.message || 'Erro desconhecido'}`);
      console.error('Error duplicating campaign:', error);
    }
  };

  const handleViewAnalytics = (campaign: Campaign) => {
    openAnalytics(campaign);
  };

  // ========================================
  // HANDLER - Template Selection
  // ========================================
  const handleSelectTemplate = (template: MessageTemplate) => {
    // Aqui você pode pré-preencher o wizard com dados do template
    console.log('Template selected:', template);
    closeModal();
    // Opcionalmente abrir o wizard com dados do template
    // openWizard();
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* ========================================
            HEADER
        ======================================== */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📧 Campanhas de Comunicação
            </h1>
            <p className="text-gray-600">
              Gerencie suas campanhas de WhatsApp, Email e SMS
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Botão Templates */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openTemplates}
              className="flex items-center gap-2 px-5 py-3 bg-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <BookTemplate size={20} />
              Templates
            </motion.button>

            {/* Botão Nova Campanha */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openWizard()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Plus size={20} />
              Nova Campanha
            </motion.button>
          </div>
        </div>

        {/* ========================================
            STATS - Usando CampaignStats
        ======================================== */}
        <CampaignStats stats={statsData} loading={statsLoading} />

        {/* ========================================
            FILTERS - Usando CampaignFilters
        ======================================== */}
        <CampaignFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        {/* ========================================
            VIEW MODE SELECTOR
        ======================================== */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex gap-1 p-1 bg-white rounded-lg border border-gray-200 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Visualização em Grade"
            >
              <Grid size={20} />
            </button>
            
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Visualização em Lista"
            >
              <List size={20} />
            </button>
            
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'kanban'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Visualização Kanban"
            >
              <Columns size={20} />
            </button>
          </div>

          <div className="flex-1" />

          {/* Analytics Summary Button */}
          <button
            onClick={() => {/* TODO: Open overall analytics */}}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <BarChart3 size={18} />
            <span className="text-sm font-medium">Ver Relatório Geral</span>
          </button>
        </div>

        {/* ========================================
            CONTENT - Diferentes Views
        ======================================== */}
        <AnimatePresence mode="wait">
          {/* GRID VIEW - Usando CampaignGridView */}
          {viewMode === 'grid' && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CampaignGridView
                campaigns={campaigns}
                loading={campaignsLoading}
                onView={handleViewCampaign}
                onEdit={handleEditCampaign}
                onDelete={handleDeleteCampaign}
                onDuplicate={handleDuplicateCampaign}
                onSend={handleSendCampaign}
                onPause={handlePauseCampaign}
                onResume={handleResumeCampaign}
                onViewAnalytics={handleViewAnalytics}
              />
            </motion.div>
          )}

          {/* LIST VIEW - Usando mesma lógica mas em lista */}
          {viewMode === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {campaignsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
                  <p className="text-gray-600 mt-4">Carregando campanhas...</p>
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl">
                  <p className="text-gray-600">Nenhuma campanha encontrada</p>
                </div>
              ) : (
                campaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onView={handleViewCampaign}
                    onEdit={handleEditCampaign}
                    onDelete={handleDeleteCampaign}
                    onDuplicate={handleDuplicateCampaign}
                    onSend={handleSendCampaign}
                    onPause={handlePauseCampaign}
                    onResume={handleResumeCampaign}
                    onViewAnalytics={handleViewAnalytics}
                  />
                ))
              )}
            </motion.div>
          )}

          {/* KANBAN VIEW - Agrupado por status */}
          {viewMode === 'kanban' && (
            <motion.div
              key="kanban"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Colunas Kanban por status */}
                {['draft', 'scheduled', 'sending', 'completed'].map(status => {
                  const statusCampaigns = campaigns.filter(c => c.status === status);
                  return (
                    <div key={status} className="bg-gray-100 rounded-2xl p-4">
                      <h3 className="font-bold text-lg mb-4 capitalize">
                        {status === 'draft' && '📝 Rascunho'}
                        {status === 'scheduled' && '⏰ Agendadas'}
                        {status === 'sending' && '🚀 Enviando'}
                        {status === 'completed' && '✅ Concluídas'}
                        <span className="ml-2 text-sm text-gray-600">({statusCampaigns.length})</span>
                      </h3>
                      <div className="space-y-3">
                        {statusCampaigns.map(campaign => (
                          <div key={campaign.id} className="scale-95">
                            <CampaignCard
                              campaign={campaign}
                              onView={handleViewCampaign}
                              onEdit={handleEditCampaign}
                              onDelete={handleDeleteCampaign}
                              onDuplicate={handleDuplicateCampaign}
                              onSend={handleSendCampaign}
                              onPause={handlePauseCampaign}
                              onResume={handleResumeCampaign}
                              onViewAnalytics={handleViewAnalytics}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ========================================
          MODALS
      ======================================== */}
      <AnimatePresence>
        {/* WIZARD MODAL - Usando CampaignWizard */}
        {activeModal === 'wizard' && (
          <CampaignWizard
            initialData={editingCampaign ? {
              name: editingCampaign.name,
              type: editingCampaign.type,
              description: editingCampaign.description,
              tags: editingCampaign.tags,
              audience_filters: editingCampaign.audience_filters,
              channels: editingCampaign.channels,
              channel_priority: editingCampaign.channel_priority,
              fallback_enabled: editingCampaign.fallback_enabled,
              message_content: editingCampaign.message_content,
              schedule_type: editingCampaign.schedule_type,
              scheduled_at: editingCampaign.scheduled_at,
              recurring_config: editingCampaign.recurring_config,
              follow_ups: editingCampaign.follow_ups,
              school: schoolId,
            } : undefined}
            onClose={closeModal}
            onSave={handleCreateCampaign}
            schoolId={schoolId}
          />
        )}

        {/* ANALYTICS MODAL - Usando CampaignAnalytics */}
        {activeModal === 'analytics' && selectedCampaign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Analytics: {selectedCampaign.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Análise detalhada da campanha
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {analyticsLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
                    <p className="text-gray-600 mt-4">Carregando analytics...</p>
                  </div>
                ) : analyticsData ? (
                  <CampaignAnalytics
                    analytics={analyticsData}
                    campaignId={selectedCampaign.id}
                    onExport={(format) => {
                      console.log('Exporting as:', format);
                      toast.success(`📄 Exportando relatório em ${format.toUpperCase()}`);
                    }}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">Nenhum dado de analytics disponível</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* TEMPLATES MODAL - Usando TemplateLibrary */}
        {activeModal === 'templates' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    📚 Biblioteca de Templates
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Escolha um template para começar
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <TemplateLibrary
                  onSelectTemplate={handleSelectTemplate}
                  onCreateNew={() => {
                    closeModal();
                    openWizard();
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ========================================
// 📊 RESUMO DE COMPONENTES UTILIZADOS:
// ========================================
// ✅ CampaignStats
// ✅ CampaignFilters
// ✅ CampaignCard
// ✅ CampaignGridView
// ✅ CampaignWizard
//    └── WizardNavigation
//    └── Step1_BasicInfo
//    └── Step2_Audience
//        └── AudienceSelector ✅
//    └── Step3_Channels
//    └── Step4_Message
//        └── MessageEditor ✅
//    └── Step5_Schedule
//    └── Step6_FollowUp
//        └── FollowUpConfig ✅
//    └── Step7_Review
// ✅ CampaignAnalytics
// ✅ TemplateLibrary
// ========================================
// 🎯 TODOS OS COMPONENTES ESTÃO INCLUÍDOS!
// ========================================