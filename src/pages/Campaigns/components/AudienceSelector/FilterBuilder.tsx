// src/pages/Campaigns/components/AudienceSelector/FilterBuilder.tsx
// 🔧 CONSTRUTOR VISUAL DE FILTROS

import { useState } from 'react';
import { Plus, Trash2, Filter } from 'lucide-react';
import type { AudienceFilter } from '../../types/campaign.types';

interface FilterBuilderProps {
  filters: AudienceFilter[];
  onChange: (filters: AudienceFilter[]) => void;
  schoolId: number;
  onPreviewUpdate?: (count: number) => void;
}

const AVAILABLE_FIELDS = [
  { value: 'serie', label: 'Série/Turma', type: 'select' },
  { value: 'status', label: 'Status', type: 'select' },
  { value: 'idade', label: 'Idade', type: 'number' },
  { value: 'responsavel_email', label: 'Email do Responsável', type: 'text' },
];

const OPERATORS = {
  select: [
    { value: 'equals', label: 'É igual a' },
    { value: 'not_equals', label: 'É diferente de' },
    { value: 'in', label: 'Está em' },
  ],
  number: [
    { value: 'equals', label: 'É igual a' },
    { value: 'greater_than', label: 'Maior que' },
    { value: 'less_than', label: 'Menor que' },
  ],
  text: [
    { value: 'contains', label: 'Contém' },
    { value: 'equals', label: 'É igual a' },
  ],
};

export default function FilterBuilder({
  filters,
  onChange,
  onPreviewUpdate,
}: FilterBuilderProps) {
  
  const addFilter = () => {
    onChange([
      ...filters,
      {
        field: 'serie',
        operator: 'equals',
        value: '',
        logic: 'AND',
      },
    ]);
  };

  const updateFilter = (index: number, updates: Partial<AudienceFilter>) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], ...updates };
    onChange(newFilters);
  };

  const removeFilter = (index: number) => {
    onChange(filters.filter((_, i) => i !== index));
  };

  if (filters.length === 0) {
    return (
      <div className="text-center py-12">
        <Filter className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Nenhum filtro configurado
        </h3>
        <p className="text-gray-600 mb-6">
          Adicione filtros para segmentar seu público
        </p>
        <button
          onClick={addFilter}
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors"
        >
          <Plus size={20} />
          Adicionar Primeiro Filtro
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filters.map((filter, index) => (
        <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          
          {/* Logic Operator (AND/OR) - exceto primeiro */}
          {index > 0 && (
            <div className="flex items-center gap-2">
              <select
                value={filter.logic || 'AND'}
                onChange={(e) => updateFilter(index, { logic: e.target.value as 'AND' | 'OR' })}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="AND">E</option>
                <option value="OR">OU</option>
              </select>
            </div>
          )}

          {/* Field */}
          <div className="flex-1">
            <select
              value={filter.field}
              onChange={(e) => updateFilter(index, { field: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {AVAILABLE_FIELDS.map((field) => (
                <option key={field.value} value={field.value}>
                  {field.label}
                </option>
              ))}
            </select>
          </div>

          {/* Operator */}
          <div className="flex-1">
            <select
              value={filter.operator}
              onChange={(e) => updateFilter(index, { operator: e.target.value as any })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {OPERATORS[AVAILABLE_FIELDS.find(f => f.value === filter.field)?.type || 'text'].map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>

          {/* Value */}
          <div className="flex-1">
            <input
              type="text"
              value={filter.value}
              onChange={(e) => updateFilter(index, { value: e.target.value })}
              placeholder="Valor..."
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Remove */}
          <button
            onClick={() => removeFilter(index)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} className="text-red-600" />
          </button>
        </div>
      ))}

      {/* Add Filter Button */}
      <button
        onClick={addFilter}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border-2 border-dashed border-gray-300 hover:border-purple-400 text-gray-600 hover:text-purple-600 rounded-xl font-semibold transition-all"
      >
        <Plus size={20} />
        Adicionar Filtro
      </button>
    </div>
  );
}