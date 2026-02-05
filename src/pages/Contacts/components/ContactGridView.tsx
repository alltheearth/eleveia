// src/pages/Contacts/components/ContactGridView.tsx
// 📱 VISUALIZAÇÃO EM GRADE DE CONTATOS

import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import ContactCard from './ContactCard';
import { EmptyState } from '../../../components/common';
import type { Contact } from '../index';

// ============================================
// TYPES
// ============================================

interface ContactGridViewProps {
  contacts: Contact[];
  onViewDetails: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  loading?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export default function ContactGridView({
  contacts,
  onViewDetails,
  onDelete,
  loading = false,
}: ContactGridViewProps) {
  
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
              <div className="space-y-2 pt-3">
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
  
  if (contacts.length === 0) {
    return (
      <div className="col-span-full">
        <EmptyState
          icon={<Users className="h-16 w-16 text-gray-400" />}
          title="Nenhum contato encontrado"
          description="Não há contatos cadastrados ou nenhum contato corresponde aos filtros selecionados."
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
        {contacts.map((contact, index) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            layout
          >
            <ContactCard
              contact={contact}
              onViewDetails={onViewDetails}
              onDelete={onDelete}
              variant="default"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}