// src/pages/Campaigns/components/CampaignWizard/Step2_Audience.tsx
// 🎯 STEP 2 - SELEÇÃO DE PÚBLICO-ALVO

import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, X, Filter, Eye, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import type { AudienceFilter } from '../../types/campaign.types';

// ============================================
// TYPES
// ============================================

interface Step2Props {
  data: {
    audience_filters: AudienceFilter[];
    manual_contacts: number[];
    audience_count: number;
  };
  updateData: (updates: any) => void;
}

// ============================================
// CAMPOS DISPONÍVEIS
// ============================================

const AVAILABLE_FIELDS = [
  { value: 'status', label: 'Status do Lead', type: 'select' },
  { value: 'origem', label: 'Origem', type: 'select' },
  { value: 'serie', label: 'Série de Interesse', type: 'select' },
  { value: 'turno', label: 'Turno Preferido', type: 'select' },
  { value: 'criado_em', label: 'Data de Cadastro', type: 'date' },
  { value: 'idade_aluno', label: 'Idade do Aluno', type: 'number' },
  { value: 'cidade', label: 'Cidade', type: 'text' },
  { value: 'tem_email', label: 'Possui Email', type: 'boolean' },
  { value: 'tem_whatsapp', label: 'Possui WhatsApp', type: 'boolean' },
];

const OPERATORS: Record<string, Array<{ value: string; label: string }>> = {
  text: [
    { value: 'equals', label: 'É igual a' },
    { value: 'not_equals', label: 'Não é igual a' },
    { value: 'contains', label: 'Contém' },
  ],
  select: [
    { value: 'equals', label: 'É igual a' },
    { value: 'not_equals', label: 'Não é igual a' },
    { value: 'in', label: 'Está em' },
  ],
  number: [
    { value: 'equals', label: 'Igual a' },
    { value: 'greater_than', label: 'Maior que' },
    { value: 'less_than', label: 'Menor que' },
  ],
  date: [
    { value: 'equals', label: 'Na data' },
    { value: 'greater_than', label: 'Depois de' },
    { value: 'less_than', label: 'Antes de' },
  ],
  boolean: [
    { value: 'equals', label: 'É' },
  ],
};

// ============================================
// VALORES DE EXEMPLO PARA SELECTS
// ============================================

const FIELD_VALUES: Record<string, string[]> = {
  status: ['Novo', 'Qualificado', 'Contato', 'Matriculado', 'Perdido'],
  origem: ['Site', 'Facebook', 'Instagram', 'Indicação', 'Eventos'],
  serie: ['Berçário', '1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano'],
  turno: ['Manhã', 'Tarde', 'Integral'],
  tem_email: ['Sim', 'Não'],
  tem_whatsapp: ['Sim', 'Não'],
};

// ============================================
// COMPONENT
// ============================================

