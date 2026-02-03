// src/pages/Campaigns/index.tsx
// Exemplo de uso correto dos componentes

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import CampaignStats from './components/CampaignStats';
import CampaignCard from './components/CampaignCard';
import type {  Campaign, CampaignStats as StatsType } from '../../types/campaigns/campaign.types';

// Dados de exemplo (mock)
const mockStats: StatsType = {
  total: 45,
  draft: 8,
  scheduled: 12,
  sending: 3,
  completed: 20,
  paused: 1,
  cancelled: 1,
  failed: 0,
  avg_delivery_rate: 94.5,
  avg_open_rate: 67.3,
  avg_conversion_rate: 23.8,
  sent_today: 156,
};

const mockCampaigns: Campaign[] = [
  {
    id: 1,
    school: 1,
    school_name: 'Colégio Exemplo',
    name: 'Campanha de Matrícula 2026',
    type: 'matricula',
    description: 'Campanha para captação de novos alunos para o ano letivo de 2026',
    tags: ['matricula', '2026', 'captacao'],
    audience_count: 1250,
    channels: ['whatsapp', 'email'],
    schedule_type: 'scheduled',
    scheduled_at: '2026-02-15T09:00:00Z',
    status: 'scheduled',
    created_at: '2026-02-01T10:00:00Z',
    updated_at: '2026-02-01T10:00:00Z',
    analytics: {
      total_recipients: 1250,
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
    },
  },
  {
    id: 2,
    school: 1,
    school_name: 'Colégio Exemplo',
    name: 'Lembrete de Rematrícula',
    type: 'rematricula',
    description: 'Lembrete para pais sobre o período de rematrícula',
    tags: ['rematricula', 'urgente'],
    audience_count: 850,
    channels: ['whatsapp'],
    schedule_type: 'immediate',
    status: 'sending',
    created_at: '2026-02-03T08:00:00Z',
    updated_at: '2026-02-03T08:30:00Z',
    sent_at: '2026-02-03T08:30:00Z',
    analytics: {
      total_recipients: 850,
      messages_sent: 620,
      messages_delivered: 615,
      messages_failed: 5,
      messages_opened: 450,
      messages_clicked: 230,
      messages_responded: 120,
      conversions: 85,
      delivery_rate: 99.2,
      open_rate: 73.2,
      click_rate: 37.1,
      response_rate: 19.4,
      conversion_rate: 13.7,
    },
  },
  {
    id: 3,
    school: 1,
    school_name: 'Colégio Exemplo',
    name: 'Comunicado: Reunião de Pais',
    type: 'reuniao',
    description: 'Convite para reunião de pais e mestres do 1º trimestre',
    tags: ['reuniao', 'pais'],
    audience_count: 320,
    channels: ['email', 'whatsapp'],
    schedule_type: 'scheduled',
    scheduled_at: '2026-02-10T14:00:00Z',
    status: 'scheduled',
    created_at: '2026-02-02T15:00:00Z',
    updated_at: '2026-02-02T15:00:00Z',
  },
  {
    id: 4,
    school: 1,
    school_name: 'Colégio Exemplo',
    name: 'Festa Junina 2026',
    type: 'evento',
    description: 'Convite para a tradicional festa junina da escola',
    tags: ['evento', 'festa-junina'],
    audience_count: 1500,
    channels: ['whatsapp', 'email'],
    schedule_type: 'scheduled',
    scheduled_at: '2026-05-20T10:00:00Z',
    status: 'draft',
    created_at: '2026-02-01T16:00:00Z',
    updated_at: '2026-02-02T11:00:00Z',
  },
  {
    id: 5,
    school: 1,
    school_name: 'Colégio Exemplo',
    name: 'Campanha Passei Direto',
    type: 'passei_direto',
    description: 'Divulgação da parceria com Passei Direto para alunos',
    tags: ['passei-direto', 'estudos'],
    audience_count: 680,
    channels: ['email'],
    schedule_type: 'immediate',
    status: 'completed',
    created_at: '2026-01-15T09:00:00Z',
    updated_at: '2026-01-15T10:30:00Z',
    sent_at: '2026-01-15T09:15:00Z',
    completed_at: '2026-01-15T10:30:00Z',
    analytics: {
      total_recipients: 680,
      messages_sent: 680,
      messages_delivered: 675,
      messages_failed: 5,
      messages_opened: 520,
      messages_clicked: 340,
      messages_responded: 180,
      conversions: 120,
      delivery_rate: 99.3,
      open_rate: 77.0,
      click_rate: 50.4,
      response_rate: 26.7,
      conversion_rate: 17.8,
    },
  },
];

export default function CampaignsPage() {
  const [loading] = useState(false);
  const [campaigns] = useState<Campaign[]>(mockCampaigns);

  const handleEdit = (campaign: Campaign) => {
    console.log('Editar campanha:', campaign);
    // Implementar lógica de edição
  };

  const handleDelete = (campaign: Campaign) => {
    console.log('Excluir campanha:', campaign);
    // Implementar lógica de exclusão
  };

  const handleDuplicate = (campaign: Campaign) => {
    console.log('Duplicar campanha:', campaign);
    // Implementar lógica de duplicação
  };

  const handlePause = (campaign: Campaign) => {
    console.log('Pausar campanha:', campaign);
    // Implementar lógica de pausar
  };

  const handleResume = (campaign: Campaign) => {
    console.log('Retomar campanha:', campaign);
    // Implementar lógica de retomar
  };

  const handleViewAnalytics = (campaign: Campaign) => {
    console.log('Ver analytics:', campaign);
    // Implementar navegação para analytics
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              📢 Campanhas de Comunicação
            </h1>
            <p className="text-gray-600 mt-1">
              Gerencie suas campanhas de comunicação com pais e responsáveis
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus size={20} />
            Nova Campanha
          </motion.button>
        </div>
      </div>

      {/* Estatísticas */}
      <CampaignStats stats={mockStats} loading={loading} />

      {/* Grid de Campanhas */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Todas as Campanhas ({campaigns.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onPause={handlePause}
            onResume={handleResume}
            onViewAnalytics={handleViewAnalytics}
          />
        ))}
      </div>

      {/* Empty State (quando não houver campanhas) */}
      {campaigns.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center"
        >
          <div className="text-6xl mb-4">📢</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Nenhuma campanha criada ainda
          </h3>
          <p className="text-gray-600 mb-6">
            Comece criando sua primeira campanha de comunicação
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            Criar Primeira Campanha
          </button>
        </motion.div>
      )}
    </div>
  );
}