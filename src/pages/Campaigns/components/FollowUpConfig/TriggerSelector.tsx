// src/pages/Campaigns/components/FollowUpConfig/TriggerSelector.tsx

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { FollowUpTrigger } from '../../types/campaign.types';

interface TriggerSelectorProps {
  value: FollowUpTrigger;
  onChange: (trigger: FollowUpTrigger) => void;
}

interface TriggerOption {
  value: FollowUpTrigger;
  label: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  example: string;
}

const TRIGGER_OPTIONS: TriggerOption[] = [
  {
    value: 'not_opened',
    label: 'Não Abriu a Mensagem',
    description: 'Quando o destinatário receber mas não abrir a mensagem',
    icon: '📭',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    example: 'Ex: Enviar lembrete se não abrir em 24 horas',
  },
  {
    value: 'not_clicked',
    label: 'Não Clicou em Links',
    description: 'Quando o destinatário abrir mas não clicar em nenhum link',
    icon: '👆',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    example: 'Ex: Reforçar call-to-action após 48 horas',
  },
  {
    value: 'not_responded',
    label: 'Não Respondeu',
    description: 'Quando o destinatário não responder à mensagem',
    icon: '💬',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    example: 'Ex: Perguntar se tem dúvidas após 3 dias',
  },
  {
    value: 'responded_negative',
    label: 'Resposta Negativa',
    description: 'Quando o destinatário responder negativamente',
    icon: '👎',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    example: 'Ex: Oferecer alternativa se recusar proposta',
  },
  {
    value: 'custom',
    label: 'Condições Personalizadas',
    description: 'Defina suas próprias condições de ativação',
    icon: '⚙️',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    example: 'Ex: Combinar múltiplas condições',
  },
];

export default function TriggerSelector({ value, onChange }: TriggerSelectorProps) {
  return (
    <div className="space-y-3">
      {TRIGGER_OPTIONS.map((option) => {
        const isSelected = value === option.value;

        return (
          <motion.button
            key={option.value}
            onClick={() => onChange(option.value)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
              isSelected
                ? `${option.bgColor} ${option.borderColor} shadow-md`
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isSelected ? option.bgColor : 'bg-gray-100'
                }`}
              >
                <span className="text-2xl">{option.icon}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4
                    className={`font-bold text-sm ${
                      isSelected ? option.color : 'text-gray-900'
                    }`}
                  >
                    {option.label}
                  </h4>

                  {/* Checkmark */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`w-6 h-6 rounded-full ${option.bgColor} flex items-center justify-center flex-shrink-0`}
                    >
                      <Check size={14} className={option.color} strokeWidth={3} />
                    </motion.div>
                  )}
                </div>

                <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                  {option.description}
                </p>

                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs ${
                    isSelected
                      ? `${option.bgColor} ${option.color} font-medium`
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <span>💡</span>
                  <span>{option.example}</span>
                </div>
              </div>
            </div>
          </motion.button>
        );
      })}

      {/* Info adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">ℹ️</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-900 mb-1">
              Como escolher o gatilho certo?
            </p>
            <p className="text-xs text-blue-700 leading-relaxed">
              Escolha o gatilho baseado no comportamento que você quer rastrear. Para
              campanhas de conversão, use <strong>"Não Clicou"</strong>. Para lembretes
              simples, use <strong>"Não Abriu"</strong>. Para tratamento de objeções,
              use <strong>"Resposta Negativa"</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}