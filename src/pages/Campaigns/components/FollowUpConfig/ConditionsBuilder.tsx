// src/pages/Campaigns/components/FollowUpConfig/ConditionsBuilder.tsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Copy, GripVertical } from 'lucide-react';
import type { FollowUpCondition } from '../../types/campaign.types';

interface ConditionsBuilderProps {
  conditions: FollowUpCondition[];
  onChange: (conditions: FollowUpCondition[]) => void;
}

interface FieldOption {
  value: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'select';
  options?: Array<{ value: string; label: string }>;
  icon: string;
}

const FIELD_OPTIONS: FieldOption[] = [
  {
    value: 'lead_status',
    label: 'Status do Lead',
    type: 'select',
    icon: '📊',
    options: [
      { value: 'novo', label: 'Novo' },
      { value: 'em_contato', label: 'Em Contato' },
      { value: 'interessado', label: 'Interessado' },
      { value: 'matriculado', label: 'Matriculado' },
      { value: 'perdido', label: 'Perdido' },
    ],
  },
  {
    value: 'student_grade',
    label: 'Série do Aluno',
    type: 'select',
    icon: '🎓',
    options: [
      { value: 'infantil', label: 'Educação Infantil' },
      { value: 'fundamental_1', label: 'Fundamental I' },
      { value: 'fundamental_2', label: 'Fundamental II' },
      { value: 'medio', label: 'Ensino Médio' },
    ],
  },
  {
    value: 'last_interaction_days',
    label: 'Dias desde último contato',
    type: 'number',
    icon: '📅',
  },
  {
    value: 'total_interactions',
    label: 'Total de Interações',
    type: 'number',
    icon: '💬',
  },
  {
    value: 'has_whatsapp',
    label: 'Possui WhatsApp',
    type: 'boolean',
    icon: '📱',
  },
  {
    value: 'has_email',
    label: 'Possui Email',
    type: 'boolean',
    icon: '📧',
  },
  {
    value: 'parent_name',
    label: 'Nome do Responsável',
    type: 'string',
    icon: '👤',
  },
  {
    value: 'created_at',
    label: 'Data de Criação',
    type: 'date',
    icon: '📆',
  },
];

const OPERATOR_OPTIONS = {
  string: [
    { value: 'equals', label: 'É igual a', icon: '=' },
    { value: 'not_equals', label: 'É diferente de', icon: '≠' },
    { value: 'contains', label: 'Contém', icon: '⊃' },
    { value: 'not_contains', label: 'Não contém', icon: '⊅' },
    { value: 'starts_with', label: 'Começa com', icon: '→' },
    { value: 'ends_with', label: 'Termina com', icon: '←' },
  ],
  number: [
    { value: 'equals', label: 'É igual a', icon: '=' },
    { value: 'not_equals', label: 'É diferente de', icon: '≠' },
    { value: 'greater_than', label: 'Maior que', icon: '>' },
    { value: 'less_than', label: 'Menor que', icon: '<' },
    { value: 'greater_or_equal', label: 'Maior ou igual', icon: '≥' },
    { value: 'less_or_equal', label: 'Menor ou igual', icon: '≤' },
  ],
  boolean: [
    { value: 'is_true', label: 'É verdadeiro', icon: '✓' },
    { value: 'is_false', label: 'É falso', icon: '✗' },
  ],
  date: [
    { value: 'before', label: 'Antes de', icon: '←' },
    { value: 'after', label: 'Depois de', icon: '→' },
    { value: 'between', label: 'Entre', icon: '↔' },
  ],
  select: [
    { value: 'equals', label: 'É igual a', icon: '=' },
    { value: 'not_equals', label: 'É diferente de', icon: '≠' },
    { value: 'in', label: 'Está em', icon: '∈' },
    { value: 'not_in', label: 'Não está em', icon: '∉' },
  ],
};

