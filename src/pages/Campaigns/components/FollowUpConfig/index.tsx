// src/pages/Campaigns/components/FollowUpConfig/index.tsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, AlertCircle, Info } from 'lucide-react';
import FollowUpRule from './FollowUpRule';
import type { FollowUpRule as FollowUpRuleType } from '../../types/campaign.types';

interface FollowUpConfigProps {
  rules: FollowUpRuleType[];
  onChange: (rules: FollowUpRuleType[]) => void;
  maxRules?: number;
}

export default function FollowUpConfig({
  rules,
  onChange,
  maxRules = 5,
}: FollowUpConfigProps) {
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);

  const handleAddRule = () => {
    const newRule: FollowUpRuleType = {
      id: `rule-${Date.now()}`,
      name: `Follow-up ${rules.length + 1}`,
      trigger: 'not_opened',
      delay_value: 24,
      delay_unit: 'hours',
      message_content: {
        whatsapp: {
          text: '',
        },
      },
      conditions: [],
      enabled: true,
    };

    onChange([...rules, newRule]);
    setExpandedRuleId(newRule.id);
  };

  const handleUpdateRule = (ruleId: string, updates: Partial<FollowUpRuleType>) => {
    onChange(
      rules.map((rule) =>
        rule.id === ruleId ? { ...rule, ...updates } : rule
      )
    );
  };

  const handleDeleteRule = (ruleId: string) => {
    onChange(rules.filter((rule) => rule.id !== ruleId));
    if (expandedRuleId === ruleId) {
      setExpandedRuleId(null);
    }
  };

  const handleDuplicateRule = (rule: FollowUpRuleType) => {
    const duplicatedRule: FollowUpRuleType = {
      ...rule,
      id: `rule-${Date.now()}`,
      name: `${rule.name} (Cópia)`,
    };
    onChange([...rules, duplicatedRule]);
  };

  const handleToggleExpand = (ruleId: string) => {
    setExpandedRuleId(expandedRuleId === ruleId ? null : ruleId);
  };

  const canAddMore = rules.length < maxRules;
  const hasRules = rules.length > 0;

  return (
    <div className="space-y-6">
      {/* Header com informações */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔄</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Follow-ups Automáticos</h3>
              <p className="text-purple-100 text-sm mt-1">
                Configure mensagens automáticas baseadas no comportamento dos destinatários
              </p>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
            <p className="text-xs font-semibold opacity-80">REGRAS ATIVAS</p>
            <p className="text-2xl font-bold">
              {rules.filter(r => r.enabled).length}/{rules.length}
            </p>
          </div>
        </div>

        {/* Info card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3">
          <Info size={20} className="flex-shrink-0 mt-0.5" />
          <div className="text-sm space-y-1">
            <p className="font-medium">Como funcionam os follow-ups?</p>
            <p className="text-purple-100 text-xs leading-relaxed">
              Os follow-ups são mensagens automáticas enviadas quando certas condições são atendidas. 
              Por exemplo: se um destinatário não abrir a mensagem em 24 horas, envie um lembrete automático.
            </p>
          </div>
        </div>
      </div>

      {/* Lista de regras */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {hasRules ? (
            rules.map((rule, index) => (
              <FollowUpRule
                key={rule.id}
                rule={rule}
                index={index}
                isExpanded={expandedRuleId === rule.id}
                onToggleExpand={() => handleToggleExpand(rule.id)}
                onUpdate={(updates) => handleUpdateRule(rule.id, updates)}
                onDelete={() => handleDeleteRule(rule.id)}
                onDuplicate={() => handleDuplicateRule(rule)}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center"
            >
              <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔄</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Nenhum follow-up configurado
              </h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                Crie regras de follow-up para enviar mensagens automáticas baseadas no 
                comportamento dos destinatários e aumentar suas taxas de conversão.
              </p>
              <button
                onClick={handleAddRule}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <Plus size={20} />
                Criar Primeira Regra
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Botão adicionar nova regra */}
      {hasRules && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {canAddMore ? (
            <button
              onClick={handleAddRule}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 flex items-center justify-center gap-2 font-semibold group"
            >
              <div className="w-8 h-8 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center transition-colors">
                <Plus size={20} className="text-purple-600" />
              </div>
              Adicionar Nova Regra de Follow-up
            </button>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Limite de regras atingido
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Você atingiu o limite máximo de {maxRules} regras de follow-up. 
                  Remova uma regra existente para adicionar uma nova.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Estatísticas das regras */}
      {hasRules && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">Regras Ativas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {rules.filter(r => r.enabled).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">⏸️</span>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">Regras Pausadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {rules.filter(r => !r.enabled).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🔄</span>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">Total de Regras</p>
                <p className="text-2xl font-bold text-gray-900">{rules.length}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}