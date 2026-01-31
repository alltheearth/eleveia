// src/pages/FAQs/components/FAQAccordionView.tsx
// 🎯 VISUALIZAÇÃO EM ACCORDION (Modo apresentação/público)

import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import FAQCard from './FAQCard';
import type { FAQ } from '../../../services';

// ============================================
// TYPES
// ============================================

interface FAQAccordionViewProps {
  faqs: FAQ[];
  onEdit: (faq: FAQ) => void;
  onDelete: (faq: FAQ) => void;
  onStatusChange?: (faq: FAQ, newStatus: FAQ['status']) => void;
  loading?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export default function FAQAccordionView({
  faqs,
  onEdit,
  onDelete,
  onStatusChange,
  loading = false,
}: FAQAccordionViewProps) {
  // Loading state
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
              <div className="w-6 h-6 bg-gray-200 rounded" />
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

  // Accordion agrupado por categoria
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 shadow-md">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">
                  {category === 'General' && '📋'}
                  {category === 'Admission' && '🎓'}
                  {category === 'Pricing' && '💰'}
                  {category === 'Uniform' && '👔'}
                  {category === 'Schedule' && '📅'}
                  {category === 'Documentation' && '📄'}
                  {category === 'Activities' && '🎨'}
                  {category === 'Meals' && '🍽️'}
                  {category === 'Transport' && '🚌'}
                  {category === 'Pedagogical' && '📚'}
                </span>
                {category}
                <span className="ml-auto text-sm bg-white/20 px-3 py-1 rounded-full">
                  {faqsByCategory[category].length} {faqsByCategory[category].length === 1 ? 'pergunta' : 'perguntas'}
                </span>
              </h2>
            </div>
          </motion.div>

          {/* Accordion items */}
          <div className="space-y-3">
            {faqsByCategory[category].map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <FAQCard
                  faq={faq}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                  variant="accordion"
                />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}   