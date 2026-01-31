// src/pages/Calendar/components/EventListView.tsx
// 📋 VISUALIZAÇÃO EM LISTA PROFISSIONAL

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import EventCard from './EventCard';
import { EmptyState } from '../../../components/common';
import type { Event } from '../../../services';

// ============================================
// TYPES
// ============================================

interface EventListViewProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  loading?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export default function EventListView({
  events,
  onEdit,
  onDelete,
  loading = false,
}: EventListViewProps) {
  
  // ============================================
  // LOADING STATE
  // ============================================
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
          >
            <div className="flex">
              <div className="w-2 bg-gray-200" />
              <div className="flex-1 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="flex gap-4">
                      <div className="h-4 bg-gray-200 rounded w-32" />
                      <div className="h-4 bg-gray-200 rounded w-32" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ============================================
  // EMPTY STATE
  // ============================================
  
  if (events.length === 0) {
    return (
      <EmptyState
        icon={<Calendar className="h-16 w-16 text-gray-400" />}
        title="Nenhum evento encontrado"
        description="Tente ajustar os filtros ou crie um novo evento"
      />
    );
  }

  // ============================================
  // GROUP BY MONTH
  // ============================================
  
  const groupEventsByMonth = () => {
    const groups: Record<string, Event[]> = {};
    
    events.forEach(event => {
      const date = new Date(event.start_date + 'T00:00:00');
      const monthKey = date.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
      });
      
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(event);
    });
    
    return groups;
  };

  const groupedEvents = groupEventsByMonth();
  const monthKeys = Object.keys(groupedEvents).sort((a, b) => {
    const dateA = new Date(groupedEvents[a][0].start_date);
    const dateB = new Date(groupedEvents[b][0].start_date);
    return dateA.getTime() - dateB.getTime();
  });

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-8">
      <AnimatePresence mode="popLayout">
        {monthKeys.map((monthKey, groupIndex) => (
          <motion.div
            key={monthKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
          >
            {/* Month Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <h3 className="text-lg font-bold text-gray-900 capitalize px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                {monthKey}
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>

            {/* Events */}
            <div className="space-y-3">
              {groupedEvents[monthKey].map((event, eventIndex) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: eventIndex * 0.05 }}
                >
                  <EventCard
                    event={event}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    variant="compact"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}