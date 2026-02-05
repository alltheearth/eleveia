// src/pages/Contacts/components/ContactListView.tsx
// 📋 VISUALIZAÇÃO EM LISTA DE CONTATOS

import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import ContactCard from './ContactCard';
import { EmptyState } from '../../../components/common';
import type { Contact } from '../index';

// ============================================
// TYPES
// ============================================

interface ContactListViewProps {
  contacts: Contact[];
  onViewDetails: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  loading?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export default function ContactListView({
  contacts,
  onViewDetails,
  onDelete,
  loading = false,
}: ContactListViewProps) {
  
  // ============================================
  // LOADING STATE
  // ============================================
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-200 rounded-xl" />
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

  // ============================================
  // EMPTY STATE
  // ============================================
  
  if (contacts.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-16 w-16 text-gray-400" />}
        title="Nenhum contato encontrado"
        description="Não há contatos cadastrados ou nenhum contato corresponde aos filtros selecionados."
      />
    );
  }

  // ============================================
  // AGRUPAR POR STATUS DE DOCUMENTAÇÃO/FINANCEIRO
  // ============================================
  
  const groupContacts = () => {
    const groups: Record<string, Contact[]> = {
      'regular': [],
      'doc_pendente': [],
      'fin_pendente': [],
    };

    contacts.forEach(contact => {
      if (!contact.documentacao_completa) {
        groups.doc_pendente.push(contact);
      } else if (!contact.mensalidades_em_dia) {
        groups.fin_pendente.push(contact);
      } else {
        groups.regular.push(contact);
      }
    });

    return groups;
  };

  const groupedContacts = groupContacts();
  
  const groupLabels = {
    regular: { label: 'Situação Regular', icon: '✅', color: 'text-green-600' },
    doc_pendente: { label: 'Documentação Pendente', icon: '⚠️', color: 'text-orange-600' },
    fin_pendente: { label: 'Pendências Financeiras', icon: '🔴', color: 'text-red-600' },
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-8">
      <AnimatePresence mode="popLayout">
        {Object.entries(groupedContacts).map(([group, groupContacts]) => {
          if (groupContacts.length === 0) return null;

          const groupInfo = groupLabels[group as keyof typeof groupLabels];

          return (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header do grupo */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <h3 className={`text-lg font-bold ${groupInfo.color} capitalize px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-2`}>
                  <span className="text-2xl">{groupInfo.icon}</span>
                  {groupInfo.label}
                  <span className="ml-2 px-2 py-0.5 bg-white rounded-full text-xs">
                    {groupContacts.length}
                  </span>
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>

              {/* Lista de contatos */}
              <div className="space-y-3">
                {groupContacts.map((contact, index) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <ContactCard
                      contact={contact}
                      onViewDetails={onViewDetails}
                      onDelete={onDelete}
                      variant="compact"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}