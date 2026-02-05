// src/pages/Campaigns/components/CampaignWizard/Step4_Message.tsx
// ✉️ STEP 4 - EDITOR DE MENSAGENS

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Mail, MessageSquare, Eye, Sparkles, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { MessageContent, CampaignChannel } from '../../types/campaign.types';

// ============================================
// TYPES
// ============================================

interface Step4Props {
  data: {
    channels: CampaignChannel[];
    message_content: MessageContent;
    message_template_id?: number;
  };
  updateData: (updates: any) => void;
}

// ============================================
// VARIÁVEIS DISPONÍVEIS
// ============================================

const VARIABLES = [
  { key: '{{nome}}', label: 'Nome do destinatário', example: 'Maria Silva' },
  { key: '{{escola}}', label: 'Nome da escola', example: 'Colégio ABC' },
  { key: '{{serie}}', label: 'Série de interesse', example: '1º Ano' },
  { key: '{{data}}', label: 'Data atual', example: '05/02/2026' },
  { key: '{{responsavel}}', label: 'Nome do responsável', example: 'João Silva' },
  { key: '{{telefone}}', label: 'Telefone da escola', example: '(11) 1234-5678' },
];

// ============================================
// TEMPLATES RÁPIDOS
// ============================================

const QUICK_TEMPLATES: Record<string, { subject?: string; message: string }> = {
  matricula: {
    subject: 'Vagas Abertas para {{serie}} - {{escola}}',
    message: `Olá {{nome}}! 🎓

Temos uma ótima notícia: as matrículas para {{serie}} já estão abertas na {{escola}}!

🌟 Diferenciais da nossa escola:
✅ Ensino de qualidade
✅ Professores capacitados
✅ Estrutura completa

📞 Entre em contato: {{telefone}}

Aguardamos você!
Equipe {{escola}}`,
  },
  rematricula: {
    subject: 'Renovação de Matrícula - {{escola}}',
    message: `Olá {{responsavel}}! 🔄

É hora de renovar a matrícula de {{nome}} para o próximo ano letivo!

💰 Condições especiais para rematrícula:
✅ Desconto de 10% no pagamento à vista
✅ Parcelamento facilitado
✅ Sem taxa de matrícula

⏰ Aproveite até {{data}}

Acesse nosso site ou entre em contato: {{telefone}}

Equipe {{escola}}`,
  },
  evento: {
    subject: 'Convite Especial - {{escola}}',
    message: `Olá {{nome}}! 🎊

Você está convidado(a) para nosso evento especial na {{escola}}!

📅 Data: [DATA DO EVENTO]
🕐 Horário: [HORÁRIO]
📍 Local: [LOCAL]

Será um prazer receber você!

Confirme sua presença: {{telefone}}

Equipe {{escola}}`,
  },
};

// ============================================
// COMPONENT
// ============================================

