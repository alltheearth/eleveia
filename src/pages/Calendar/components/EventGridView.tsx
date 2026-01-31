// src/pages/Calendar/components/EventGridView.tsx
// 🎴 VISUALIZAÇÃO EM GRADE PROFISSIONAL

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';
import EventCard from './EventCard';
import { EmptyState } from '../../../components/common';
import type { Event } from '../../../services';

// ============================================
// TYPES
// ============================================

interface EventGridViewProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  loading?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export default function EventGridView({
  events,
  onEdit,
  onDelete,
  loading = false,
}: EventGridViewProps) {
  
  // ============================================
  // LOADING STATE
  // ============================================
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
          >
            <div className="bg-gray-200 h-24" />
            <div className="p-6 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="pt-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
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
      <div className="col-span-full">
        <EmptyState
          icon={<Calendar className="h-16 w-16 text-gray-400" />}
          title="Nenhum evento encontrado"
          description="Tente ajustar os filtros ou crie um novo evento"
        />
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            layout
          >
            <EventCard
              event={event}
              onEdit={onEdit}
              onDelete={onDelete}
              variant="default"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}