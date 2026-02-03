// src/pages/Campaigns/components/CampaignWizard/Step2_Audience.tsx
// 🎯 STEP 2 - SELEÇÃO DE PÚBLICO-ALVO

import { motion } from 'framer-motion';
import { Users, Plus, X, Filter, Eye, Upload } from 'lucide-react';
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
  onNext: () => void;
  onBack: () => void;
}

// ============================================
// CAMPOS DISPONÍVEIS PARA FILTROS
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
    { value: 'not_equals', label: 'É diferente de' },
    { value: 'contains', label: 'Contém' },
  ],
  select: [
    { value: 'equals', label: 'É igual a' },
    { value: 'not_equals', label: 'É diferente de' },
    { value: 'in', label: 'Está em' },
    { value: 'not_in', label: 'Não está em' },
  ],
  number: [
    { value: 'equals', label: 'É igual a' },
    { value: 'greater_than', label: 'Maior que' },
    { value: 'less_than', label: 'Menor que' },
  ],
  date: [
    { value: 'greater_than', label: 'Depois de' },
    { value: 'less_than', label: 'Antes de' },
  ],
  boolean: [
    { value: 'equals', label: 'É' },
  ],
};

// Mock de valores para selects
const SELECT_VALUES: Record<string, string[]> = {
  status: ['novo', 'contato', 'qualificado', 'conversao', 'perdido'],
  origem: ['site', 'whatsapp', 'indicacao', 'ligacao', 'email', 'facebook', 'instagram'],
  serie: ['Maternal', 'Jardim I', 'Jardim II', '1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano'],
  turno: ['Manhã', 'Tarde', 'Integral'],
};

// ============================================
// COMPONENT
// ============================================