export default function Step4_Message({ data, updateData }: Step4Props) {
  
  const [activeChannel, setActiveChannel] = useState<CampaignChannel>(data.channels[0]);
  const [showPreview, setShowPreview] = useState(false);
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  // ============================================
  // HANDLERS
  // ============================================

  const handleInsertVariable = (variable: string) => {
    if (activeChannel === 'whatsapp') {
      const currentText = data.message_content.whatsapp?.text || '';
      updateData({
        message_content: {
          ...data.message_content,
          whatsapp: {
            ...data.message_content.whatsapp,
            text: currentText + variable + ' ',
          },
        },
      });
    } else if (activeChannel === 'email') {
      const currentBody = data.message_content.email?.body_html || '';
      updateData({
        message_content: {
          ...data.message_content,
          email: {
            ...data.message_content.email,
            body_html: currentBody + variable + ' ',
          },
        },
      });
    } else if (activeChannel === 'sms') {
      const currentText = data.message_content.sms?.text || '';
      updateData({
        message_content: {
          ...data.message_content,
          sms: {
            ...data.message_content.sms,
            text: currentText + variable + ' ',
          },
        },
      });
    }
  };

  const handleCopyVariable = (variable: string) => {
    navigator.clipboard.writeText(variable);
    setCopiedVar(variable);
    setTimeout(() => setCopiedVar(null), 2000);
  };

  const handleUseTemplate = (templateKey: string) => {
    const template = QUICK_TEMPLATES[templateKey];
    if (!template) return;

    if (activeChannel === 'whatsapp') {
      updateData({
        message_content: {
          ...data.message_content,
          whatsapp: {
            text: template.message,
          },
        },
      });
    } else if (activeChannel === 'email') {
      updateData({
        message_content: {
          ...data.message_content,
          email: {
            ...data.message_content.email,
            subject: template.subject || '',
            body_html: template.message,
            body_text: template.message,
          },
        },
      });
    } else if (activeChannel === 'sms') {
      updateData({
        message_content: {
          ...data.message_content,
          sms: {
            text: template.message.slice(0, 160), // SMS limit
          },
        },
      });
    }
  };

  const renderPreview = (channel: CampaignChannel) => {
    let content = '';
    let subject = '';
    
    if (channel === 'whatsapp') {
      content = data.message_content.whatsapp?.text || '';
    } else if (channel === 'email') {
      subject = data.message_content.email?.subject || '';
      content = data.message_content.email?.body_html || '';
    } else if (channel === 'sms') {
      content = data.message_content.sms?.text || '';
    }

    // Substituir variáveis por valores de exemplo
    const preview = content
      .replace(/{{nome}}/g, 'Maria Silva')
      .replace(/{{escola}}/g, 'Colégio ABC')
      .replace(/{{serie}}/g, '1º Ano')
      .replace(/{{data}}/g, '05/02/2026')
      .replace(/{{responsavel}}/g, 'João Silva')
      .replace(/{{telefone}}/g, '(11) 1234-5678');

    const previewSubject = subject
      .replace(/{{nome}}/g, 'Maria Silva')
      .replace(/{{escola}}/g, 'Colégio ABC')
      .replace(/{{serie}}/g, '1º Ano')
      .replace(/{{data}}/g, '05/02/2026');

    return { preview, previewSubject };
  };

  const getCharacterCount = (channel: CampaignChannel) => {
    if (channel === 'whatsapp') {
      return data.message_content.whatsapp?.text?.length || 0;
    } else if (channel === 'email') {
      return data.message_content.email?.body_html?.length || 0;
    } else if (channel === 'sms') {
      return data.message_content.sms?.text?.length || 0;
    }
    return 0;
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          ✉️ Crie sua Mensagem
        </h3>
        <p className="text-gray-600">
          Escreva mensagens personalizadas para cada canal selecionado
        </p>
      </div>

      {/* Channel Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {data.channels.map((channel) => {
          const config = {
            whatsapp: { icon: MessageCircle, label: 'WhatsApp', color: 'green' },
            email: { icon: Mail, label: 'Email', color: 'blue' },
            sms: { icon: MessageSquare, label: 'SMS', color: 'purple' },
          }[channel];

          const Icon = config.icon;

          return (
            <button
              key={channel}
              onClick={() => setActiveChannel(channel)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-all ${
                activeChannel === channel
                  ? `border-${config.color}-600 text-${config.color}-600`
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={18} />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Templates Rápidos */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4">
        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Sparkles size={18} className="text-purple-600" />
          Templates Rápidos
        </h4>
        <div className="flex flex-wrap gap-2">
          {Object.keys(QUICK_TEMPLATES).map((key) => (
            <button
              key={key}
              onClick={() => handleUseTemplate(key)}
              className="px-3 py-1.5 bg-white border-2 border-purple-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:border-purple-300 transition-all"
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Editor */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Email Subject (apenas para email) */}
          {activeChannel === 'email' && (
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
                    email: {
                      ...data.message_content.email,
                      subject: e.target.value,
                    },
                  },
                })}
                placeholder="Digite o assunto do email"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Message Body */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">
                {activeChannel === 'email' ? 'Corpo do Email *' : 'Mensagem *'}
              </label>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-colors text-sm"
              >
                <Eye size={16} />
                {showPreview ? 'Ocultar' : 'Visualizar'} Preview
              </button>
            </div>

            <textarea
              value={
                activeChannel === 'whatsapp' ? data.message_content.whatsapp?.text || '' :
                activeChannel === 'email' ? data.message_content.email?.body_html || '' :
                data.message_content.sms?.text || ''
              }
              onChange={(e) => {
                const value = e.target.value;
                if (activeChannel === 'whatsapp') {
                  updateData({
                    message_content: {
                      ...data.message_content,
                      whatsapp: { text: value },
                    },
                  });
                } else if (activeChannel === 'email') {
                  updateData({
                    message_content: {
                      ...data.message_content,
                      email: {
                        ...data.message_content.email,
                        body_html: value,
                        body_text: value,
                      },
                    },
                  });
                } else if (activeChannel === 'sms') {
                  updateData({
                    message_content: {
                      ...data.message_content,
                      sms: { text: value.slice(0, 160) },
                    },
                  });
                }
              }}
              rows={12}
              placeholder={`Digite sua mensagem para ${activeChannel}...`}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
              maxLength={activeChannel === 'sms' ? 160 : undefined}
            />

            {/* Character Count */}
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                {getCharacterCount(activeChannel)} caracteres
                {activeChannel === 'sms' && ' / 160 máximo'}
              </p>
              {activeChannel === 'sms' && getCharacterCount(activeChannel) > 140 && (
                <p className="text-xs text-orange-600 font-semibold">
                  ⚠️ Próximo do limite
                </p>
              )}
            </div>
          </div>

          {/* Preview */}
          <AnimatePresence>
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50"
              >
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Eye size={18} className="text-blue-600" />
                  Preview da Mensagem
                </h4>
                
                {activeChannel === 'email' && (
                  <div className="mb-3 pb-3 border-b border-gray-300">
                    <p className="text-xs text-gray-600 font-semibold mb-1">Assunto:</p>
                    <p className="font-semibold text-gray-900">
                      {renderPreview(activeChannel).previewSubject || '(sem assunto)'}
                    </p>
                  </div>
                )}

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="whitespace-pre-wrap text-sm text-gray-800">
                    {renderPreview(activeChannel).preview || '(mensagem vazia)'}
                  </p>
                </div>

                <p className="text-xs text-gray-500 mt-2 italic">
                  As variáveis foram substituídas por valores de exemplo
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar - Variáveis */}
        <div className="lg:col-span-1">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sticky top-4">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-lg">🔤</span>
              Variáveis Disponíveis
            </h4>
            <p className="text-xs text-gray-600 mb-4">
              Clique para copiar ou inserir na mensagem
            </p>

            <div className="space-y-2">
              {VARIABLES.map((variable) => (
                <div
                  key={variable.key}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <code className="text-xs font-mono font-bold text-blue-600">
                      {variable.key}
                    </code>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleCopyVariable(variable.key)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Copiar"
                      >
                        {copiedVar === variable.key ? (
                          <Check size={14} className="text-green-600" />
                        ) : (
                          <Copy size={14} className="text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{variable.label}</p>
                  <p className="text-xs text-gray-500 italic">
                    Ex: {variable.example}
                  </p>
                  <button
                    onClick={() => handleInsertVariable(variable.key)}
                    className="w-full mt-2 px-2 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Inserir
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-bold text-blue-900 mb-1">Dica</h4>
            <p className="text-sm text-blue-700">
              Use variáveis para personalizar suas mensagens. Cada destinatário 
              receberá a mensagem com seus dados específicos. Isso aumenta 
              significativamente o engajamento da campanha.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}