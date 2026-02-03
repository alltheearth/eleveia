// src/pages/Campaigns/components/FollowUpConfig/FollowUpRule.tsx

import { motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Copy,
  Power,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import { useState } from 'react';
import TriggerSelector from './TriggerSelector';
import DelayConfig from './DelayConfig';
import ConditionsBuilder from './ConditionsBuilder';
import type { FollowUpRule as FollowUpRuleType } from '../../types/campaign.types';

interface FollowUpRuleProps {
  rule: FollowUpRuleType;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (updates: Partial<FollowUpRuleType>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

const TRIGGER_LABELS = {
  not_opened: {
    label: 'Não Abriu',
    description: 'Quando o destinatário não abrir a mensagem',
    icon: '📭',
    color: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  not_clicked: {
    label: 'Não Clicou',
    description: 'Quando o destinatário não clicar em nenhum link',
    icon: '👆',
    color: 'from-orange-500 to-orange-600',
    bgLight: 'bg-orange-50',
    textColor: 'text-orange-700',
  },
  not_responded: {
    label: 'Não Respondeu',
    description: 'Quando o destinatário não responder',
    icon: '💬',
    color: 'from-purple-500 to-purple-600',
    bgLight: 'bg-purple-50',
    textColor: 'text-purple-700',
  },
  responded_negative: {
    label: 'Resposta Negativa',
    description: 'Quando o destinatário responder negativamente',
    icon: '👎',
    color: 'from-red-500 to-red-600',
    bgLight: 'bg-red-50',
    textColor: 'text-red-700',
  },
  custom: {
    label: 'Personalizado',
    description: 'Condições personalizadas',
    icon: '⚙️',
    color: 'from-gray-500 to-gray-600',
    bgLight: 'bg-gray-50',
    textColor: 'text-gray-700',
  },
};

export default function FollowUpRule({
  rule,
  index,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onDelete,
  onDuplicate,
}: FollowUpRuleProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(rule.name);

  const triggerConfig = TRIGGER_LABELS[rule.trigger];

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdate({ name: tempName.trim() });
      setIsEditingName(false);
    }
  };

  const handleCancelEditName = () => {
    setTempName(rule.name);
    setIsEditingName(false);
  };

  const handleToggleEnabled = () => {
    onUpdate({ enabled: !rule.enabled });
  };

  const delayText = `${rule.delay_value} ${
    rule.delay_unit === 'minutes'
      ? rule.delay_value === 1
        ? 'minuto'
        : 'minutos'
      : rule.delay_unit === 'hours'
      ? rule.delay_value === 1
        ? 'hora'
        : 'horas'
      : rule.delay_value === 1
      ? 'dia'
      : 'dias'
  }`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden transition-all duration-200 ${
        isExpanded
          ? 'border-purple-200 shadow-lg'
          : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      {/* Header da regra */}
      <div
        className={`bg-gradient-to-r ${triggerConfig.color} p-5 cursor-pointer`}
        onClick={onToggleExpand}
      >
        <div className="flex items-center justify-between">
          {/* Info principal */}
          <div className="flex items-center gap-4 flex-1">
            {/* Número da regra */}
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white font-bold text-lg">
              #{index + 1}
            </div>

            {/* Ícone e nome */}
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                {triggerConfig.icon}
              </div>

              <div className="flex-1">
                {isEditingName ? (
                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName();
                        if (e.key === 'Escape') handleCancelEditName();
                      }}
                      className="flex-1 px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Nome da regra"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <Check size={16} className="text-white" />
                    </button>
                    <button
                      onClick={handleCancelEditName}
                      className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-white">{rule.name}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditingName(true);
                      }}
                      className="p-1 hover:bg-white/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Edit2 size={14} className="text-white" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-white/90 font-medium">
                    {triggerConfig.description}
                  </span>
                  <span className="text-sm text-white/70">•</span>
                  <span className="text-sm text-white/70">Aguardar {delayText}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ações e status */}
          <div className="flex items-center gap-2">
            {/* Status toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleEnabled();
              }}
              className={`p-2 rounded-lg transition-all ${
                rule.enabled
                  ? 'bg-white/20 text-white hover:bg-white/30'
                  : 'bg-white/10 text-white/50 hover:bg-white/20'
              }`}
              title={rule.enabled ? 'Desativar regra' : 'Ativar regra'}
            >
              <Power size={18} />
            </button>

            {/* Duplicate */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all"
              title="Duplicar regra"
            >
              <Copy size={18} />
            </button>

            {/* Delete */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (
                  window.confirm(
                    `Tem certeza que deseja excluir a regra "${rule.name}"?`
                  )
                ) {
                  onDelete();
                }
              }}
              className="p-2 bg-white/20 hover:bg-red-500 rounded-lg text-white transition-all"
              title="Excluir regra"
            >
              <Trash2 size={18} />
            </button>

            {/* Expand icon */}
            <div className="ml-2">
              {isExpanded ? (
                <ChevronUp size={20} className="text-white" />
              ) : (
                <ChevronDown size={20} className="text-white" />
              )}
            </div>
          </div>
        </div>

        {/* Badge de status */}
        {!rule.enabled && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            <span className="text-xs font-semibold text-white">Regra Pausada</span>
          </div>
        )}
      </div>

      {/* Conteúdo expandido */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 space-y-6 bg-gray-50"
        >
          {/* Trigger Selector */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              🎯 Gatilho de Ativação
            </label>
            <TriggerSelector
              value={rule.trigger}
              onChange={(trigger) => onUpdate({ trigger })}
            />
          </div>

          {/* Delay Config */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              ⏱️ Tempo de Espera
            </label>
            <DelayConfig
              value={rule.delay_value}
              unit={rule.delay_unit}
              onValueChange={(delay_value) => onUpdate({ delay_value })}
              onUnitChange={(delay_unit) => onUpdate({ delay_unit })}
            />
          </div>

          {/* Conditions Builder */}
          {rule.trigger === 'custom' && (
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                🎛️ Condições Personalizadas
              </label>
              <ConditionsBuilder
                conditions={rule.conditions || []}
                onChange={(conditions) => onUpdate({ conditions })}
              />
            </div>
          )}

          {/* Message Content Preview */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              💬 Mensagem de Follow-up
            </label>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              {rule.message_content.whatsapp?.text ? (
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-semibold">
                    Preview da mensagem:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {rule.message_content.whatsapp.text}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">💬</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Nenhuma mensagem configurada
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Configure a mensagem no editor de conteúdo
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-purple-900 mb-2">
              📋 Resumo da Regra
            </p>
            <p className="text-sm text-purple-700 leading-relaxed">
              {rule.enabled ? '✅' : '⏸️'} Esta regra{' '}
              {rule.enabled ? 'enviará' : 'não enviará'} automaticamente uma mensagem{' '}
              <strong>{delayText}</strong> após a campanha inicial, quando o
              destinatário <strong>{triggerConfig.description.toLowerCase()}</strong>
              {rule.conditions && rule.conditions.length > 0 && (
                <span> e atender às condições personalizadas definidas</span>
              )}
              .
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}