// src/pages/Campaigns/components/CampaignWizard/Step6_FollowUp.tsx
// 🔄 STEP 6 - FOLLOW-UPS AUTOMÁTICOS

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Clock, Target, MessageCircle } from 'lucide-react';
import type { FollowUpRule, FollowUpTrigger, MessageContent } from '../../../../types/campaigns/campaign.types';

// ============================================
// TYPES
// ============================================

interface Step6Props {
  data: {
    follow_ups: FollowUpRule[];
    channels: string[];
  };
  updateData: (updates: any) => void;
}

// ============================================
// TRIGGERS CONFIG
// ============================================

const TRIGGERS: Array<{ value: FollowUpTrigger; label: string; description: string; icon: string }> = [
  { 
    value: 'not_opened', 
    label: 'Não Abriu', 
    description: 'Destinatário não abriu a mensagem',
    icon: '📭',
  },
  { 
    value: 'not_clicked', 
    label: 'Não Clicou', 
    description: 'Não clicou em nenhum link',
    icon: '🔗',
  },
  { 
    value: 'not_responded', 
    label: 'Não Respondeu', 
    description: 'Não enviou nenhuma resposta',
    icon: '💬',
  },
  { 
    value: 'responded_negative', 
    label: 'Respondeu Negativamente', 
    description: 'Resposta indicando desinteresse',
    icon: '👎',
  },
];

// ============================================
// COMPONENT
// ============================================

export default function Step6_FollowUp({ data, updateData }: Step6Props) {
  
  // ============================================
  // HANDLERS
  // ============================================

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

  const handleUpdateMessage = (index: number, message: string) => {
    const followUp = data.follow_ups[index];
    const messageContent: MessageContent = {
      whatsapp: { text: message },
      email: {
        subject: `Re: ${followUp.name}`,
        body_html: message,
        body_text: message,
      },
      sms: { text: message.slice(0, 160) },
    };

    handleUpdateFollowUp(index, { message_content: messageContent });
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          🔄 Follow-ups Automáticos
        </h3>
        <p className="text-gray-600">
          Configure mensagens de acompanhamento automático (opcional)
        </p>
      </div>

      {/* Add Button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {data.follow_ups.length === 0 
            ? 'Nenhum follow-up configurado'
            : `${data.follow_ups.length} follow-up(s) configurado(s)`
          }
        </p>
        <button
          onClick={handleAddFollowUp}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
        >
          <Plus size={18} />
          Adicionar Follow-up
        </button>
      </div>

      {/* Lista de Follow-ups */}
      <div className="space-y-4">
        <AnimatePresence>
          {data.follow_ups.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target size={40} className="text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">
                Nenhum Follow-up Configurado
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Follow-ups aumentam o engajamento em até 40%. Adicione mensagens automáticas 
                para contatos que não interagiram com a campanha inicial.
              </p>
              <button
                onClick={handleAddFollowUp}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Criar Primeiro Follow-up
              </button>
            </motion.div>
          ) : (
            data.follow_ups.map((followUp, index) => (
              <motion.div
                key={followUp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center font-bold text-white shadow-md">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={followUp.name}
                      onChange={(e) => handleUpdateFollowUp(index, { name: e.target.value })}
                      className="flex-1 text-lg font-bold text-gray-900 border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors px-2 py-1"
                      placeholder="Nome do follow-up"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Toggle Enable */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={followUp.enabled}
                        onChange={(e) => handleUpdateFollowUp(index, { enabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFollowUp(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remover follow-up"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Config Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  
                  {/* Trigger */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gatilho *
                    </label>
                    <select
                      value={followUp.trigger}
                      onChange={(e) => handleUpdateFollowUp(index, { trigger: e.target.value as FollowUpTrigger })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {TRIGGERS.map((trigger) => (
                        <option key={trigger.value} value={trigger.value}>
                          {trigger.icon} {trigger.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {TRIGGERS.find(t => t.value === followUp.trigger)?.description}
                    </p>
                  </div>

                  {/* Delay */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Aguardar *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={followUp.delay_value}
                        onChange={(e) => handleUpdateFollowUp(index, { delay_value: parseInt(e.target.value) || 1 })}
                        min={1}
                        max={365}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <select
                        value={followUp.delay_unit}
                        onChange={(e) => handleUpdateFollowUp(index, { delay_unit: e.target.value as any })}
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="minutes">Minutos</option>
                        <option value="hours">Horas</option>
                        <option value="days">Dias</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Enviar após{' '}
                      {followUp.delay_value} {followUp.delay_unit === 'minutes' ? 'minuto(s)' :
                       followUp.delay_unit === 'hours' ? 'hora(s)' : 'dia(s)'}
                    </p>
                  </div>
                </div>

                {/* Mensagem */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MessageCircle size={16} className="inline mr-1" />
                    Mensagem do Follow-up *
                  </label>
                  <textarea
                    value={followUp.message_content.whatsapp?.text || ''}
                    onChange={(e) => handleUpdateMessage(index, e.target.value)}
                    rows={5}
                    placeholder="Digite a mensagem que será enviada neste follow-up..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">
                      {followUp.message_content.whatsapp?.text?.length || 0} caracteres
                    </p>
                    <p className="text-xs text-blue-600 font-semibold">
                      Você pode usar variáveis como {'{'}{'{'}'nome'{'}'}{'}'}{'}'}
                    </p>
                  </div>
                </div>

                {/* Timeline Preview */}
                <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">
                        Timeline: 
                        <span className="text-blue-600 ml-2">
                          Envio principal → Aguardar {followUp.delay_value}{' '}
                          {followUp.delay_unit === 'minutes' ? 'minuto(s)' :
                           followUp.delay_unit === 'hours' ? 'hora(s)' : 'dia(s)'} → Follow-up
                        </span>
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Este follow-up será enviado apenas para contatos que{' '}
                        {TRIGGERS.find(t => t.value === followUp.trigger)?.description.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h4 className="font-bold text-green-900 mb-1">Boas Práticas</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Aguarde pelo menos 24h antes do primeiro follow-up</li>
                <li>• Limite a 2-3 follow-ups por campanha</li>
                <li>• Personalize cada mensagem</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-bold text-blue-900 mb-1">Dica</h4>
              <p className="text-sm text-blue-700">
                Follow-ups automáticos podem aumentar sua taxa de conversão em até 40%. 
                Use linguagem amigável e ofereça valor adicional em cada mensagem.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skip Button */}
      <div className="text-center pt-4">
        <p className="text-sm text-gray-500 italic">
          Follow-ups são opcionais. Você pode pular esta etapa se não desejar configurá-los.
        </p>
      </div>
    </div>
  );
}