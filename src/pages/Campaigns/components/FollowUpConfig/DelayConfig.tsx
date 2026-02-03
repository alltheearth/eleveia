// src/pages/Campaigns/components/FollowUpConfig/DelayConfig.tsx

import { motion } from 'framer-motion';
import { Clock, AlertCircle } from 'lucide-react';

interface DelayConfigProps {
  value: number;
  unit: 'minutes' | 'hours' | 'days';
  onValueChange: (value: number) => void;
  onUnitChange: (unit: 'minutes' | 'hours' | 'days') => void;
}

interface PresetOption {
  value: number;
  unit: 'minutes' | 'hours' | 'days';
  label: string;
  description: string;
  icon: string;
  recommended?: boolean;
}

const PRESET_OPTIONS: PresetOption[] = [
  {
    value: 30,
    unit: 'minutes',
    label: '30 Minutos',
    description: 'Resposta rápida',
    icon: '⚡',
  },
  {
    value: 2,
    unit: 'hours',
    label: '2 Horas',
    description: 'Mesmo dia',
    icon: '🕐',
  },
  {
    value: 24,
    unit: 'hours',
    label: '24 Horas',
    description: 'Lembrete diário',
    icon: '📅',
    recommended: true,
  },
  {
    value: 2,
    unit: 'days',
    label: '2 Dias',
    description: 'Intervalo moderado',
    icon: '📆',
  },
  {
    value: 7,
    unit: 'days',
    label: '1 Semana',
    description: 'Follow-up semanal',
    icon: '🗓️',
  },
];

const UNIT_LABELS = {
  minutes: 'Minutos',
  hours: 'Horas',
  days: 'Dias',
};

const UNIT_LIMITS = {
  minutes: { min: 1, max: 1440, step: 5 }, // 1 min - 24 horas
  hours: { min: 1, max: 168, step: 1 }, // 1 hora - 7 dias
  days: { min: 1, max: 30, step: 1 }, // 1 dia - 30 dias
};

export default function DelayConfig({
  value,
  unit,
  onValueChange,
  onUnitChange,
}: DelayConfigProps) {
  const limits = UNIT_LIMITS[unit];

  const handlePresetClick = (preset: PresetOption) => {
    onValueChange(preset.value);
    onUnitChange(preset.unit);
  };

  const handleValueChange = (newValue: number) => {
    const clampedValue = Math.max(limits.min, Math.min(limits.max, newValue));
    onValueChange(clampedValue);
  };

  const isPresetActive = (preset: PresetOption) => {
    return preset.value === value && preset.unit === unit;
  };

  // Calculate total in hours for display
  const getTotalHours = () => {
    if (unit === 'minutes') return value / 60;
    if (unit === 'hours') return value;
    return value * 24;
  };

  const getRecommendationMessage = () => {
    const hours = getTotalHours();
    if (hours < 1) {
      return {
        type: 'warning',
        message: 'Delay muito curto - pode parecer spam',
        icon: '⚠️',
      };
    }
    if (hours < 24) {
      return {
        type: 'info',
        message: 'Bom para respostas urgentes',
        icon: 'ℹ️',
      };
    }
    if (hours <= 48) {
      return {
        type: 'success',
        message: 'Delay recomendado para follow-ups',
        icon: '✅',
      };
    }
    if (hours <= 168) {
      return {
        type: 'info',
        message: 'Bom para campanhas menos urgentes',
        icon: 'ℹ️',
      };
    }
    return {
      type: 'warning',
      message: 'Delay longo - pode perder relevância',
      icon: '⚠️',
    };
  };

  const recommendation = getRecommendationMessage();

  return (
    <div className="space-y-4">
      {/* Presets rápidos */}
      <div>
        <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">
          Tempos Pré-definidos
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {PRESET_OPTIONS.map((preset) => {
            const isActive = isPresetActive(preset);

            return (
              <motion.button
                key={`${preset.value}-${preset.unit}`}
                onClick={() => handlePresetClick(preset)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-3 rounded-xl border-2 transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-50 border-purple-300 shadow-md'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                {preset.recommended && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xs">⭐</span>
                  </div>
                )}

                <div className="text-center">
                  <div className="text-2xl mb-1">{preset.icon}</div>
                  <p
                    className={`text-xs font-bold mb-0.5 ${
                      isActive ? 'text-purple-700' : 'text-gray-900'
                    }`}
                  >
                    {preset.label}
                  </p>
                  <p className="text-xs text-gray-500">{preset.description}</p>
                </div>

                {isActive && (
                  <motion.div
                    layoutId="active-preset"
                    className="absolute inset-0 border-2 border-purple-500 rounded-xl"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Configuração customizada */}
      <div>
        <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">
          Configuração Personalizada
        </p>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input de valor */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Quantidade
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={value}
                  onChange={(e) => handleValueChange(Number(e.target.value))}
                  min={limits.min}
                  max={limits.max}
                  step={limits.step}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-bold text-gray-900"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Clock size={20} className="text-gray-400" />
                </div>
              </div>

              {/* Range input */}
              <input
                type="range"
                value={value}
                onChange={(e) => handleValueChange(Number(e.target.value))}
                min={limits.min}
                max={limits.max}
                step={limits.step}
                className="w-full mt-3 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />

              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>
                  Min: {limits.min} {UNIT_LABELS[unit].toLowerCase()}
                </span>
                <span>
                  Max: {limits.max} {UNIT_LABELS[unit].toLowerCase()}
                </span>
              </div>
            </div>

            {/* Seletor de unidade */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Unidade de Tempo
              </label>
              <div className="space-y-2">
                {(Object.keys(UNIT_LABELS) as Array<keyof typeof UNIT_LABELS>).map(
                  (unitOption) => (
                    <motion.button
                      key={unitOption}
                      onClick={() => onUnitChange(unitOption)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full px-4 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all duration-200 ${
                        unit === unitOption
                          ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-sm'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {UNIT_LABELS[unitOption]}
                    </motion.button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Summary e recomendação */}
          <div className="mt-5 pt-5 border-t border-gray-200 space-y-3">
            {/* Summary */}
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <p className="text-xs text-purple-600 font-semibold mb-1">
                TEMPO DE ESPERA
              </p>
              <p className="text-3xl font-bold text-purple-900">
                {value}{' '}
                <span className="text-xl">
                  {unit === 'minutes'
                    ? value === 1
                      ? 'minuto'
                      : 'minutos'
                    : unit === 'hours'
                    ? value === 1
                      ? 'hora'
                      : 'horas'
                    : value === 1
                    ? 'dia'
                    : 'dias'}
                </span>
              </p>
              <p className="text-xs text-purple-600 mt-2">
                ≈ {getTotalHours().toFixed(1)} horas
              </p>
            </div>

            {/* Recomendação */}
            <div
              className={`rounded-xl p-3 flex items-start gap-3 ${
                recommendation.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : recommendation.type === 'warning'
                  ? 'bg-amber-50 border border-amber-200'
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <span className="text-lg flex-shrink-0">{recommendation.icon}</span>
              <div className="flex-1">
                <p
                  className={`text-xs font-semibold ${
                    recommendation.type === 'success'
                      ? 'text-green-900'
                      : recommendation.type === 'warning'
                      ? 'text-amber-900'
                      : 'text-blue-900'
                  }`}
                >
                  {recommendation.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info adicional */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-gray-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              💡 Dica de timing
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Para campanhas de matrícula e eventos urgentes, use 24-48 horas. Para
              nutrição de leads e relacionamento, use 3-7 dias. Evite delays muito
              curtos (&lt;1 hora) para não parecer spam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}