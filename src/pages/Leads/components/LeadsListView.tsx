// src/pages/Leads/components/LeadsListView.tsx
import { Edit2, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import { DataTable, Badge } from '../../../components/common';
import type { Lead } from '../../../services';

interface LeadsListViewProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onChangeStatus: (id: number, status: Lead['status']) => void;
  formatDate: (date: string) => string;
}

export default function LeadsListView({
  leads,
  onEdit,
  onDelete,
  onChangeStatus,
  formatDate,
}: LeadsListViewProps) {
  return (
    <DataTable
      columns={[
        { 
          key: 'id', 
          label: '#', 
          width: '80px', 
          sortable: true 
        },
        { 
          key: 'nome', 
          label: 'Name', 
          sortable: true,
          render: (value, row) => (
            <div>
              <p className="font-semibold text-gray-900">{value}</p>
              <div className="flex items-center gap-3 mt-1">
                {row.email && (
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Mail size={12} />
                    <span className="truncate max-w-[200px]">{row.email}</span>
                  </div>
                )}
                {row.telefone && (
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Phone size={12} />
                    <span>{row.telefone}</span>
                  </div>
                )}
              </div>
            </div>
          )
        },
        { 
          key: 'status', 
          label: 'Status',
          render: (value, row) => (
            <select
              value={value}
              onChange={(e) => onChangeStatus(row.id, e.target.value as Lead['status'])}
              onClick={(e) => e.stopPropagation()}
              className={`px-3 py-1 rounded-full font-semibold text-sm border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                value === 'novo' ? 'bg-blue-100 text-blue-700' :
                value === 'contato' ? 'bg-yellow-100 text-yellow-700' :
                value === 'qualificado' ? 'bg-purple-100 text-purple-700' :
                value === 'conversao' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}
            >
              <option value="novo">🆕 New</option>
              <option value="contato">📞 Contact</option>
              <option value="qualificado">⭐ Qualified</option>
              <option value="conversao">✅ Conversion</option>
              <option value="perdido">❌ Lost</option>
            </select>
          )
        },
        { 
          key: 'origem', 
          label: 'Source',
          render: (_value, row) => (
            <Badge variant="blue" size="sm">
              {row.origem_display}
            </Badge>
          ),
          width: '120px',
        },
        { 
          key: 'observacoes', 
          label: 'Notes',
          render: (value) => (
            <span className="text-sm text-gray-600 line-clamp-2">
              {value || '-'}
            </span>
          )
        },
        { 
          key: 'criado_em', 
          label: 'Created',
          sortable: true,
          render: (value) => (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Calendar size={14} />
              <span>{formatDate(value)}</span>
            </div>
          ),
          width: '140px',
        },
      ]}
      data={leads}
      keyExtractor={(lead) => lead.id.toString()}
      actions={[
        {
          icon: <Edit2 size={18} />,
          onClick: onEdit,
          variant: 'primary',
          label: 'Edit',
        },
        {
          icon: <Trash2 size={18} />,
          onClick: onDelete,
          variant: 'danger',
          label: 'Delete',
        },
      ]}
      emptyMessage="No leads found"
    />
  );
}