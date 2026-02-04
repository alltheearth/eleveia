// src/pages/Dashboard/components/UpcomingEvents.tsx
// 📅 PRÓXIMOS EVENTOS

import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Event {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  event_type: string;
  description?: string;
}

interface UpcomingEventsProps {
  events: Event[];
}

const EVENT_TYPE_COLORS: Record<string, { bg: string; text: string; emoji: string }> = {
  holiday: { bg: 'bg-red-50', text: 'text-red-700', emoji: '🎉' },
  exam: { bg: 'bg-blue-50', text: 'text-blue-700', emoji: '📝' },
  graduation: { bg: 'bg-purple-50', text: 'text-purple-700', emoji: '🎓' },
  cultural: { bg: 'bg-orange-50', text: 'text-orange-700', emoji: '🎭' },
  meeting: { bg: 'bg-green-50', text: 'text-green-700', emoji: '👥' },
};

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="text-blue-600" size={20} />
            Próximos Eventos
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Agenda da semana
          </p>
        </div>
        <button
          onClick={() => navigate('/calendar')}
          className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 hover:underline"
        >
          Ver todos
          <ExternalLink size={14} />
        </button>
      </div>

      {/* Lista de Eventos */}
      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-semibold">
              Nenhum evento próximo
            </p>
            <button
              onClick={() => navigate('/calendar')}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              Criar novo evento
            </button>
          </div>
        ) : (
          events.map((event, index) => {
            const typeConfig = EVENT_TYPE_COLORS[event.event_type] || EVENT_TYPE_COLORS.meeting;
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate('/calendar')}
                className="p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer group"
              >
                {/* Data e Badge */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 ${typeConfig.bg} rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                      {typeConfig.emoji}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">
                        {formatDate(event.start_date)}
                      </p>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Clock size={10} />
                        {formatTime(event.start_date)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 ${typeConfig.bg} ${typeConfig.text} rounded-full text-xs font-bold`}>
                    {event.event_type}
                  </span>
                </div>

                {/* Título */}
                <h4 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {event.title}
                </h4>

                {/* Descrição */}
                {event.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {events.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => navigate('/calendar')}
            className="w-full text-sm text-center text-gray-600 hover:text-blue-600 font-semibold transition-colors"
          >
            Ver calendário completo
          </button>
        </div>
      )}
    </motion.div>
  );
}