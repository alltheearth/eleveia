// =============================================================================
// src/pages/Campaigns/components/CampaignTimeline/index.tsx
// =============================================================================

// 📅 TIMELINE DA CAMPANHA
// Histórico de eventos e ações da campanha

import { motion } from 'framer-motion';
import { 
  Calendar,
  Send,
  Edit2,
  Play,
  Pause,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Campaign } from '../../types/campaign.types';

interface CampaignTimelineProps {
  campaign: Campaign;
}

// Mock events
const MOCK_EVENTS = [
  {
    id: 1,
    type: 'created',
    title: 'Campanha Criada',
    description: 'Campanha criada por João Silva',
    timestamp: '2024-02-01T10:00:00',
    icon: <Calendar className="text-blue-600" size={20} />,
    color: 'bg-blue-100',
  },
  {
    id: 2,
    type: 'edited',
    title: 'Configurações Atualizadas',
    description: 'Público-alvo e conteúdo ajustados',
    timestamp: '2024-02-01T14:30:00',
    icon: <Edit2 className="text-purple-600" size={20} />,
    color: 'bg-purple-100',
  },
  {
    id: 3,
    type: 'scheduled',
    title: 'Envio Agendado',
    description: 'Programado para 02/02/2024 às 09:00',
    timestamp: '2024-02-01T15:00:00',
    icon: <Clock className="text-yellow-600" size={20} />,
    color: 'bg-yellow-100',
  },
  {
    id: 4,
    type: 'started',
    title: 'Envio Iniciado',
    description: 'Campanha começou a enviar mensagens',
    timestamp: '2024-02-02T09:00:00',
    icon: <Send className="text-green-600" size={20} />,
    color: 'bg-green-100',
  },
  {
    id: 5,
    type: 'completed',
    title: 'Campanha Concluída',
    description: 'Todas as mensagens foram enviadas',
    timestamp: '2024-02-02T18:00:00',
    icon: <CheckCircle2 className="text-green-600" size={20} />,
    color: 'bg-green-100',
  },
];

export default function CampaignTimeline({ campaign }: CampaignTimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          📅 Timeline da Campanha
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Histórico completo de eventos e ações
        </p>
      </div>

      <div className="p-6">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

          {/* Events */}
          <div className="space-y-6">
            {MOCK_EVENTS.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex gap-4"
              >
                {/* Icon */}
                <div className={`relative z-10 w-12 h-12 ${event.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  {event.icon}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      <span className="text-xs text-gray-500">
                        {format(new Date(event.timestamp), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
