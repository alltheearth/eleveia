// src/components/tickets/TicketForm/index.tsx
import { Save, Plus } from 'lucide-react';
import type { FAQ } from '../../../services';

interface FAQFormProps {
  formData: {
    pergunta: string;
    resposta: string;
    categoria: FAQ['categoria'];
    status: FAQ['status'];
  };
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

export default function FAQForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
}: FAQFormProps) {
  return (
    <div className="space-y-4">
      {/* Pergunta */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Pergunta * (mín. 5 caracteres)
        </label>
        <input
          type="text"
          placeholder="Descreva a pergunta brevemente"
          value={formData.pergunta}
          onChange={(e) => onChange('pergunta', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
        />
        <p className="text-sm text-gray-500 mt-1">
          {formData.pergunta.length} caracteres
        </p>
      </div>

      {/* Resposta */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Resposta * (mín. 10 caracteres)
        </label>
        <textarea
          placeholder="Descreva a resposta em detalhes..."
          value={formData.resposta}
          onChange={(e) => onChange('resposta', e.target.value)}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
        />
        <p className="text-sm text-gray-500 mt-1">
          {formData.resposta.length} caracteres
        </p>
      </div>

      {/* Categoria e Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Categoria
          </label>
          <select
            value={formData.categoria}
            onChange={(e) => onChange('categoria', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          >
            <option value="Geral">Geral</option>
            <option value="Financeiro">Financeiro</option>
            <option value="Acadêmico">Acadêmico</option>
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
            <option value="ativa">🟢 Ativa</option>
            <option value="inativa">🔴 Inativa</option>
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