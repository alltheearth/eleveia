// src/pages/Campaigns/components/CampaignWizard/Step1_BasicInfo.tsx
// 📝 STEP 1 - INFORMAÇÕES BÁSICAS DA CAMPANHA

import { motion } from 'framer-motion';
import { X, Plus, Tag as TagIcon } from 'lucide-react';
import { useState } from 'react';
import type { CampaignType } from '../../types/campaign.types';

// ============================================
// TYPES
// ============================================

interface Step1Props {
  data: {
    name: string;
    type: CampaignType;
    description: string;
    tags: string[];
  };
  updateData: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
}

// ============================================
// TIPOS DE CAMPANHA
// ============================================

const CAMPAIGN_TYPES: Array<{
  value: CampaignType;
  label: string;
  icon: string;
  description: string;
  color: string;
}> = [
  {
    value: 'matricula',
    label: 'Matrícula',
    icon: '🎓',
    description: 'Captação de novos alunos',
    color: 'from-blue-500 to-blue-600',
  },
  {
    value: 'rematricula',
    label: 'Rematrícula',
    icon: '🔄',
    description: 'Renovação de matrículas',
    color: 'from-green-500 to-green-600',
  },
  {
    value: 'passei_direto',
    label: 'Passei Direto',
    icon: '🎉',
    description: 'Promoção de aprovação',
    color: 'from-purple-500 to-purple-600',
  },
  {
    value: 'reuniao',
    label: 'Reunião',
    icon: '📅',
    description: 'Convocação para reuniões',
    color: 'from-orange-500 to-orange-600',
  },
  {
    value: 'evento',
    label: 'Evento',
    icon: '🎊',
    description: 'Divulgação de eventos',
    color: 'from-pink-500 to-pink-600',
  },
  {
    value: 'cobranca',
    label: 'Cobrança',
    icon: '💰',
    description: 'Lembretes de pagamento',
    color: 'from-red-500 to-red-600',
  },
  {
    value: 'comunicado',
    label: 'Comunicado',
    icon: '📢',
    description: 'Comunicações gerais',
    color: 'from-gray-500 to-gray-600',
  },
];

// ============================================
// COMPONENT
// ============================================

export default function Step1_BasicInfo({
  data,
  updateData,
}: Step1Props) {
  
  const [newTag, setNewTag] = useState('');

  // ============================================
  // HANDLERS
  // ============================================
  
  const handleAddTag = () => {
    if (newTag.trim() && !data.tags.includes(newTag.trim())) {
      updateData({ tags: [...data.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateData({ tags: data.tags.filter(t => t !== tagToRemove) });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          📝 Informações Básicas
        </h3>
        <p className="text-gray-600">
          Defina as informações essenciais da sua campanha de comunicação
        </p>
      </div>

      {/* Nome da Campanha */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nome da Campanha *
        </label>
        <input
          type="text"
          placeholder="Ex: Matrícula 2026 - Ensino Fundamental"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
        />
        <p className="text-xs text-gray-500 mt-1">
          {data.name.length} / 100 caracteres
        </p>
      </div>

      {/* Tipo de Campanha */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Tipo de Campanha *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAMPAIGN_TYPES.map((type) => (
            <motion.button
              key={type.value}
              type="button"
              onClick={() => updateData({ type: type.value })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                data.type === type.value
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center text-2xl shadow-md flex-shrink-0`}>
                  {type.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold mb-1 ${
                    data.type === type.value ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {type.label}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {type.description}
                  </p>
                </div>
              </div>
              
              {/* Checkmark */}
              {data.type === type.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Descrição (Opcional)
        </label>
        <textarea
          placeholder="Descreva o objetivo e contexto desta campanha..."
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          {data.description.length} / 500 caracteres
        </p>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tags (Opcional)
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Adicione uma tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={!newTag.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            Adicionar
          </button>
        </div>

        {/* Tags List */}
        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag) => (
              <motion.div
                key={tag}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200"
              >
                <TagIcon size={14} />
                <span className="text-sm font-semibold">{tag}</span>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="p-0.5 hover:bg-blue-200 rounded-full transition-colors"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-xl">💡</span>
          </div>
          <div>
            <h4 className="font-bold text-blue-900 mb-1">
              Dica para criar uma boa campanha
            </h4>
            <p className="text-sm text-blue-700 leading-relaxed">
              Escolha um nome descritivo que identifique claramente o objetivo da campanha. 
              Use tags para organizar e facilitar a busca no futuro. A descrição ajuda sua 
              equipe a entender o contexto da campanha.
            </p>
          </div>
        </div>
      </motion.div>

    </div>
  );
}