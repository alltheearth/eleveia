// src/pages/Campaigns/components/CampaignContacts/index.tsx
// 👥 CONTATOS DA CAMPANHA
// Lista de contatos que receberam a campanha

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Mail,
  Search,
  Download,
  Filter,
} from 'lucide-react';
import type { Campaign } from '../../types/campaign.types';

interface CampaignContactsProps {
  campaign: Campaign;
}

// Mock data
const MOCK_CONTACTS = [
  { id: 1, name: 'Maria Silva', email: 'maria@example.com', status: 'delivered', opened: true, clicked: true },
  { id: 2, name: 'João Santos', email: 'joao@example.com', status: 'delivered', opened: true, clicked: false },
  { id: 3, name: 'Ana Costa', email: 'ana@example.com', status: 'delivered', opened: false, clicked: false },
  { id: 4, name: 'Pedro Oliveira', email: 'pedro@example.com', status: 'failed', opened: false, clicked: false },
  { id: 5, name: 'Carla Souza', email: 'carla@example.com', status: 'pending', opened: false, clicked: false },
];

export default function CampaignContacts({ campaign }: CampaignContactsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const getStatusBadge = (status: string) => {
    const configs = {
      delivered: { label: 'Entregue', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 size={14} /> },
      failed: { label: 'Falhou', color: 'bg-red-100 text-red-700', icon: <XCircle size={14} /> },
      pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700', icon: <Clock size={14} /> },
    };
    
    const config = configs[status as keyof typeof configs] || configs.pending;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${config.color} rounded-full text-xs font-semibold`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users className="text-blue-600" size={20} />
              Lista de Contatos
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {campaign.audience_count.toLocaleString()} contatos nesta campanha
            </p>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
            <Download size={18} />
            Exportar
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Abriu
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Clicou
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CONTACTS.map((contact, index) => (
                <motion.tr
                  key={contact.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(contact.status)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {contact.opened ? (
                      <CheckCircle2 className="text-green-600 mx-auto" size={20} />
                    ) : (
                      <XCircle className="text-gray-300 mx-auto" size={20} />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {contact.clicked ? (
                      <CheckCircle2 className="text-blue-600 mx-auto" size={20} />
                    ) : (
                      <XCircle className="text-gray-300 mx-auto" size={20} />
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}


