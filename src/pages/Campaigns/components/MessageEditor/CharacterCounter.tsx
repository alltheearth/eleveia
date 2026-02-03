// src/pages/Campaigns/components/MessageEditor/CharacterCounter.tsx
// 🔢 CONTADOR DE CARACTERES

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { CampaignChannel } from '../../types/campaign.types';

// ============================================
// TYPES
// ============================================

interface CharacterCounterProps {
  current: number;
  max: number;
  channel: CampaignChannel;
}

// ============================================
// COMPONENT
// ============================================

export default function CharacterCounter({
  current,
  max,
  channel,
}: CharacterCounterProps) {
  
  // Calcular porcentagem
  const percentage = (current / max) * 100;
  
  // Determinar cor baseado na porcentagem
  const getColor = () => {
    if (percentage >= 100) return 'red';
    if (percentage >= 90) return 'orange';
    if (percentage >= 75) return 'yellow';
    return 'green';
  };

  const color = getColor();

  // Configuração de cores
  const colorConfig = {
    red: {
      text: 'text-red-700',
      bg: 'bg-red-100',
      border: 'border-red-300',
      progress: 'bg-red-500',
      icon: <AlertTriangle size={16} className="text-red-600" />,
    },
    orange: {
      text: 'text-orange-700',
      bg: 'bg-orange-100',
      border: 'border-orange-300',
      progress: 'bg-orange-500',
      icon: <AlertTriangle size={16} className="text-orange-600" />,
    },
    yellow: {
      text: 'text-yellow-700',
      bg: 'bg-yellow-100',
      border: 'border-yellow-300',
      progress: 'bg-yellow-500',
      icon: <AlertTriangle size={16} className="text-yellow-600" />,
    },
    green: {
      text: 'text-green-700',
      bg: 'bg-green-100',
      border: 'border-green-300',
      progress: 'bg-green-500',
      icon: <CheckCircle2 size={16} className="text-green-600" />,
    },
  };

  const config = colorConfig[color];

  // Mensagens de aviso
  const getMessage = () => {
    if (percentage >= 100) {
      return `Limite excedido! Reduza em ${current - max} caracteres.`;
    }
    if (percentage >= 90) {
      return `Quase no limite. Restam ${max - current} caracteres.`;
    }
    if (percentage >= 75) {
      return `Atenção: ${max - current} caracteres restantes.`;
    }
    return `${max - current} caracteres disponíveis.`;
  };

  // Info sobre o canal
  const getChannelInfo = () => {
    switch (channel) {
      case 'sms':
        return 'SMS padrão: 160 caracteres. Acima disso, será enviado como múltiplos SMS.';
      case 'whatsapp':
        return 'WhatsApp: Recomendamos mensagens curtas e objetivas para melhor engajamento.';
      case 'email':
        return 'Email: Sem limite rígido, mas mensagens concisas têm melhor taxa de leitura.';
    }
  };

  return (
    <div className="mt-3 space-y-2">
      
      {/* Counter Display */}
      <div className={`flex items-center justify-between p-3 rounded-lg border ${config.border} ${config.bg}`}>
        <div className="flex items-center gap-2">
          {config.icon}
          <span className={`text-sm font-semibold ${config.text}`}>
            {getMessage()}
          </span>
        </div>
        
        <span className={`text-sm font-bold ${config.text}`}>
          {current} / {max}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          className={`h-full ${config.progress}`}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Channel Info */}
      <p className="text-xs text-gray-500 italic">
        💡 {getChannelInfo()}
      </p>
    </div>
  );
}