function ConditionRow({
  condition,
  index,
  onUpdate,
  onDelete,
  onDuplicate,
  isLast,
}: {
  condition: FollowUpCondition;
  index: number;
  onUpdate: (updates: Partial<FollowUpCondition>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  isLast: boolean;
}) {
  const fieldOption = FIELD_OPTIONS.find((f) => f.value === condition.field);
  const operators = fieldOption
    ? OPERATOR_OPTIONS[fieldOption.type]
    : OPERATOR_OPTIONS.string;

  const renderValueInput = () => {
    if (!fieldOption) return null;

    switch (fieldOption.type) {
      case 'boolean':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate({ value: true })}
              className={`flex-1 px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                condition.value === true
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              ✓ Sim
            </button>
            <button
              onClick={() => onUpdate({ value: false })}
              className={`flex-1 px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                condition.value === false
                  ? 'bg-red-50 border-red-300 text-red-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              ✗ Não
            </button>
          </div>
        );

      case 'select':
        return (
          <select
            value={condition.value}
            onChange={(e) => onUpdate({ value: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          >
            <option value="">Selecione...</option>
            {fieldOption.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            type="number"
            value={condition.value}
            onChange={(e) => onUpdate({ value: Number(e.target.value) })}
            placeholder="Digite um número"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={condition.value}
            onChange={(e) => onUpdate({ value: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
        );

      default:
        return (
          <input
            type="text"
            value={condition.value}
            onChange={(e) => onUpdate({ value: e.target.value })}
            placeholder="Digite um valor"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
        );
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-purple-200 transition-all duration-200"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        {/* Drag handle */}
        <div className="hidden md:flex items-center justify-center">
          <GripVertical size={20} className="text-gray-400 cursor-move" />
        </div>

        {/* Field selector */}
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Campo
          </label>
          <select
            value={condition.field}
            onChange={(e) => onUpdate({ field: e.target.value })}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          >
            <option value="">Selecione um campo...</option>
            {FIELD_OPTIONS.map((field) => (
              <option key={field.value} value={field.value}>
                {field.icon} {field.label}
              </option>
            ))}
          </select>
        </div>

        {/* Operator selector */}
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Operador
          </label>
          <select
            value={condition.operator}
            onChange={(e) => onUpdate({ operator: e.target.value })}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            disabled={!condition.field}
          >
            <option value="">Selecione...</option>
            {operators.map((op) => (
              <option key={op.value} value={op.value}>
                {op.icon} {op.label}
              </option>
            ))}
          </select>
        </div>

        {/* Value input */}
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Valor
          </label>
          {renderValueInput()}
        </div>

        {/* Actions */}
        <div className="md:col-span-2 flex items-end gap-2">
          <button
            onClick={onDuplicate}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
            title="Duplicar condição"
          >
            <Copy size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
            title="Remover condição"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Logic connector */}
      {!isLast && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="flex-1 h-px bg-gray-200"></div>
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate({ logic: 'AND' })}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                condition.logic === 'AND' || !condition.logic
                  ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                  : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              E (AND)
            </button>
            <button
              onClick={() => onUpdate({ logic: 'OR' })}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                condition.logic === 'OR'
                  ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                  : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              OU (OR)
            </button>
          </div>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>
      )}
    </motion.div>
  );
}

export default function ConditionsBuilder({
  conditions,
  onChange,
}: ConditionsBuilderProps) {
  const handleAddCondition = () => {
    const newCondition: FollowUpCondition = {
      field: '',
      operator: '',
      value: '',
      logic: 'AND',
    };
    onChange([...conditions, newCondition]);
  };

  const handleUpdateCondition = (index: number, updates: Partial<FollowUpCondition>) => {
    const updated = conditions.map((cond, i) =>
      i === index ? { ...cond, ...updates } : cond
    );
    onChange(updated);
  };

  const handleDeleteCondition = (index: number) => {
    onChange(conditions.filter((_, i) => i !== index));
  };

  const handleDuplicateCondition = (index: number) => {
    const conditionToDuplicate = { ...conditions[index] };
    const updated = [...conditions];
    updated.splice(index + 1, 0, conditionToDuplicate);
    onChange(updated);
  };

  const hasConditions = conditions.length > 0;

  return (
    <div className="space-y-4">
      {/* Lista de condições */}
      <AnimatePresence mode="popLayout">
        {hasConditions ? (
          <div className="space-y-4">
            {conditions.map((condition, index) => (
              <ConditionRow
                key={index}
                condition={condition}
                index={index}
                onUpdate={(updates) => handleUpdateCondition(index, updates)}
                onDelete={() => handleDeleteCondition(index)}
                onDuplicate={() => handleDuplicateCondition(index)}
                isLast={index === conditions.length - 1}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">🎛️</span>
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Nenhuma condição definida
            </p>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Adicione condições para criar regras personalizadas de quando este follow-up
              deve ser enviado
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão adicionar */}
      <button
        onClick={handleAddCondition}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 flex items-center justify-center gap-2 font-semibold group"
      >
        <div className="w-8 h-8 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center transition-colors">
          <Plus size={18} className="text-purple-600" />
        </div>
        {hasConditions ? 'Adicionar Mais uma Condição' : 'Adicionar Primeira Condição'}
      </button>

      {/* Info sobre condições */}
      {hasConditions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">💡</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Como funciona a lógica das condições?
              </p>
              <div className="text-xs text-blue-700 space-y-1">
                <p>
                  <strong>E (AND):</strong> Todas as condições devem ser verdadeiras
                </p>
                <p>
                  <strong>OU (OR):</strong> Pelo menos uma condição deve ser verdadeira
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Preview da lógica */}
      {hasConditions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-50 border border-gray-200 rounded-xl p-4"
        >
          <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
            Preview da Lógica
          </p>
          <div className="bg-white rounded-lg p-3 border border-gray-200 font-mono text-xs text-gray-700 space-y-1">
            {conditions.map((cond, index) => {
              const field = FIELD_OPTIONS.find((f) => f.value === cond.field);
              return (
                <div key={index}>
                  <span className="text-purple-600 font-bold">
                    {field?.label || 'Campo'}
                  </span>{' '}
                  <span className="text-blue-600">{cond.operator}</span>{' '}
                  <span className="text-green-600">"{cond.value}"</span>
                  {index < conditions.length - 1 && (
                    <div className="text-orange-600 font-bold my-1">
                      {cond.logic || 'AND'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}