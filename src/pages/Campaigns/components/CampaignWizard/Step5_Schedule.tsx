// src/pages/Campaigns/components/CampaignWizard/Step5_Schedule.tsx
// 📅 STEP 5 - AGENDAMENTO

import { motion } from 'framer-motion';
import { Clock, Calendar, Repeat } from 'lucide-react';
import type { RecurringConfig } from '../../types/campaign.types';

interface Step5Props {
  data: {
    schedule_type: 'immediate' | 'scheduled' | 'recurring';
    scheduled_at?: string;
    recurring_config?: RecurringConfig;
  };
  updateData: (updates: any) => void;
}

export default function Step5_Schedule({ data, updateData }: Step5Props) {
  
  const handleScheduleTypeChange = (type: 'immediate' | 'scheduled' | 'recurring') => {
    updateData({
      schedule_type: type,
      scheduled_at: type === 'immediate' ? undefined : data.scheduled_at,
      recurring_config: type !== 'recurring' ? undefined : data.recurring_config || {
        frequency: 'weekly',
        interval: 1,
        end_type: 'never',
      },
    });
  };

  return (
    <div className="space-y-8">
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          📅 Quando Enviar?
        </h3>
        <p className="text-gray-600">
          Defina se a campanha será enviada agora, agendada ou recorrente
        </p>
      </div>

      {/* Opções de Agendamento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Imediato */}
        <motion.button
          onClick={() => handleScheduleTypeChange('immediate')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`p-6 rounded-xl border-2 transition-all ${
            data.schedule_type === 'immediate'
              ? 'border-blue-500 bg-blue-50 shadow-md'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <Clock className="text-white" size={24} />
          </div>
          <h4 className={`font-bold mb-2 ${data.schedule_type === 'immediate' ? 'text-blue-600' : 'text-gray-900'}`}>
            Enviar Agora
          </h4>
          <p className="text-sm text-gray-600">
            A campanha será enviada imediatamente após a criação
          </p>
        </motion.button>

        {/* Agendado */}
        <motion.button
          onClick={() => handleScheduleTypeChange('scheduled')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`p-6 rounded-xl border-2 transition-all ${
            data.schedule_type === 'scheduled'
              ? 'border-blue-500 bg-blue-50 shadow-md'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <Calendar className="text-white" size={24} />
          </div>
          <h4 className={`font-bold mb-2 ${data.schedule_type === 'scheduled' ? 'text-blue-600' : 'text-gray-900'}`}>
            Agendar Envio
          </h4>
          <p className="text-sm text-gray-600">
            Escolha data e hora específicas para o envio
          </p>
        </motion.button>

        {/* Recorrente */}
        <motion.button
          onClick={() => handleScheduleTypeChange('recurring')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`p-6 rounded-xl border-2 transition-all ${
            data.schedule_type === 'recurring'
              ? 'border-blue-500 bg-blue-50 shadow-md'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <Repeat className="text-white" size={24} />
          </div>
          <h4 className={`font-bold mb-2 ${data.schedule_type === 'recurring' ? 'text-blue-600' : 'text-gray-900'}`}>
            Envio Recorrente
          </h4>
          <p className="text-sm text-gray-600">
            Configure envios automáticos periódicos
          </p>
        </motion.button>
      </div>

      {/* Configuração - Agendado */}
      {data.schedule_type === 'scheduled' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-xl p-6"
        >
          <h4 className="text-lg font-bold text-gray-900 mb-4">
            Data e Hora do Envio
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Data *
              </label>
              <input
                type="date"
                value={data.scheduled_at?.split('T')[0] || ''}
                onChange={(e) => {
                  const time = data.scheduled_at?.split('T')[1] || '12:00';
                  updateData({ scheduled_at: `${e.target.value}T${time}` });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hora *
              </label>
              <input
                type="time"
                value={data.scheduled_at?.split('T')[1]?.slice(0, 5) || '12:00'}
                onChange={(e) => {
                  const date = data.scheduled_at?.split('T')[0] || new Date().toISOString().split('T')[0];
                  updateData({ scheduled_at: `${date}T${e.target.value}` });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Configuração - Recorrente */}
      {data.schedule_type === 'recurring' && data.recurring_config && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-xl p-6 space-y-4"
        >
          <h4 className="text-lg font-bold text-gray-900">
            Configuração de Recorrência
          </h4>

          {/* Frequência */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Frequência *
              </label>
              <select
                value={data.recurring_config.frequency}
                onChange={(e) => updateData({
                  recurring_config: { ...data.recurring_config, frequency: e.target.value },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Diariamente</option>
                <option value="weekly">Semanalmente</option>
                <option value="monthly">Mensalmente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Intervalo *
              </label>
              <input
                type="number"
                min="1"
                value={data.recurring_config.interval}
                onChange={(e) => updateData({
                  recurring_config: { ...data.recurring_config, interval: parseInt(e.target.value) },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Fim da Recorrência */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quando Terminar? *
            </label>
            <select
              value={data.recurring_config.end_type}
              onChange={(e) => updateData({
                recurring_config: { ...data.recurring_config, end_type: e.target.value },
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="never">Nunca (até cancelar)</option>
              <option value="after_occurrences">Após X envios</option>
              <option value="on_date">Em data específica</option>
            </select>
          </div>

          {data.recurring_config.end_type === 'after_occurrences' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Número de Envios
              </label>
              <input
                type="number"
                min="1"
                value={data.recurring_config.end_occurrences || 10}
                onChange={(e) => updateData({
                  recurring_config: { ...data.recurring_config, end_occurrences: parseInt(e.target.value) },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {data.recurring_config.end_type === 'on_date' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Data Final
              </label>
              <input
                type="date"
                value={data.recurring_config.end_date || ''}
                onChange={(e) => updateData({
                  recurring_config: { ...data.recurring_config, end_date: e.target.value },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </motion.div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Clock className="text-blue-600 flex-shrink-0" size={24} />
          <div>
            <h4 className="font-bold text-blue-900 mb-1">
              Dica de Agendamento
            </h4>
            <p className="text-sm text-blue-700 leading-relaxed">
              {data.schedule_type === 'immediate' && 'Campanhas imediatas são ideais para comunicados urgentes.'}
              {data.schedule_type === 'scheduled' && 'Agende envios para horários de maior engajamento (geralmente 10h ou 15h).'}
              {data.schedule_type === 'recurring' && 'Campanhas recorrentes são perfeitas para lembretes semanais ou mensais.'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}