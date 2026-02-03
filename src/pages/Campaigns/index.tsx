// src/pages/Campaigns/index.tsx

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  LayoutGrid, 
  List, 
  Columns,
  Download,
  Settings
} from 'lucide-react';
import CampaignStats from './components/CampaignStats';
import CampaignFilters from './components/CampaignFilters';
import CampaignGridView from './components/CampaignGridView';
import CampaignListView from './components/CampaignListView';
import { mockCampaigns, mockStats } from './data/mockCampaigns';
import type { Campaign, CampaignFilters as FiltersType, ViewMode } from '../../types/campaigns/campaign.types';

export default function CampaignsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<FiltersType>({
    search: '',
    status: 'all',
    type: 'all',
    channel: 'all',
  });

  // Filter campaigns based on current filters
  const filteredCampaigns = useMemo(() => {
    return mockCampaigns.filter((campaign) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          campaign.name.toLowerCase().includes(searchLower) ||
          campaign.description?.toLowerCase().includes(searchLower) ||
          campaign.tags?.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== 'all' && campaign.status !== filters.status) {
        return false;
      }

      // Type filter
      if (filters.type !== 'all' && campaign.type !== filters.type) {
        return false;
      }

      // Channel filter
      if (filters.channel !== 'all') {
        if (!campaign.channels.includes(filters.channel)) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  const handleView = (campaign: Campaign) => {
    console.log('View campaign:', campaign);
    // TODO: Navigate to campaign details or open modal
  };

  const handleEdit = (campaign: Campaign) => {
    console.log('Edit campaign:', campaign);
    // TODO: Navigate to campaign editor or open modal
  };

  const handleDelete = (campaign: Campaign) => {
    console.log('Delete campaign:', campaign);
    // TODO: Show confirmation dialog and delete
  };

  const handlePause = (campaign: Campaign) => {
    console.log('Pause campaign:', campaign);
    // TODO: Pause campaign
  };

  const handleResume = (campaign: Campaign) => {
    console.log('Resume campaign:', campaign);
    // TODO: Resume campaign
  };

  const handleDuplicate = (campaign: Campaign) => {
    console.log('Duplicate campaign:', campaign);
    // TODO: Duplicate campaign
  };

  const handleCreateCampaign = () => {
    console.log('Create new campaign');
    // TODO: Navigate to campaign wizard or open modal
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                📢 Campanhas de Comunicação
              </h1>
              <p className="text-gray-600">
                Crie, gerencie e monitore suas campanhas automatizadas de comunicação
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                <Download size={20} />
                Exportar
              </button>

              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                <Settings size={20} />
                Configurações
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateCampaign}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
              >
                <Plus size={20} />
                Nova Campanha
              </motion.button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <CampaignStats stats={mockStats} />

        {/* Filters */}
        <CampaignFilters
          filters={filters}
          onFiltersChange={setFilters}
          totalResults={filteredCampaigns.length}
        />

        {/* View Mode Selector */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-white rounded-xl p-1.5 shadow-sm border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LayoutGrid size={18} />
              Grade
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List size={18} />
              Lista
            </button>

            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Columns size={18} />
              Kanban
            </button>
          </div>

          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">
              {filteredCampaigns.length}
            </span>{' '}
            {filteredCampaigns.length === 1 ? 'campanha' : 'campanhas'} encontrada(s)
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'grid' && (
            <CampaignGridView
              campaigns={filteredCampaigns}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPause={handlePause}
              onResume={handleResume}
              onDuplicate={handleDuplicate}
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
            />
          )}

          {viewMode === 'kanban' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Columns className="text-gray-400" size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Visualização Kanban
              </h3>
              <p className="text-gray-600 mb-6">
                A visualização em Kanban está em desenvolvimento e estará disponível em breve.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}