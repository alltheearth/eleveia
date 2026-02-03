// src/pages/Campaigns/components/CampaignWizard/Step4_Message.tsx
// ✉️ STEP 4 - EDITOR DE MENSAGENS

import { motion } from 'framer-motion';
import { MessageCircle, Mail, MessageSquare, Eye, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { MessageContent, CampaignChannel } from '../../types/campaign.types';

interface Step4Props {
  data: {
    channels: CampaignChannel[];
    message_content: MessageContent;
    message_template_id?: number;
  };
  updateData: (updates: any) => void;
}

const VARIABLES = [
  { key: '{{nome}}', label: 'Nome do destinatário' },
  { key: '{{escola}}', label: 'Nome da escola' },
  { key: '{{serie}}', label: 'Série de interesse' },
  { key: '{{data}}', label: 'Data atual' },
];

export default function Step4_Message({ data, updateData }: Step4Props) {
  
  const [activeChannel, setActiveChannel] = useState<CampaignChannel>(data.channels[0]);
  const [showPreview, setShowPreview] = useState(false);

  const insertVariable = (variable: string, channel: CampaignChannel) => {
    if (channel === 'whatsapp') {
      const currentText = data.message_content.whatsapp?.text || '';
      updateData({
        message_content: {
          ...data.message_content,
          whatsapp: {
            ...data.message_content.whatsapp,
            text: currentText + variable,
          },
        },
      });
    } else if (channel === 'email') {
      const currentBody = data.message_content.email?.body_html || '';
      updateData({
        message_content: {
          ...data.message_content,
          email: {
            ...data.message_content.email,
            body_html: currentBody + variable,
          },
        },
      });
    } else if (channel === 'sms') {
      const currentText = data.message_content.sms?.text || '';
      updateData({
        message_content: {
          ...data.message_content,
          sms: {
            ...data.message_content.sms,
            text: currentText + variable,
          },
        },
      });
    }
  };

  const renderPreview = (channel: CampaignChannel) => {
    let content = '';
    
    if (channel === 'whatsapp') {
      content = data.message_content.whatsapp?.text || '';
    } else if (channel === 'email') {
      content = data.message_content.email?.body_html || '';
    } else if (channel === 'sms') {
      content = data.message_content.sms?.text || '';
    }

    // Substituir variáveis por valores de exemplo
    const preview = content
      .replace(/{{nome}}/g, 'Maria Silva')
      .replace(/{{escola}}/g, 'Escola ABC')
      .replace(/{{serie}}/g, '1º Ano')
      .replace(/{{data}}/g, new Date().toLocaleDateString('pt-BR'));

    return preview;
  };

  return (
    <div className="space-y-8">
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          ✉️ Crie sua Mensagem
        </h3>
        <p className="text-gray-600">
          Personalize o conteúdo para cada canal selecionado
        </p>
      </div>

      {/* Tabs de Canais */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-200 bg-gray-50">
          {data.channels.map((channel) => {
            const icons = {
              whatsapp: MessageCircle,
              email: Mail,
              sms: MessageSquare,
            };
            const Icon = icons[channel];

            return (
              <button
                key={channel}
                onClick={() => setActiveChannel(channel)}
                className={`flex-1 px-4 py-3 font-semibold transition-all ${
                  activeChannel === channel
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Icon size={18} />
                  <span className="capitalize">{channel}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Editor - WhatsApp */}
        {activeChannel === 'whatsapp' && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mensagem do WhatsApp *
              </label>
              <textarea
                value={data.message_content.whatsapp?.text || ''}
                onChange={(e) => updateData({
                  message_content: {
                    ...data.message_content,
                    whatsapp: { ...data.message_content.whatsapp, text: e.target.value },
                  },
                })}
                rows={8}
                placeholder="Digite sua mensagem aqui..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {data.message_content.whatsapp?.text?.length || 0} caracteres
              </p>
            </div>

            {/* Variáveis */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Variáveis Disponíveis:
              </p>
              <div className="flex flex-wrap gap-2">
                {VARIABLES.map((v) => (
                  <button
                    key={v.key}
                    onClick={() => insertVariable(v.key, 'whatsapp')}
                    className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-100 transition-colors border border-green-200"
                  >
                    {v.key}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Editor - Email */}
        {activeChannel === 'email' && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Assunto do Email *
              </label>
              <input
                type="text"
                value={data.message_content.email?.subject || ''}
                onChange={(e) => updateData({
                  message_content: {
                    ...data.message_content,
                    email: { ...data.message_content.email, subject: e.target.value },
                  },
                })}
                placeholder="Ex: Matrícula 2026 - Garanta sua vaga!"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Corpo do Email *
              </label>
              <textarea
                value={data.message_content.email?.body_html || ''}
                onChange={(e) => updateData({
                  message_content: {
                    ...data.message_content,
                    email: { ...data.message_content.email, body_html: e.target.value },
                  },
                })}
                rows={12}
                placeholder="Digite o conteúdo do email..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
              />
            </div>

            {/* Variáveis */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Variáveis Disponíveis:
              </p>
              <div className="flex flex-wrap gap-2">
                {VARIABLES.map((v) => (
                  <button
                    key={v.key}
                    onClick={() => insertVariable(v.key, 'email')}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    {v.key}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Editor - SMS */}
        {activeChannel === 'sms' && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mensagem SMS * (máx. 160 caracteres)
              </label>
              <textarea
                value={data.message_content.sms?.text || ''}
                onChange={(e) => {
                  if (e.target.value.length <= 160) {
                    updateData({
                      message_content: {
                        ...data.message_content,
                        sms: { ...data.message_content.sms, text: e.target.value },
                      },
                    });
                  }
                }}
                rows={4}
                placeholder="Mensagem curta e direta..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              <p className={`text-xs mt-1 ${
                (data.message_content.sms?.text?.length || 0) > 160 
                  ? 'text-red-600 font-bold' 
                  : 'text-gray-500'
              }`}>
                {data.message_content.sms?.text?.length || 0} / 160 caracteres
              </p>
            </div>

            {/* Variáveis */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Variáveis Disponíveis:
              </p>
              <div className="flex flex-wrap gap-2">
                {VARIABLES.map((v) => (
                  <button
                    key={v.key}
                    onClick={() => insertVariable(v.key, 'sms')}
                    className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-100 transition-colors border border-purple-200"
                  >
                    {v.key}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Eye size={20} />
            Preview da Mensagem
          </h4>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            {showPreview ? 'Ocultar' : 'Mostrar'} Preview
          </button>
        </div>

        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Como ficará para: Maria Silva
            </p>
            <div className="p-4 bg-white rounded-lg shadow-sm whitespace-pre-wrap text-gray-900">
              {renderPreview(activeChannel) || (
                <span className="text-gray-400 italic">Nenhuma mensagem digitada</span>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="text-yellow-600 flex-shrink-0" size={24} />
          <div>
            <h4 className="font-bold text-yellow-900 mb-1">
              Personalize suas mensagens
            </h4>
            <p className="text-sm text-yellow-700 leading-relaxed">
              Use variáveis para tornar suas mensagens mais pessoais. Cada destinatário verá 
              suas próprias informações no lugar das variáveis.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}