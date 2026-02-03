// src/pages/Campaigns/components/AudienceSelector/ManualSelection.tsx
// ✋ SELEÇÃO MANUAL DE CONTATOS

import { useState } from 'react';
import { Search, UserCheck, X } from 'lucide-react';

interface ManualSelectionProps {
  selectedContacts: number[];
  onChange: (contacts: number[]) => void;
  schoolId: number;
}

export default function ManualSelection({
  selectedContacts,
  onChange,
  schoolId,
}: ManualSelectionProps) {
  
  const [searchTerm, setSearchTerm] = useState('');

  // Mock contacts - em produção, buscar da API
  const mockContacts = [
    { id: 1, name: 'Maria Silva', email: 'maria@email.com', serie: '5º Ano A' },
    { id: 2, name: 'João Santos', email: 'joao@email.com', serie: '6º Ano B' },
    { id: 3, name: 'Ana Costa', email: 'ana@email.com', serie: '7º Ano A' },
  ];

  const filteredContacts = mockContacts.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleContact = (id: number) => {
    if (selectedContacts.includes(id)) {
      onChange(selectedContacts.filter((cid) => cid !== id));
    } else {
      onChange([...selectedContacts, id]);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar contatos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Selected Count */}
      {selectedContacts.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <p className="text-sm text-purple-900">
            <strong>{selectedContacts.length}</strong> contato{selectedContacts.length !== 1 ? 's' : ''} selecionado{selectedContacts.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Contacts List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredContacts.map((contact) => {
          const isSelected = selectedContacts.includes(contact.id);
          
          return (
            <button
              key={contact.id}
              onClick={() => toggleContact(contact.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'bg-purple-50 border-purple-300'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                isSelected
                  ? 'bg-purple-600 border-purple-600'
                  : 'border-gray-300'
              }`}>
                {isSelected && <UserCheck className="text-white" size={14} />}
              </div>

              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900">{contact.name}</p>
                <p className="text-sm text-gray-600">{contact.email} • {contact.serie}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}