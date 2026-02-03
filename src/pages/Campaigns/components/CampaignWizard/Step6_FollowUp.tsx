// src/pages/Campaigns/components/CampaignWizard/Step6_FollowUp.tsx
// 🔄 STEP 6 - FOLLOW-UPS AUTOMÁTICOS

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Clock, Target } from 'lucide-react';
import type { FollowUpRule, FollowUpTrigger } from '../../types/campaign.types';

interface Step6Props {
  data: {
    follow_ups: FollowUpRule[];
    channels: string[];
  };
  updateData: (updates: any) => void;
}

const TRIGGERS: Array<{ value: FollowUpTrigger; label: string; icon: string }> = [
  { value: 'not_opened', label: 'Não Abriu', icon: '📭' },
  { value: 'not_clicked', label: 'Não Clicou', icon: '🔗' },
  { value: 'not_responded', label: 'Não Respondeu', icon: '💬' },
  { value: 'responded_negative', label: 'Respondeu Negativamente', icon: '👎' },
];

export default function Step6_FollowUp({ data, updateData }: Step6Props) {
  
  const handleAddFollowUp = () => {
    const newFollowUp: FollowUpRule = {
      id: `followup-${Date.now()}`,
      name: `Follow-up ${data.follow_ups.length + 1}`,
      trigger: 'not_opened',
      delay_value: 24,
      delay_unit: 'hours',
      message_content: {
        whatsapp: { text: '' },
      },
      enabled: true,
    };
    
    updateData({
      follow_ups: [...data.follow_ups, newFollowUp],
    });
  };

  const handleUpdateFollowUp = (index: number, updates: Partial<FollowUpRule>) => {
    const newFollowUps = [...data.follow_ups];
    newFollowUps[index] = { ...newFollowUps[index], ...updates };
    updateData({ follow_ups: newFollowUps });
  };

  const handleRemoveFollowUp = (index: number) => {
    updateData({
      follow_ups: data.follow_ups.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-8">
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          🔄 Follow-ups Automáticos
        </h3>
        <p className="text-gray-600">
          Configure mensagens automáticas de acompanhamento (opcional)
        </p>
      </div>

      {/* Lista de Follow-ups */}
      <div className="space-y-4">
        <AnimatePresence>
          {data.follow_ups.map((followUp, index) => (
            <motion.div
              key={followUp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white border-2 border-gray-200 rounded-xl p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  value={followUp.name}
                  onChange={(e) => handleUpdateFollowUp(index, { name: e.target.value })}
                  className="text-lg font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                />
                
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={followUp.enabled}
                      onChange={(e) => handleUpdateFollowUp(index, { enabled: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-gray-700">Ativo</span>
                  </label>
                  
                  <button
                    onClick={() => handleRemoveFollowUp(index)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Configuração */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Gatilho */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quando Enviar?
                  </label>
                  <select
                    value={followUp.trigger}
                    onChange={(e) => handleUpdateFollowUp(index, { trigger: e.target.value as FollowUpTrigger })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {TRIGGERS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.icon} {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delay */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Aguardar Quanto Tempo?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      value={followUp.delay_value}
                      onChange={(e) => handleUpdateFollowUp(index, { delay_value: parseInt(e.target.value) })}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={followUp.delay_unit}
                      onChange={(e) => handleUpdateFollowUp(index, { delay_unit: e.target.value as any })}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="minutes">Min</option>
                      <option value="hours">Horas</option>
                      <option value="days">Dias</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Mensagem */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mensagem do Follow-up
                </label>
                <textarea
                  value={followUp.message_content.whatsapp?.text || ''}
                  onChange={(e) => handleUpdateFollowUp(index, {
                    message_content: {
                      ...followUp.message_content,
                      whatsapp: { ...followUp.message_content.whatsapp, text: e.target.value },
                    },
                  })}
                  rows={4}
                  placeholder="Digite a mensagem de follow-up..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Preview da Regra */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Resumo:</strong> Se o destinatário {' '}
                  <strong>{TRIGGERS.find(t => t.value === followUp.trigger)?.label.toLowerCase()}</strong>{' '}
                  após <strong>{followUp.delay_value} {followUp.delay_unit === 'minutes' ? 'minutos' : followUp.delay_unit === 'hours' ? 'horas' : 'dias'}</strong>, 
                  enviar follow-up automaticamente.
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State / Adicionar */}
        {data.follow_ups.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
            <Target className="mx-auto text-gray-400 mb-3" size={48} />
            <p className="text-gray-600 font-semibold mb-2">
              Nenhum follow-up configurado
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Follow-ups aumentam a taxa de resposta em até 40%
            </p>
            <button
              onClick={handleAddFollowUp}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all mx-auto"
            >
              <Plus size={20} />
              Adicionar Primeiro Follow-up
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddFollowUp}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 hover:border-blue-500 text-gray-600 hover:text-blue-600 rounded-xl font-semibold transition-all"
          >
            <Plus size={20} />
            Adicionar Outro Follow-up
          </button>
        )}
      </div>

      {/* Info */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Clock className="text-green-600 flex-shrink-0" size={24} />
          <div>
            <h4 className="font-bold text-green-900 mb-1">
              Boas Práticas de Follow-up
            </h4>
            <ul className="text-sm text-green-700 leading-relaxed space-y-1">
              <li>• Aguarde pelo menos 24 horas antes do primeiro follow-up</li>
              <li>• Use mensagens diferentes em cada follow-up</li>
              <li>• Limite a 2-3 follow-ups para não ser invasivo</li>
              <li>• Personalize a mensagem com base no comportamento</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}