export default function Step2_Audience({ data, updateData }: Step2Props) {
  
  const [previewCount, setPreviewCount] = useState(0);

  // ============================================
  // HANDLERS
  // ============================================

  const handleAddFilter = () => {
    const newFilter: AudienceFilter = {
      id: `filter-${Date.now()}`,
      field: 'status',
      operator: 'equals',
      value: '',
      logic: data.audience_filters.length > 0 ? 'AND' : undefined,
    };
    
    updateData({
      audience_filters: [...data.audience_filters, newFilter],
    });
  };

  const handleRemoveFilter = (index: number) => {
    updateData({
      audience_filters: data.audience_filters.filter((_, i) => i !== index),
    });
  };

  const handleUpdateFilter = (index: number, updates: Partial<AudienceFilter>) => {
    const newFilters = [...data.audience_filters];
    newFilters[index] = { ...newFilters[index], ...updates };
    updateData({ audience_filters: newFilters });
  };

  const handlePreviewAudience = () => {
    // Simular contagem de audiência
    const mockCount = Math.floor(Math.random() * 500) + 50;
    setPreviewCount(mockCount);
    updateData({ audience_count: mockCount });
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          🎯 Quem Receberá esta Campanha?
        </h3>
        <p className="text-gray-600">
          Defina filtros para selecionar o público-alvo da campanha
        </p>
      </div>

      {/* Filtros */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700">
            <Filter size={18} className="inline mr-2" />
            Filtros de Segmentação
          </label>
          <button
            onClick={handleAddFilter}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Adicionar Filtro
          </button>
        </div>

        {/* Lista de Filtros */}
        <AnimatePresence>
          {data.audience_filters.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center"
            >
              <Users size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 font-semibold mb-1">
                Nenhum filtro adicionado
              </p>
              <p className="text-sm text-gray-500">
                Clique em "Adicionar Filtro" para começar a segmentar seu público
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {data.audience_filters.map((filter, index) => (
                <motion.div
                  key={filter.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white border-2 border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-start gap-4">
                    
                    {/* Logic Selector (AND/OR) */}
                    {index > 0 && (
                      <select
                        value={filter.logic || 'AND'}
                        onChange={(e) => handleUpdateFilter(index, { logic: e.target.value as 'AND' | 'OR' })}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold bg-gradient-to-r from-blue-50 to-purple-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="AND">E</option>
                        <option value="OR">OU</option>
                      </select>
                    )}

                    {/* Filter Fields */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      
                      {/* Campo */}
                      <select
                        value={filter.field}
                        onChange={(e) => {
                          const field = AVAILABLE_FIELDS.find(f => f.value === e.target.value);
                          handleUpdateFilter(index, { 
                            field: e.target.value,
                            operator: OPERATORS[field?.type || 'text'][0].value,
                            value: '',
                          });
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {AVAILABLE_FIELDS.map(field => (
                          <option key={field.value} value={field.value}>
                            {field.label}
                          </option>
                        ))}
                      </select>

                      {/* Operador */}
                      <select
                        value={filter.operator}
                        onChange={(e) => handleUpdateFilter(index, { operator: e.target.value as any })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {(() => {
                          const field = AVAILABLE_FIELDS.find(f => f.value === filter.field);
                          return OPERATORS[field?.type || 'text'].map(op => (
                            <option key={op.value} value={op.value}>
                              {op.label}
                            </option>
                          ));
                        })()}
                      </select>

                      {/* Valor */}
                      {(() => {
                        const field = AVAILABLE_FIELDS.find(f => f.value === filter.field);
                        
                        if (field?.type === 'select' || field?.type === 'boolean') {
                          return (
                            <select
                              value={filter.value}
                              onChange={(e) => handleUpdateFilter(index, { value: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Selecione...</option>
                              {FIELD_VALUES[filter.field]?.map(value => (
                                <option key={value} value={value}>
                                  {value}
                                </option>
                              ))}
                            </select>
                          );
                        }
                        
                        if (field?.type === 'date') {
                          return (
                            <input
                              type="date"
                              value={filter.value}
                              onChange={(e) => handleUpdateFilter(index, { value: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          );
                        }
                        
                        if (field?.type === 'number') {
                          return (
                            <input
                              type="number"
                              value={filter.value}
                              onChange={(e) => handleUpdateFilter(index, { value: e.target.value })}
                              placeholder="Digite um número"
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          );
                        }
                        
                        return (
                          <input
                            type="text"
                            value={filter.value}
                            onChange={(e) => handleUpdateFilter(index, { value: e.target.value })}
                            placeholder="Digite o valor"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        );
                      })()}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFilter(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remover filtro"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Preview de Audiência */}
      {data.audience_filters.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <Eye size={20} className="text-blue-600" />
              Prévia do Público
            </h4>
            <button
              onClick={handlePreviewAudience}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Filter size={18} />
              Calcular Audiência
            </button>
          </div>

          {previewCount > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Users size={32} className="text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {previewCount}
                  </p>
                  <p className="text-sm text-gray-600">
                    contatos serão atingidos por esta campanha
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <p className="text-sm text-gray-600 italic">
              Clique em "Calcular Audiência" para ver quantos contatos serão atingidos
            </p>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
          <div>
            <h4 className="font-bold text-yellow-900 mb-1">Como funcionam os filtros?</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Use "E" para combinar condições (ambas devem ser verdadeiras)</li>
              <li>• Use "OU" para alternativas (pelo menos uma deve ser verdadeira)</li>
              <li>• Exemplo: Status = Novo E Série = 1º Ano</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}