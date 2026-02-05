// src/pages/Campaigns/components/CampaignWizard/Step3_Channels.tsx
// 📱 STEP 3 - CANAIS DE COMUNICAÇÃO

import { motion } from 'framer-motion';
import { MessageCircle, Mail, MessageSquare, ArrowUp, ArrowDown, CheckCircle2 } from 'lucide-react';
import type { CampaignChannel } from '../../types/campaign.types';

// ============================================
// TYPES
// ============================================

interface Step3Props {
  data: {
    channels: CampaignChannel[];
    channel_priority: CampaignChannel[];
    fallback_enabled: boolean;
  };
  updateData: (updates: any) => void;
}

// ============================================
// CHANNELS CONFIG
// ============================================

const CHANNELS = [
  {
    value: 'whatsapp' as CampaignChannel,
    label: 'WhatsApp',
    icon: MessageCircle,
    color: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    description: 'Envio via WhatsApp Business API',
    features: [
      '✅ Alta taxa de abertura (98%)',
      '✅ Respostas em tempo real',
      '✅ Suporte a mídia e documentos',
      '✅ Confirmação de leitura',
    ],
    limits: 'Custo: R$ 0,10/msg • Limite: 1.000 msg/dia',
  },
  {
    value: 'email' as CampaignChannel,
    label: 'Email',
    icon: Mail,
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    description: 'Email profissional personalizado',
    features: [
      '✅ Conteúdo rico (HTML)',
      '✅ Rastreamento de aberturas',
      '✅ Anexos ilimitados',
      '✅ Templates personalizados',
    ],
    limits: 'Custo: Grátis • Limite: Ilimitado',
  },
  {
    value: 'sms' as CampaignChannel,
    label: 'SMS',
    icon: MessageSquare,
    color: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    description: 'Mensagem de texto simples',
    features: [
      '✅ 100% de entrega',
      '✅ Não precisa internet',
      '✅ Leitura garantida',
      '✅ Alcance universal',
    ],
    limits: 'Custo: R$ 0,15/msg • Limite: 160 caracteres',
  },
];

// ============================================
// COMPONENT
// ============================================

export default function Step3_Channels({ data, updateData }: Step3Props) {
  
  // ============================================
  // HANDLERS
  // ============================================

  const handleToggleChannel = (channel: CampaignChannel) => {
    const isSelected = data.channels.includes(channel);
    
    if (isSelected) {
      // Remover canal
      updateData({
        channels: data.channels.filter(c => c !== channel),
        channel_priority: data.channel_priority.filter(c => c !== channel),
      });
    } else {
      // Adicionar canal
      updateData({
        channels: [...data.channels, channel],
        channel_priority: [...data.channel_priority, channel],
      });
    }
  };

  const handleMovePriority = (channel: CampaignChannel, direction: 'up' | 'down') => {
    const currentIndex = data.channel_priority.indexOf(channel);
    if (currentIndex === -1) return;
    
    const newPriority = [...data.channel_priority];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= newPriority.length) return;
    
    // Trocar posições
    [newPriority[currentIndex], newPriority[newIndex]] = 
    [newPriority[newIndex], newPriority[currentIndex]];
    
    updateData({ channel_priority: newPriority });
  };

  const isChannelSelected = (channel: CampaignChannel) => {
    return data.channels.includes(channel);
  };

  const getChannelPriorityIndex = (channel: CampaignChannel) => {
    return data.channel_priority.indexOf(channel);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          📱 Escolha os Canais de Envio
        </h3>
        <p className="text-gray-600">
          Selecione por quais canais deseja enviar sua campanha
        </p>
      </div>

      {/* Canais Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CHANNELS.map((channel) => {
          const Icon = channel.icon;
          const isSelected = isChannelSelected(channel.value);
          
          return (
            <motion.button
              key={channel.value}
              onClick={() => handleToggleChannel(channel.value)}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                isSelected
                  ? `${channel.border} ${channel.bg} shadow-lg`
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Check Badge */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4"
                >
                  <CheckCircle2 className="text-green-600" size={24} />
                </motion.div>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${channel.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                <Icon size={32} className="text-white" />
              </div>

              {/* Label */}
              <h4 className={`text-xl font-bold mb-2 ${
                isSelected ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {channel.label}
              </h4>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">
                {channel.description}
              </p>

              {/* Features */}
              <div className="space-y-1.5 mb-4">
                {channel.features.map((feature, idx) => (
                  <p key={idx} className="text-xs text-gray-700">
                    {feature}
                  </p>
                ))}
              </div>

              {/* Limits */}
              <div className={`mt-4 pt-4 border-t ${
                isSelected ? 'border-gray-300' : 'border-gray-200'
              }`}>
                <p className="text-xs text-gray-500 font-semibold">
                  {channel.limits}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Ordem de Prioridade */}
      {data.channels.length > 1 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl">🎯</span>
            Ordem de Prioridade
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Defina a ordem em que os canais serão tentados. Se o envio falhar no primeiro canal, 
            o sistema tentará o próximo automaticamente.
          </p>

          <div className="space-y-3">
            {data.channel_priority.map((channelValue, index) => {
              const channel = CHANNELS.find(c => c.value === channelValue);
              if (!channel) return null;

              const Icon = channel.icon;
              const isFirst = index === 0;
              const isLast = index === data.channel_priority.length - 1;

              return (
                <motion.div
                  key={channelValue}
                  layout
                  className="bg-white border-2 border-gray-200 rounded-xl p-4 flex items-center gap-4"
                >
                  {/* Número de Prioridade */}
                  <div className={`w-10 h-10 bg-gradient-to-br ${channel.color} rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-md`}>
                    {index + 1}
                  </div>

                  {/* Icon e Label */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 ${channel.bg} rounded-lg flex items-center justify-center`}>
                      <Icon size={20} className="text-gray-700" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{channel.label}</p>
                      <p className="text-xs text-gray-500">
                        {index === 0 ? 'Canal principal' : `Fallback ${index}`}
                      </p>
                    </div>
                  </div>

                  {/* Botões de Ordenação */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleMovePriority(channelValue, 'up')}
                      disabled={isFirst}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Mover para cima"
                    >
                      <ArrowUp size={18} />
                    </button>
                    <button
                      onClick={() => handleMovePriority(channelValue, 'down')}
                      disabled={isLast}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Mover para baixo"
                    >
                      <ArrowDown size={18} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fallback Toggle */}
      {data.channels.length > 1 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <label className="flex items-start gap-4 cursor-pointer">
            <input
              type="checkbox"
              checked={data.fallback_enabled}
              onChange={(e) => updateData({ fallback_enabled: e.target.checked })}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1">
                Habilitar Fallback Automático
              </h4>
              <p className="text-sm text-gray-600">
                Se ativado, caso o envio falhe no canal principal, o sistema tentará 
                automaticamente enviar pelos próximos canais na ordem de prioridade.
                Isso aumenta a taxa de entrega da sua campanha.
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Warning quando nenhum canal selecionado */}
      {data.channels.length === 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-bold text-red-900 mb-1">
                Nenhum canal selecionado
              </h4>
              <p className="text-sm text-red-700">
                Você precisa selecionar pelo menos um canal de comunicação para continuar.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-bold text-blue-900 mb-1">Dica</h4>
            <p className="text-sm text-blue-700">
              Recomendamos usar WhatsApp como canal principal devido à alta taxa de abertura.
              Email como segundo canal garante que todos sejam atingidos, mesmo sem WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}