// src/pages/Calendar/components/EventForm.tsx
// 📝 FORMULÁRIO DE EVENTO - COMPONENTE LOCAL

import { Save, X } from 'lucide-react';
import type { EventFormData } from '../../../services';

// ============================================
// TYPES
// ============================================

interface EventFormProps {
  formData: EventFormData;
  onChange: (field: keyof EventFormData, value: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export default function EventForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
}: EventFormProps) {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* ========================================== */}
      {/* TÍTULO */}
      {/* ========================================== */}
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Título do Evento *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Ex: Reunião de Pais, Festa Junina..."
          required
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* ========================================== */}
      {/* TIPO DE EVENTO */}
      {/* ========================================== */}
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tipo de Evento *
        </label>
        <select
          value={formData.event_type}
          onChange={(e) => onChange('event_type', e.target.value)}
          required
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="holiday">📌 Feriado</option>
          <option value="exam">📝 Prova</option>
          <option value="graduation">🎓 Formatura</option>
          <option value="cultural">🎭 Cultural</option>
          <option value="meeting">👥 Reunião</option>
        </select>
      </div>

      {/* ========================================== */}
      {/* DATAS */}
      {/* ========================================== */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Data Inicial */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Data Inicial *
          </label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => onChange('start_date', e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Data Final */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Data Final *
          </label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => onChange('end_date', e.target.value)}
            required
            disabled={isLoading}
            min={formData.start_date} // Data final não pode ser antes da inicial
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* ========================================== */}
      {/* DESCRIÇÃO */}
      {/* ========================================== */}
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Descrição
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Descreva os detalhes do evento..."
          rows={4}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* ========================================== */}
      {/* AÇÕES */}
      {/* ========================================== */}
      
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X size={18} />
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          {isLoading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Evento'}
        </button>
      </div>
    </form>
  );
}