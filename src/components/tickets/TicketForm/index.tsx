// src/components/tickets/TicketForm/index.tsx
import { Save, Plus } from 'lucide-react';
import type { Ticket } from '../../../services';

interface TicketFormProps {
  formData: {
    title: string;
    description: string;
    priority: Ticket['priority'];
    status: Ticket['status'];
  };
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

export default function TicketForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
}: TicketFormProps) {
  return (
    <div className="space-y-4">
      {/* Título */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Título * (mín. 5 caracteres)
        </label>
        <input
          type="text"
          placeholder="Descreva o problema brevemente"
          value={formData.title}
          onChange={(e) => onChange('title', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
        />
        <p className="text-sm text-gray-500 mt-1">
          {formData.title.length} caracteres
        </p>
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Descrição * (mín. 10 caracteres)
        </label>
        <textarea
          placeholder="Descreva o problema em detalhes..."
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
        />
        <p className="text-sm text-gray-500 mt-1">
          {formData.description.length} caracteres
        </p>
      </div>

      {/* Prioridade e Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Prioridade
          </label>
          <select
            value={formData.priority}
            onChange={(e) => onChange('priority', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          >
            <option value="medium">🔵 Média</option>
            <option value="high">🟠 Alta</option>
            <option value="urgent">🔴 Urgente</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => onChange('status', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          >
            <option value="open">📝 Aberto</option>
            <option value="in_progress">⏳ Em Andamento</option>
            <option value="pending">⏸️ Pendente</option>
            <option value="resolved">✅ Resolvido</option>
            <option value="closed">🔒 Fechado</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
        >
          {isEditing ? <Save size={20} /> : <Plus size={20} />}
          {isLoading 
            ? (isEditing ? 'Atualizando...' : 'Criando...')
            : (isEditing ? 'Atualizar' : 'Criar Ticket')
          }
        </button>

        <button
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition font-semibold disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}