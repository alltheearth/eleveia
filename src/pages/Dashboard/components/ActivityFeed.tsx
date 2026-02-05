// src/pages/Dashboard/components/ActivityFeed.tsx
// 📋 FEED DE ATIVIDADES RECENTES

import { motion } from 'framer-motion';
import { Clock, ExternalLink } from 'lucide-react';

interface Activity {
  id: string;
  type: 'lead' | 'conversion' | 'event' | 'contact';
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  color: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Clock className="text-blue-600" size={20} />
            Atividades Recentes
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Últimas atualizações do sistema
          </p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 hover:underline">
          Ver todas
          <ExternalLink size={14} />
        </button>
      </div>

      {/* Lista de Atividades */}
      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <Clock size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-semibold">
              Nenhuma atividade recente
            </p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              {/* Ícone */}
              <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                {activity.icon}
              </div>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm mb-1">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-600 mb-1 truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} />
                  {activity.time}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer com link */}
      {activities.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button className="w-full text-sm text-center text-gray-600 hover:text-blue-600 font-semibold transition-colors">
            Carregar mais atividades
          </button>
        </div>
      )}
    </motion.div>
  );
}