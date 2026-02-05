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
    description: 'Avisos gerais',
    color: 'from-gray-500 to-gray-600',
  },
];

// ============================================
// COMPONENT
// ============================================

export default function Step1_BasicInfo({ data, updateData }: Step1Props) {
  
  const [newTag, setNewTag] = useState('');

  // ============================================
  // HANDLERS
  // ============================================

  const handleAddTag = () => {
    if (newTag.trim() && !data.tags.includes(newTag.trim())) {
      updateData({
        tags: [...data.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateData({
      tags: data.tags.filter(tag => tag !== tagToRemove),
    });
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
          Defina o nome e tipo da campanha que você deseja criar
        </p>
      </div>

      {/* Nome da Campanha */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nome da Campanha *
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
          placeholder="Ex: Campanha de Matrícula 2026"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          maxLength={100}
        />
        <p className="text-xs text-gray-500 mt-1">
          {data.name.length}/100 caracteres
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
                <div className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <span className="text-2xl">{type.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-bold mb-1 ${
                    data.type === type.value ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {type.label}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {type.description}
                  </p>
                </div>
              </div>
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
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
          placeholder="Descreva o objetivo desta campanha..."
          rows={4}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">
          {data.description.length}/500 caracteres
        </p>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tags (Opcional)
        </label>
        
        {/* Input de Nova Tag */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite uma tag e pressione Enter"
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            maxLength={30}
          />
          <button
            onClick={handleAddTag}
            disabled={!newTag.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus size={18} />
            Adicionar
          </button>
        </div>

        {/* Lista de Tags */}
        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-semibold"
              >
                <TagIcon size={14} />
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <X size={14} />
                </button>
              </motion.span>
            ))}
          </div>
        )}

        {data.tags.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            Nenhuma tag adicionada. Use tags para organizar suas campanhas.
          </p>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-bold text-blue-900 mb-1">Dica</h4>
            <p className="text-sm text-blue-700">
              Use um nome descritivo para facilitar a identificação da campanha. 
              As tags ajudam a organizar e filtrar suas campanhas posteriormente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}