// src/pages/FAQs/components/FAQGridView.tsx
// 📱 VISUALIZAÇÃO EM GRADE

import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import FAQCard from './FAQCard';
import type { FAQ } from '../../../services';

// ============================================
// TYPES
// ============================================

interface FAQGridViewProps {
  faqs: FAQ[];
  onEdit: (faq: FAQ) => void;
  onDelete: (faq: FAQ) => void;
  onStatusChange?: (faq: FAQ, newStatus: FAQ['status']) => void;
  loading?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export default function FAQGridView({
  faqs,
  onEdit,
  onDelete,
  onStatusChange,
  loading = false,
}: FAQGridViewProps) {
  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
          >
            <div className="bg-gray-200 h-24" />
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (faqs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <HelpCircle className="text-gray-400" size={40} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Nenhuma FAQ encontrada
        </h3>
        <p className="text-gray-600 max-w-md">
          Não há FAQs cadastradas ou nenhuma FAQ corresponde aos filtros selecionados.
        </p>
      </motion.div>
    );
  }

  // Grid de FAQs
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05 }}
            layout
          >
            <FAQCard
              faq={faq}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              variant="default"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}