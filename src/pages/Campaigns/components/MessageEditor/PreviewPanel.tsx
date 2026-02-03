// src/pages/Campaigns/components/MessageEditor/PreviewPanel.tsx
// 👁️ PAINEL DE PREVIEW DA MENSAGEM

import { motion } from 'framer-motion';
import { Smartphone, Mail as MailIcon, MessageSquare, Clock, Check, CheckCheck } from 'lucide-react';
import type { MessageContent, CampaignChannel } from '../../types/campaign.types';

// ============================================
// TYPES
// ============================================

interface PreviewPanelProps {
  content: any;
  channel: CampaignChannel;
}

// ============================================
// COMPONENT
// ============================================

export default function PreviewPanel({
  content,
  channel,
}: PreviewPanelProps) {
  
  // Mock data para preview
  const mockData = {
    nome: 'Maria Silva',
    email: 'maria.silva@email.com',
    telefone: '(11) 99999-8888',
    nome_aluno: 'João Silva',
    serie: '5º Ano A',
    escola_nome: 'Escola ABC',
    data_atual: new Date().toLocaleDateString('pt-BR'),
  };

  // Substituir variáveis
  const replaceVariables = (text: string = '') => {
    let replaced = text;
    Object.entries(mockData).forEach(([key, value]) => {
      replaced = replaced.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return replaced;
  };

  // Renderizar preview por canal
  const renderPreview = () => {
    switch (channel) {
      case 'whatsapp':
        return <WhatsAppPreview content={content} replaceVariables={replaceVariables} />;
      case 'email':
        return <EmailPreview content={content} replaceVariables={replaceVariables} />;
      case 'sms':
        return <SMSPreview content={content} replaceVariables={replaceVariables} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>👀 Preview:</strong> Esta é uma visualização de como a mensagem será exibida para o destinatário. As variáveis foram substituídas por dados de exemplo.
        </p>
      </div>

      {/* Preview */}
      {renderPreview()}
    </div>
  );
}

// ============================================
// WHATSAPP PREVIEW
// ============================================

function WhatsAppPreview({ 
  content, 
  replaceVariables 
}: { 
  content: any; 
  replaceVariables: (text: string) => string;
}) {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        
        {/* Phone Frame */}
        <div className="bg-gray-900 rounded-[3rem] p-4 shadow-2xl">
          <div className="bg-white rounded-[2.5rem] overflow-hidden h-[600px] flex flex-col">
            
            {/* WhatsApp Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Smartphone className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">Escola ABC</p>
                <p className="text-white/80 text-xs">online</p>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-gray-50 p-4 overflow-y-auto"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h100v100H0z\' fill=\'%23f0f0f0\'/%3E%3Cpath d=\'M20 20l10 10-10 10M40 20l10 10-10 10M60 20l10 10-10 10\' stroke=\'%23e0e0e0\' stroke-width=\'2\' fill=\'none\'/%3E%3C/svg%3E")',
              }}
            >
              
              {/* Message Bubble */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end mb-4"
              >
                <div className="max-w-[85%]">
                  <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-2xl rounded-tr-sm p-3 shadow-md">
                    <p className="text-white text-sm whitespace-pre-wrap leading-relaxed">
                      {replaceVariables(content?.text || 'Digite uma mensagem...')}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <Clock className="text-white/70" size={12} />
                      <span className="text-xs text-white/70">14:32</span>
                      <CheckCheck className="text-white/70" size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Input Area */}
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
              <div className="flex-1 bg-white rounded-full px-4 py-2">
                <p className="text-sm text-gray-400">Digite uma mensagem...</p>
              </div>
              <button className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// EMAIL PREVIEW
// ============================================

function EmailPreview({ 
  content, 
  replaceVariables 
}: { 
  content: any; 
  replaceVariables: (text: string) => string;
}) {
  return (
    <div className="bg-gray-100 rounded-xl p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-3xl mx-auto">
        
        {/* Email Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <MailIcon className="text-white" size={24} />
            <div>
              <p className="text-white font-bold">Escola ABC</p>
              <p className="text-white/80 text-sm">comunicacao@escolaabc.com.br</p>
            </div>
          </div>
        </div>

        {/* Email Body */}
        <div className="p-6">
          
          {/* Subject */}
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {replaceVariables(content?.subject || 'Assunto do Email')}
          </h2>
          
          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-200">
            <span>Para: maria.silva@email.com</span>
            <span>•</span>
            <span>{new Date().toLocaleDateString('pt-BR')}</span>
          </div>

          {/* Content */}
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {replaceVariables(content?.body_text || 'Digite o conteúdo do email...')}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <p>Este email foi enviado por Escola ABC</p>
            <p className="mt-1">© 2026 Todos os direitos reservados</p>
          </div>
        </div>

      </div>
    </div>
  );
}

// ============================================
// SMS PREVIEW
// ============================================

function SMSPreview({ 
  content, 
  replaceVariables 
}: { 
  content: any; 
  replaceVariables: (text: string) => string;
}) {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-sm">
        
        {/* Phone Frame */}
        <div className="bg-gray-900 rounded-[3rem] p-4 shadow-2xl">
          <div className="bg-white rounded-[2.5rem] overflow-hidden h-[500px] flex flex-col">
            
            {/* SMS Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3">
              <div className="flex items-center gap-3">
                <MessageSquare className="text-white" size={20} />
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">Mensagens</p>
                  <p className="text-white/80 text-xs">Escola ABC</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 bg-gray-50 p-4">
              
              {/* Message Bubble */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end"
              >
                <div className="max-w-[85%]">
                  <div className="bg-purple-500 rounded-2xl rounded-br-sm p-3 shadow-md">
                    <p className="text-white text-sm whitespace-pre-wrap">
                      {replaceVariables(content?.text || 'Digite a mensagem SMS...')}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-xs text-white/70">14:32</span>
                      <Check className="text-white/70" size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}