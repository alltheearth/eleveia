// src/pages/Campaigns/index.tsx
// 📢 PÁGINA PRINCIPAL DE CAMPANHAS - COMPLETA E FUNCIONAL

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, RefreshCw, Download } from 'lucide-react';
import toast from 'react-hot-toast';

// Componentes locais
import CampaignStats from './components/CampaignStats';
import CampaignFilters, { type CampaignViewMode } from './components/CampaignFilters';
import CampaignGridView from './components/CampaignGridView';
import CampaignListView from './components/CampaignListView';
import CampaignKanbanView from './components/CampaignKanbanView';

// Types e dados mockados
import type { Campaign, CampaignType, CampaignStatus } from './types/campaign.types';
import { MOCK_CAMPAIGNS, MOCK_STATS } from './utils/campaignConfig';

// ============================================
// MAIN COMPONENT
// ============================================

export default function CampaignsPage() {
  // ============================================
  // STATE
  // ============================================
  
  const [loading] = useState(false);
  const [campaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [stats] = useState(MOCK_STATS);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<CampaignType | 'all'>('all');
  const [viewMode, setViewMode] = useState<CampaignViewMode>('grid');

  // Modal states (para funcionalidades futuras)
  const [showWizard, setShowWizard] = useState(false);

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
    toast.success('🚀 Funcionalidade de criação em desenvolvimento!');
    setShowWizard(true);
    // TODO: Abrir wizard de criação
  };

  const handleView = (campaign: Campaign) => {
    console.log('Ver campanha:', campaign);
    toast.success(`📊 Ver analytics de "${campaign.name}"`);
    // TODO: Navegar para página de analytics
  };

  const handleEdit = (campaign: Campaign) => {
    console.log('Editar campanha:', campaign);
    toast.success(`✏️ Editar "${campaign.name}"`);
    // TODO: Abrir wizard em modo edição
  };

  const handleDelete = (campaign: Campaign) => {
    if (window.confirm(`Tem certeza que deseja excluir a campanha "${campaign.name}"?`)) {
      console.log('Excluir campanha:', campaign);
      toast.success(`🗑️ Campanha "${campaign.name}" excluída!`);
      // TODO: Implementar exclusão
    }
  };

  const handlePause = (campaign: Campaign) => {
    console.log('Pausar campanha:', campaign);
    toast.success(`⏸️ Campanha "${campaign.name}" pausada!`);
    // TODO: Implementar pausa
  };

  const handleResume = (campaign: Campaign) => {
    console.log('Retomar campanha:', campaign);
    toast.success(`▶️ Campanha "${campaign.name}" retomada!`);
    // TODO: Implementar retomada
  };

  const handleDuplicate = (campaign: Campaign) => {
    console.log('Duplicar campanha:', campaign);
    toast.success(`📋 Campanha "${campaign.name}" duplicada!`);
    // TODO: Implementar duplicação
  };

  const handleRefresh = () => {
    toast.success('🔄 Dados atualizados!');
    // TODO: Recarregar dados da API
  };

  const handleExport = () => {
    toast.success('📥 Exportando campanhas...');
    // TODO: Implementar exportação para CSV
  };

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Megaphone className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                Campanhas de Comunicação
              </h1>
              <p className="text-gray-600 mt-1">
                Gerencie suas campanhas de comunicação com pais e responsáveis
              </p>
            </div>
          </div>

          {/* Header actions */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRefresh}
              className="p-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-all shadow-sm"
              title="Atualizar"
            >
              <RefreshCw size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              className="hidden lg:flex items-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-all font-semibold shadow-sm"
            >
              <Download size={18} />
              Exportar
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <CampaignStats stats={stats} loading={loading} />

      {/* Filtros */}
      <CampaignFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewCampaign={handleNewCampaign}
        onExport={handleExport}
        onRefresh={handleRefresh}
        totalResults={filteredCampaigns.length}
      />

      {/* Views */}
      {viewMode === 'grid' && (
        <CampaignGridView
          campaigns={filteredCampaigns}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPause={handlePause}
          onResume={handleResume}
          onDuplicate={handleDuplicate}
          loading={loading}
        />
      )}

      {viewMode === 'list' && (
        <CampaignListView
          campaigns={filteredCampaigns}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPause={handlePause}
          onResume={handleResume}
          onDuplicate={handleDuplicate}
          loading={loading}
        />
      )}

      {viewMode === 'kanban' && (
        <CampaignKanbanView
          campaigns={filteredCampaigns}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPause={handlePause}
          onResume={handleResume}
          onDuplicate={handleDuplicate}
          loading={loading}
        />
      )}

      {/* Wizard Modal Placeholder */}
      {showWizard && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8"
          >
            <h2 className="text-2xl font-bold mb-4">Nova Campanha</h2>
            <p className="text-gray-600 mb-6">
              O Wizard de criação de campanhas está em desenvolvimento.
              <br />
              Em breve você poderá criar campanhas completas em 7 passos simples!
            </p>
            <button
              onClick={() => setShowWizard(false)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold"
            >
              Fechar
            </button>
          </motion.div>
        </div>
      )}

      {/* Footer info */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Desenvolvido com 💙 para facilitar a comunicação escolar
        </p>
      </div>
    </div>
  );
}