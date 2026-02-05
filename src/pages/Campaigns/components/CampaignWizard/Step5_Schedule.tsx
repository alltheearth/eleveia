// src/pages/Campaigns/components/CampaignWizard/Step5_Schedule.tsx
// 📅 STEP 5 - AGENDAMENTO

import { motion } from 'framer-motion';
import { Clock, Calendar, Repeat, Zap } from 'lucide-react';
import type { RecurringConfig } from '../../types/campaign.types';

// ============================================
// TYPES
// ============================================

interface Step5Props {
  data: {
    schedule_type: 'immediate' | 'scheduled' | 'recurring';
    scheduled_at?: string;
    recurring_config?: RecurringConfig;
  };
  updateData: (updates: any) => void;
}

// ============================================
// COMPONENT
// ============================================

export default function Step5_Schedule({ data, updateData }: Step5Props) {
  
  // ============================================
  // HANDLERS
  // ============================================

  const handleScheduleTypeChange = (type: 'immediate' | 'scheduled' | 'recurring') => {
    updateData({
      schedule_type: type,
      scheduled_at: type === 'immediate' ? undefined : data.scheduled_at || new Date().toISOString().slice(0, 16),
      recurring_config: type !== 'recurring' ? undefined : data.recurring_config || {
        frequency: 'weekly',
        interval: 1,
        end_type: 'never',
      },
    });
  };

  const handleRecurringUpdate = (updates: Partial<RecurringConfig>) => {
    updateData({
      recurring_config: {
        ...data.recurring_config,
        ...updates,
      },
    });
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          📅 Quando Enviar?
        </h3>
        <p className="text-gray-600">
          Defina quando sua campanha será enviada
        </p>
      </div>

      {/* Opções de Agendamento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Imediato */}
        <motion.button
          onClick={() => handleScheduleTypeChange('immediate')}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          className={`p-6 rounded-2xl border-2 transition-all text-left ${
            data.schedule_type === 'immediate'
              ? 'border-red-500 bg-red-50 shadow-lg'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className={`w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-md ${
            data.schedule_type === 'immediate' ? 'shadow-red-200 shadow-lg' : ''
          }`}>
            <Zap className="text-white" size={28} />
          </div>
          <h4 className={`text-lg font-bold mb-2 ${
            data.schedule_type === 'immediate' ? 'text-red-900' : 'text-gray-900'
          }`}>
            Enviar Agora
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            A campanha será enviada imediatamente após a criação
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={14} />
            Início imediato
          </div>
        </motion.button>

        {/* Agendado */}
        <motion.button
          onClick={() => handleScheduleTypeChange('scheduled')}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          className={`p-6 rounded-2xl border-2 transition-all text-left ${
            data.schedule_type === 'scheduled'
              ? 'border-blue-500 bg-blue-50 shadow-lg'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className={`w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-md ${
            data.schedule_type === 'scheduled' ? 'shadow-blue-200 shadow-lg' : ''
          }`}>
            <Calendar className="text-white" size={28} />
          </div>
          <h4 className={`text-lg font-bold mb-2 ${
            data.schedule_type === 'scheduled' ? 'text-blue-900' : 'text-gray-900'
          }`}>
            Agendar
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            Escolha uma data e hora específica para o envio
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={14} />
            Data personalizada
          </div>
        </motion.button>

        {/* Recorrente */}
        <motion.button
          onClick={() => handleScheduleTypeChange('recurring')}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          className={`p-6 rounded-2xl border-2 transition-all text-left ${
            data.schedule_type === 'recurring'
              ? 'border-purple-500 bg-purple-50 shadow-lg'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className={`w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-md ${
            data.schedule_type === 'recurring' ? 'shadow-purple-200 shadow-lg' : ''
          }`}>
            <Repeat className="text-white" size={28} />
          </div>
          <h4 className={`text-lg font-bold mb-2 ${
            data.schedule_type === 'recurring' ? 'text-purple-900' : 'text-gray-900'
          }`}>
            Recorrente
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            Configure envios automáticos periódicos
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Repeat size={14} />
            Automático
          </div>
        </motion.button>
      </div>

      {/* Configuração - Agendado */}
      {data.schedule_type === 'scheduled' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6"
        >
          <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Configure a Data e Hora
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-2">
                Data e Hora do Envio *
              </label>
              <input
                type="datetime-local"
                value={data.scheduled_at || ''}
                onChange={(e) => updateData({ scheduled_at: e.target.value })}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="bg-white/50 rounded-xl p-4 border border-blue-200">
              <p className="text-xs text-blue-800 font-semibold mb-2">ℹ️ Informações</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• A campanha será enviada automaticamente no horário escolhido</li>
                <li>• Você pode editar ou cancelar antes do envio</li>
                <li>• Recomendamos horários comerciais para melhor abertura</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Configuração - Recorrente */}
      {data.schedule_type === 'recurring' && data.recurring_config && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-6 space-y-6"
        >
          <h4 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
            <Repeat size={20} />
            Configure a Recorrência
          </h4>

          {/* Frequência */}
          <div>
            <label className="block text-sm font-semibold text-purple-900 mb-2">
              Frequência *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'daily', label: 'Diária', icon: '📅' },
                { value: 'weekly', label: 'Semanal', icon: '📆' },
                { value: 'monthly', label: 'Mensal', icon: '🗓️' },
              ].map((freq) => (
                <button
                  key={freq.value}
                  onClick={() => handleRecurringUpdate({ frequency: freq.value as any })}
                  className={`p-3 rounded-xl border-2 font-semibold transition-all ${
                    data.recurring_config?.frequency === freq.value
                      ? 'border-purple-500 bg-white shadow-md'
                      : 'border-purple-200 bg-white/50 hover:border-purple-300'
                  }`}
                >
                  <span className="text-2xl block mb-1">{freq.icon}</span>
                  <span className="text-sm">{freq.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Intervalo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-purple-900 mb-2">
                Repetir a cada
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={data.recurring_config.interval}
                  onChange={(e) => handleRecurringUpdate({ interval: parseInt(e.target.value) || 1 })}
                  min={1}
                  max={30}
                  className="flex-1 px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                />
                <span className="text-sm font-semibold text-purple-900">
                  {data.recurring_config.frequency === 'daily' ? 'dia(s)' :
                   data.recurring_config.frequency === 'weekly' ? 'semana(s)' :
                   'mês(es)'}
                </span>
              </div>
            </div>

            {/* Data de Início */}
            <div>
              <label className="block text-sm font-semibold text-purple-900 mb-2">
                Primeira Ocorrência
              </label>
              <input
                type="datetime-local"
                value={data.scheduled_at || ''}
                onChange={(e) => updateData({ scheduled_at: e.target.value })}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              />
            </div>
          </div>

          {/* Dias da Semana (apenas para semanal) */}
          {data.recurring_config.frequency === 'weekly' && (
            <div>
              <label className="block text-sm font-semibold text-purple-900 mb-3">
                Dias da Semana
              </label>
              <div className="grid grid-cols-7 gap-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => {
                  const isSelected = data.recurring_config?.days_of_week?.includes(index);
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        const current = data.recurring_config?.days_of_week || [];
                        const updated = isSelected
                          ? current.filter(d => d !== index)
                          : [...current, index];
                        handleRecurringUpdate({ days_of_week: updated });
                      }}
                      className={`p-3 rounded-xl border-2 font-bold text-sm transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500 text-white shadow-md'
                          : 'border-purple-200 bg-white text-purple-700 hover:border-purple-300'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Término */}
          <div>
            <label className="block text-sm font-semibold text-purple-900 mb-3">
              Término da Recorrência
            </label>
            <div className="space-y-3">
              {/* Nunca */}
              <label className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-purple-200 cursor-pointer hover:border-purple-300 transition-all">
                <input
                  type="radio"
                  checked={data.recurring_config.end_type === 'never'}
                  onChange={() => handleRecurringUpdate({ end_type: 'never' })}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="font-semibold text-gray-900">Nunca terminar</span>
              </label>

              {/* Após X ocorrências */}
              <label className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-purple-200 cursor-pointer hover:border-purple-300 transition-all">
                <input
                  type="radio"
                  checked={data.recurring_config.end_type === 'after_occurrences'}
                  onChange={() => handleRecurringUpdate({ end_type: 'after_occurrences', end_occurrences: 10 })}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="font-semibold text-gray-900">Após</span>
                {data.recurring_config.end_type === 'after_occurrences' && (
                  <input
                    type="number"
                    value={data.recurring_config.end_occurrences || 10}
                    onChange={(e) => handleRecurringUpdate({ end_occurrences: parseInt(e.target.value) || 10 })}
                    min={1}
                    max={100}
                    className="w-20 px-2 py-1 border border-purple-300 rounded-lg text-center"
                  />
                )}
                <span className="text-sm text-gray-600">ocorrências</span>
              </label>

              {/* Em uma data */}
              <label className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-purple-200 cursor-pointer hover:border-purple-300 transition-all">
                <input
                  type="radio"
                  checked={data.recurring_config.end_type === 'on_date'}
                  onChange={() => handleRecurringUpdate({ end_type: 'on_date', end_date: new Date().toISOString().slice(0, 10) })}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="font-semibold text-gray-900">Em</span>
                {data.recurring_config.end_type === 'on_date' && (
                  <input
                    type="date"
                    value={data.recurring_config.end_date || ''}
                    onChange={(e) => handleRecurringUpdate({ end_date: e.target.value })}
                    min={new Date().toISOString().slice(0, 10)}
                    className="px-3 py-1 border border-purple-300 rounded-lg"
                  />
                )}
              </label>
            </div>
          </div>
        </motion.div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-bold text-blue-900 mb-1">Dica</h4>
            <p className="text-sm text-blue-700">
              {data.schedule_type === 'immediate' && 'O envio imediato é ideal para comunicados urgentes.'}
              {data.schedule_type === 'scheduled' && 'Agende sua campanha para horários de pico de engajamento (9h-11h ou 14h-16h).'}
              {data.schedule_type === 'recurring' && 'Campanhas recorrentes são perfeitas para lembretes regulares de rematrícula ou mensalidades.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}