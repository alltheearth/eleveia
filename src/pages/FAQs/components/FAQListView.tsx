// src/pages/FAQs/components/FAQListView.tsx
// 📋 VISUALIZAÇÃO EM LISTA

import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import FAQCard from './FAQCard';
import type { FAQ } from '../../../services';

// ============================================
// TYPES
// ============================================

interface FAQListViewProps {
  faqs: FAQ[];
  onEdit: (faq: FAQ) => void;
  onDelete: (faq: FAQ) => void;
  onStatusChange?: (faq: FAQ, newStatus: FAQ['status']) => void;
  loading?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export default function FAQListView({
  faqs,
  onEdit,
  onDelete,
  onStatusChange,
  loading = false,
}: FAQListViewProps) {
  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
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

  // Agrupar FAQs por categoria
  const faqsByCategory = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  const categories = Object.keys(faqsByCategory).sort();

  // Lista de FAQs agrupadas
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {categories.map((category) => (
        <div key={category}>
          {/* Cabeçalho da categoria */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <h2 className="text-lg font-bold text-gray-900 px-4 py-2 bg-gray-100 rounded-full">
              {category}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </motion.div>

          {/* Lista de FAQs da categoria */}
          <div className="space-y-3">
            {faqsByCategory[category].map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <FAQCard
                  faq={faq}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                  variant="compact"
                />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}