export default function Step2_Audience({
  data,
  updateData,
}: Step2Props) {
  
  const [showFilterBuilder, setShowFilterBuilder] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // ============================================
  // HANDLERS - FILTERS
  // ============================================
  
  const handleAddFilter = () => {
    const newFilter: AudienceFilter = {
      field: 'status',
      operator: 'equals',
      value: '',
      logic: 'AND',
    };
    
    updateData({
      audience_filters: [...data.audience_filters, newFilter],
    });
    setShowFilterBuilder(true);
  };

  const handleUpdateFilter = (index: number, updates: Partial<AudienceFilter>) => {
    const newFilters = [...data.audience_filters];
    newFilters[index] = { ...newFilters[index], ...updates };
    updateData({ audience_filters: newFilters });
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = data.audience_filters.filter((_, i) => i !== index);
    updateData({ audience_filters: newFilters });
  };

  const handlePreviewAudience = async () => {
    setIsLoadingPreview(true);
    
    // Simular chamada API
    setTimeout(() => {
      const mockCount = Math.floor(Math.random() * 500) + 50;
      updateData({ audience_count: mockCount });
      
      setPreviewData({
        total: mockCount,
        sample: [
          { name: 'Maria Silva', email: 'maria@email.com', phone: '(11) 99999-0001' },
          { name: 'João Santos', email: 'joao@email.com', phone: '(11) 99999-0002' },
          { name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 99999-0003' },
          { name: 'Pedro Oliveira', email: 'pedro@email.com', phone: '(11) 99999-0004' },
          { name: 'Julia Lima', email: 'julia@email.com', phone: '(11) 99999-0005' },
        ],
      });
      
      setIsLoadingPreview(false);
    }, 1500);
  };

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          🎯 Selecione o Público-Alvo
        </h3>
        <p className="text-gray-600">
          Defina quem receberá esta campanha através de filtros ou seleção manual
        </p>
      </div>

      {/* Tabs de Seleção */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        
        {/* Tab Headers */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            className="flex-1 px-4 py-3 font-semibold text-blue-600 border-b-2 border-blue-600 bg-white"
          >
            <div className="flex items-center justify-center gap-2">
              <Filter size={18} />
              <span>Filtros Automáticos</span>
            </div>
          </button>
          <button
            disabled
            className="flex-1 px-4 py-3 font-semibold text-gray-400 cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-2">
              <Users size={18} />
              <span>Seleção Manual</span>
              <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">Em breve</span>
            </div>
          </button>
        </div>

        {/* Tab Content - Filtros */}
        <div className="p-6 space-y-6">
          
          {/* Filtros Existentes */}
          {data.audience_filters.length > 0 ? (
            <div className="space-y-3">
              {data.audience_filters.map((filter, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Logic Selector (AND/OR) */}
                    {index > 0 && (
                      <select
                        value={filter.logic}
                        onChange={(e) => handleUpdateFilter(index, { logic: e.target.value as any })}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="AND">E</option>
                        <option value="OR">OU</option>
                      </select>
                    )}

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
                        {OPERATORS[AVAILABLE_FIELDS.find(f => f.value === filter.field)?.type || 'text'].map(op => (
                          <option key={op.value} value={op.value}>
                            {op.label}
                          </option>
                        ))}
                      </select>

                      {/* Valor */}
                      {(() => {
                        const fieldType = AVAILABLE_FIELDS.find(f => f.value === filter.field)?.type;
                        
                        if (fieldType === 'select' && SELECT_VALUES[filter.field]) {
                          return (
                            <select
                              value={filter.value}
                              onChange={(e) => handleUpdateFilter(index, { value: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Selecione...</option>
                              {SELECT_VALUES[filter.field].map(val => (
                                <option key={val} value={val}>{val}</option>
                              ))}
                            </select>
                          );
                        }
                        
                        if (fieldType === 'boolean') {
                          return (
                            <select
                              value={filter.value}
                              onChange={(e) => handleUpdateFilter(index, { value: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Selecione...</option>
                              <option value="true">Sim</option>
                              <option value="false">Não</option>
                            </select>
                          );
                        }
                        
                        return (
                          <input
                            type={fieldType === 'number' ? 'number' : fieldType === 'date' ? 'date' : 'text'}
                            value={filter.value}
                            onChange={(e) => handleUpdateFilter(index, { value: e.target.value })}
                            placeholder="Digite o valor..."
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        );
                      })()}
                    </div>

                    {/* Remover */}
                    <button
                      onClick={() => handleRemoveFilter(index)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Filter className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="text-gray-600 font-semibold mb-2">
                Nenhum filtro definido
              </p>
              <p className="text-sm text-gray-500">
                Adicione filtros para segmentar seu público-alvo
              </p>
            </div>
          )}

          {/* Adicionar Filtro */}
          <button
            onClick={handleAddFilter}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 hover:border-blue-500 text-gray-600 hover:text-blue-600 rounded-xl font-semibold transition-all"
          >
            <Plus size={20} />
            Adicionar Filtro
          </button>

        </div>
      </div>

      {/* Preview de Audiência */}
      {data.audience_filters.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Eye size={20} />
              Preview do Público-Alvo
            </h4>
            <button
              onClick={handlePreviewAudience}
              disabled={isLoadingPreview}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {isLoadingPreview ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  <Eye size={18} />
                  Visualizar
                </>
              )}
            </button>
          </div>

          {previewData ? (
            <div className="space-y-4">
              {/* Total */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 font-semibold">
                      Total de destinatários
                    </p>
                    <p className="text-3xl font-bold text-blue-900">
                      {previewData.total}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amostra */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Amostra (primeiros 5 contatos):
                </p>
                <div className="space-y-2">
                  {previewData.sample.map((contact: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {contact.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.email}</p>
                      </div>
                      <p className="text-sm text-gray-500">{contact.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Clique em "Visualizar" para ver quantos contatos serão alcançados
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-purple-50 border border-purple-200 rounded-xl p-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-xl">💡</span>
          </div>
          <div>
            <h4 className="font-bold text-purple-900 mb-1">
              Combine múltiplos filtros
            </h4>
            <p className="text-sm text-purple-700 leading-relaxed">
              Use "E" para filtros que devem ser atendidos simultaneamente (ex: Status = Novo E Origem = Site).
              Use "OU" para alternativas (ex: Série = 1º Ano OU Série = 2º Ano).
            </p>
          </div>
        </div>
      </motion.div>

    </div>
  );
}