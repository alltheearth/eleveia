// src/pages/Campaigns/components/CampaignWizard/Step3_Channels.tsx
// 📱 STEP 3 - CANAIS DE COMUNICAÇÃO

import { motion } from 'framer-motion';
import { MessageCircle, Mail, MessageSquare, ArrowRight } from 'lucide-react';
import type { CampaignChannel } from '../../types/campaign.types';

interface Step3Props {
  data: {
    channels: CampaignChannel[];
    channel_priority: CampaignChannel[];
    fallback_enabled: boolean;
  };
  updateData: (updates: any) => void;
}

const CHANNELS = [
  {
    value: 'whatsapp' as CampaignChannel,
    label: 'WhatsApp',
    icon: MessageCircle,
    color: 'from-green-500 to-green-600',
    description: 'Envio via WhatsApp Business API',
    features: ['✅ Alta taxa de abertura', '✅ Respostas rápidas', '✅ Mídia e documentos'],
  },
  {
    value: 'email' as CampaignChannel,
    label: 'Email',
    icon: Mail,
    color: 'from-blue-500 to-blue-600',
    description: 'Email profissional personalizado',
    features: ['✅ Conteúdo rico (HTML)', '✅ Rastreamento de aberturas', '✅ Anexos ilimitados'],
  },
  {
    value: 'sms' as CampaignChannel,
    label: 'SMS',
    icon: MessageSquare,
    color: 'from-purple-500 to-purple-600',
    description: 'Mensagem de texto simples',
    features: ['✅ 100% de entrega', '✅ Não precisa internet', '✅ Leitura garantida'],
  },
];

export default function Step3_Channels({ data, updateData }: Step3Props) {
  
  const handleToggleChannel = (channel: CampaignChannel) => {
    const isSelected = data.channels.includes(channel);
    
    if (isSelected) {
      updateData({
        channels: data.channels.filter(c => c !== channel),
        channel_priority: data.channel_priority.filter(c => c !== channel),
      });
    } else {
      updateData({
        channels: [...data.channels, channel],
        channel_priority: [...data.channel_priority, channel],
      });
    }
  };

  const handleReorderPriority = (channel: CampaignChannel, direction: 'up' | 'down') => {
    const currentIndex = data.channel_priority.indexOf(channel);
    if (currentIndex === -1) return;
    
    const newPriority = [...data.channel_priority];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= newPriority.length) return;
    
    [newPriority[currentIndex], newPriority[newIndex]] = [newPriority[newIndex], newPriority[currentIndex]];
    
    updateData({ channel_priority: newPriority });
  };

  return (
    <div className="space-y-8">
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          📱 Canais de Comunicação
        </h3>
        <p className="text-gray-600">
          Escolha por quais canais a campanha será enviada
        </p>
      </div>

      {/* Seleção de Canais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CHANNELS.map((channel) => {
          const isSelected = data.channels.includes(channel.value);
          const Icon = channel.icon;

          return (
            <motion.button
              key={channel.value}
              onClick={() => handleToggleChannel(channel.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-xl border-2 transition-all text-left relative ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${channel.color} rounded-xl flex items-center justify-center shadow-md`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold mb-1 ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                    {channel.label}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {channel.description}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-1">
                {channel.features.map((feature, i) => (
                  <p key={i} className="text-xs text-gray-600">
                    {feature}
                  </p>
                ))}
              </div>

              {/* Checkmark */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Prioridade de Canais */}
      {data.channels.length > 1 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">
            Ordem de Prioridade
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Defina a ordem em que os canais serão utilizados
          </p>

          <div className="space-y-2">
            {data.channel_priority.map((channel, index) => {
              const channelInfo = CHANNELS.find(c => c.value === channel);
              if (!channelInfo) return null;
              
              const Icon = channelInfo.icon;

              return (
                <div
                  key={channel}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <span className="text-2xl font-bold text-gray-400">
                    {index + 1}º
                  </span>
                  
                  <div className={`w-10 h-10 bg-gradient-to-br ${channelInfo.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="text-white" size={20} />
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{channelInfo.label}</p>
                    <p className="text-xs text-gray-500">{channelInfo.description}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReorderPriority(channel, 'up')}
                      disabled={index === 0}
                      className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-30"
                    >
                      ⬆️
                    </button>
                    <button
                      onClick={() => handleReorderPriority(channel, 'down')}
                      disabled={index === data.channel_priority.length - 1}
                      className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-30"
                    >
                      ⬇️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fallback */}
      {data.channels.length > 1 && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              checked={data.fallback_enabled}
              onChange={(e) => updateData({ fallback_enabled: e.target.checked })}
              className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex-1">
              <h4 className="font-bold text-orange-900 mb-1">
                Ativar Envio em Cascata (Fallback)
              </h4>
              <p className="text-sm text-orange-700 leading-relaxed mb-2">
                Se o primeiro canal falhar, o sistema tentará automaticamente o próximo canal da lista
              </p>
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <span className="font-semibold">Exemplo:</span>
                <span>WhatsApp</span>
                <ArrowRight size={16} />
                <span>Email</span>
                <ArrowRight size={16} />
                <span>SMS</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}