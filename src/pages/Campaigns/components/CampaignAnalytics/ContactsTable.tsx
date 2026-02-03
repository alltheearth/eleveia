// src/pages/Campaigns/components/CampaignAnalytics/ContactsTable.tsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  CheckCircle2,
  XCircle,
  Eye,
  MousePointerClick,
  Clock,
  Search,
  Download,
} from 'lucide-react';
import type { CampaignChannel } from '../../types/campaign.types';

interface ContactsTableProps {
  campaignId: number;
  selectedChannel: 'all' | CampaignChannel;
}

interface ContactStatus {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed' | 'pending';
  channel: CampaignChannel;
  sentAt?: string;
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  failureReason?: string;
}

// Mock data - em produção viria da API
const MOCK_CONTACTS: ContactStatus[] = [
  {
    id: 1,
    name: 'Maria Silva',
    email: 'maria@example.com',
    phone: '+55 11 99999-9999',
    status: 'clicked',
    channel: 'whatsapp',
    sentAt: '2026-02-03T10:00:00',
    deliveredAt: '2026-02-03T10:00:05',
    openedAt: '2026-02-03T10:15:00',
    clickedAt: '2026-02-03T10:16:00',
  },
  {
    id: 2,
    name: 'João Santos',
    email: 'joao@example.com',
    phone: '+55 11 98888-8888',
    status: 'opened',
    channel: 'email',
    sentAt: '2026-02-03T10:00:00',
    deliveredAt: '2026-02-03T10:00:10',
    openedAt: '2026-02-03T11:30:00',
  },
  {
    id: 3,
    name: 'Ana Costa',
    phone: '+55 11 97777-7777',
    status: 'delivered',
    channel: 'sms',
    sentAt: '2026-02-03T10:00:00',
    deliveredAt: '2026-02-03T10:00:03',
  },
  {
    id: 4,
    name: 'Pedro Oliveira',
    email: 'pedro@example.com',
    status: 'failed',
    channel: 'email',
    sentAt: '2026-02-03T10:00:00',
    failureReason: 'Email inválido',
  },
  {
    id: 5,
    name: 'Carla Mendes',
    phone: '+55 11 96666-6666',
    status: 'pending',
    channel: 'whatsapp',
  },
];

const STATUS_CONFIG = {
  sent: {
    label: 'Enviada',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <CheckCircle2 size={14} />,
  },
  delivered: {
    label: 'Entregue',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: <CheckCircle2 size={14} />,
  },
  opened: {
    label: 'Aberta',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: <Eye size={14} />,
  },
  clicked: {
    label: 'Clicou',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: <MousePointerClick size={14} />,
  },
  failed: {
    label: 'Falhou',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: <XCircle size={14} />,
  },
  pending: {
    label: 'Pendente',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: <Clock size={14} />,
  },
};

export default function ContactsTable({
  campaignId,
  selectedChannel,
}: ContactsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter contacts
  const filteredContacts = MOCK_CONTACTS.filter((contact) => {
    // Channel filter
    if (selectedChannel !== 'all' && contact.channel !== selectedChannel) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = contact.name.toLowerCase().includes(query);
      const matchesEmail = contact.email?.toLowerCase().includes(query);
      const matchesPhone = contact.phone?.toLowerCase().includes(query);

      if (!matchesName && !matchesEmail && !matchesPhone) {
        return false;
      }
    }

    // Status filter
    if (statusFilter !== 'all' && contact.status !== statusFilter) {
      return false;
    }

    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContacts = filteredContacts.slice(startIndex, endIndex);

  // Status counts
  const statusCounts = MOCK_CONTACTS.reduce((acc, contact) => {
    acc[contact.status] = (acc[contact.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleExport = () => {
    // TODO: Implementar exportação CSV
    console.log('Exportando contatos...');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Users className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white">Detalhes por Contato</h3>
              <p className="text-gray-300 text-sm">
                {filteredContacts.length} contato{filteredContacts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <button
            onClick={handleExport}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 text-sm"
          >
            <Download size={16} />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, email ou telefone..."
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Status filter tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-gray-100 text-gray-900 border-2 border-gray-300'
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300'
            }`}
          >
            Todos ({MOCK_CONTACTS.length})
          </button>

          {Object.entries(STATUS_CONFIG).map(([status, config]) => {
            const count = statusCounts[status] || 0;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border-2 ${
                  statusFilter === status ? config.color : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Contato
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Canal
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Enviado em
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Última ação
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentContacts.map((contact) => {
              const statusConfig = STATUS_CONFIG[contact.status];
              const lastAction = contact.clickedAt || contact.openedAt || contact.deliveredAt || contact.sentAt;

              return (
                <motion.tr
                  key={contact.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{contact.name}</p>
                      {contact.email && (
                        <p className="text-sm text-gray-500">{contact.email}</p>
                      )}
                      {contact.phone && (
                        <p className="text-sm text-gray-500">{contact.phone}</p>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold">
                      {contact.channel === 'whatsapp' && '📱 WhatsApp'}
                      {contact.channel === 'email' && '📧 Email'}
                      {contact.channel === 'sms' && '💬 SMS'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-xs font-semibold ${statusConfig.color}`}
                    >
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">
                      {contact.sentAt
                        ? new Date(contact.sentAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '-'}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    {contact.failureReason ? (
                      <p className="text-sm text-red-600 font-medium">
                        {contact.failureReason}
                      </p>
                    ) : lastAction ? (
                      <p className="text-sm text-gray-500">
                        {new Date(lastAction).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400">-</p>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredContacts.length)} de{' '}
            {filteredContacts.length} contatos
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'border-2 border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}