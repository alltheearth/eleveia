// src/pages/Campaigns/components/MessageEditor/index.tsx
// 💬 EDITOR RICO DE MENSAGENS - MULTI-CANAL

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Mail, 
  MessageSquare,
  Eye,
  Code,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import TemplateSelector from './TemplateSelector';
import VariableInserter from './VariableInserter';
import PreviewPanel from './PreviewPanel';
import EmojiPicker from './EmojiPicker';
import AttachmentUploader from './AttachmentUploader';
import CharacterCounter from './CharacterCounter';
import type { MessageContent, CampaignChannel, MessageTemplate } from '../../types/campaign.types';

// ============================================
// TYPES
// ============================================

interface MessageEditorProps {
  value: MessageContent;
  onChange: (content: MessageContent) => void;
  activeChannels: CampaignChannel[];
  onSave?: () => void;
  onCancel?: () => void;
  templates?: MessageTemplate[];
  isLoading?: boolean;
}

type EditorTab = 'edit' | 'preview';

// ============================================
// CHANNEL CONFIG
// ============================================

const CHANNEL_CONFIG = {
  whatsapp: {
    label: 'WhatsApp',
    icon: <MessageCircle size={18} />,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    gradient: 'from-green-500 to-green-600',
    maxChars: 4096,
  },
  email: {
    label: 'Email',
    icon: <Mail size={18} />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    gradient: 'from-blue-500 to-blue-600',
    maxChars: 10000,
  },
  sms: {
    label: 'SMS',
    icon: <MessageSquare size={18} />,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    gradient: 'from-purple-500 to-purple-600',
    maxChars: 160,
  },
};

// ============================================
// COMPONENT
// ============================================

export default function MessageEditor({
  value,
  onChange,
  activeChannels,
  onSave,
  onCancel,
  templates = [],
  isLoading = false,
}: MessageEditorProps) {
  
  // ============================================
  // STATE
  // ============================================
  
  const [selectedChannel, setSelectedChannel] = useState<CampaignChannel>(
    activeChannels[0] || 'whatsapp'
  );
  const [editorTab, setEditorTab] = useState<EditorTab>('edit');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showVariables, setShowVariables] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

  // ============================================
  // COMPUTED
  // ============================================
  
  const channelConfig = CHANNEL_CONFIG[selectedChannel];
  const currentContent = value[selectedChannel];

  // Calcular caracteres
  const charCount = selectedChannel === 'email'
    ? (currentContent?.body_text?.length || 0)
    : selectedChannel === 'whatsapp'
    ? (currentContent?.text?.length || 0)
    : (currentContent?.text?.length || 0);

  const isOverLimit = charCount > channelConfig.maxChars;

  // ============================================
  // HANDLERS
  // ============================================
  
  const handleContentChange = useCallback((field: string, newValue: string) => {
    onChange({
      ...value,
      [selectedChannel]: {
        ...currentContent,
        [field]: newValue,
      },
    });
  }, [value, selectedChannel, currentContent, onChange]);

  const handleTemplateSelect = useCallback((template: MessageTemplate) => {
    onChange({
      ...value,
      [selectedChannel]: template.content[selectedChannel],
    });
    setShowTemplates(false);
  }, [value, selectedChannel, onChange]);

  const handleVariableInsert = useCallback((variable: string) => {
    const field = selectedChannel === 'email' ? 'body_text' : 'text';
    const currentText = currentContent?.[field] || '';
    const newText = currentText + `{{${variable}}}`;
    handleContentChange(field, newText);
    setShowVariables(false);
  }, [selectedChannel, currentContent, handleContentChange]);

  const handleEmojiSelect = useCallback((emoji: string) => {
    const field = selectedChannel === 'email' ? 'body_text' : 'text';
    const currentText = currentContent?.[field] || '';
    handleContentChange(field, currentText + emoji);
  }, [selectedChannel, currentContent, handleContentChange]);

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Header */}
      <div className={`bg-gradient-to-r ${channelConfig.gradient} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
              {channelConfig.icon}
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Editor de Mensagens</h3>
              <p className="text-white/80 text-sm">
                Personalize sua mensagem para {channelConfig.label}
              </p>
            </div>
          </div>

          {/* Tabs de canal */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
            {activeChannels.map((channel) => {
              const config = CHANNEL_CONFIG[channel];
              const isActive = channel === selectedChannel;
              
              return (
                <button
                  key={channel}
                  onClick={() => setSelectedChannel(channel)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-gray-900 shadow-md'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {config.icon}
                  <span className="hidden sm:inline">{config.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between flex-wrap gap-3">
          
          {/* Ferramentas */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-semibold transition-colors"
            >
              <Code size={16} />
              <span>Templates</span>
            </button>

            <button
              onClick={() => setShowVariables(!showVariables)}
              className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-semibold transition-colors"
            >
              <span>{"{ }"}</span>
              <span>Variáveis</span>
            </button>

            <button
              onClick={() => setShowEmojis(!showEmojis)}
              className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-semibold transition-colors"
            >
              <span>😊</span>
              <span className="hidden sm:inline">Emojis</span>
            </button>

            {selectedChannel !== 'sms' && (
              <AttachmentUploader
                value={currentContent?.attachments || []}
                onChange={(attachments) => handleContentChange('attachments', attachments as any)}
                maxFiles={selectedChannel === 'whatsapp' ? 1 : 5}
              />
            )}
          </div>

          {/* Tabs Edit/Preview */}
          <div className="flex items-center gap-2 bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setEditorTab('edit')}
              className={`px-4 py-2 rounded-md font-semibold transition-all ${
                editorTab === 'edit'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Editar
            </button>
            <button
              onClick={() => setEditorTab('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all ${
                editorTab === 'preview'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye size={16} />
              Preview
            </button>
          </div>
        </div>

        {/* Popups */}
        <AnimatePresence>
          {showTemplates && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3"
            >
              <TemplateSelector
                templates={templates.filter(t => t.content[selectedChannel])}
                onSelect={handleTemplateSelect}
                onClose={() => setShowTemplates(false)}
              />
            </motion.div>
          )}

          {showVariables && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3"
            >
              <VariableInserter
                onInsert={handleVariableInsert}
                onClose={() => setShowVariables(false)}
              />
            </motion.div>
          )}

          {showEmojis && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3"
            >
              <EmojiPicker
                onSelect={handleEmojiSelect}
                onClose={() => setShowEmojis(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Editor Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {editorTab === 'edit' ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              
              {/* Email: Subject */}
              {selectedChannel === 'email' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assunto do Email *
                  </label>
                  <input
                    type="text"
                    value={currentContent?.subject || ''}
                    onChange={(e) => handleContentChange('subject', e.target.value)}
                    placeholder="Ex: Vagas abertas para rematrícula 2026"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Message Body */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {selectedChannel === 'email' ? 'Corpo do Email *' : 'Mensagem *'}
                </label>
                <textarea
                  value={
                    selectedChannel === 'email'
                      ? currentContent?.body_text || ''
                      : currentContent?.text || ''
                  }
                  onChange={(e) =>
                    handleContentChange(
                      selectedChannel === 'email' ? 'body_text' : 'text',
                      e.target.value
                    )
                  }
                  placeholder={
                    selectedChannel === 'whatsapp'
                      ? 'Olá {{nome}}! Estamos com vagas abertas...'
                      : selectedChannel === 'email'
                      ? 'Digite o conteúdo do email aqui...'
                      : 'Mensagem curta de até 160 caracteres'
                  }
                  rows={selectedChannel === 'sms' ? 4 : 12}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                    isOverLimit
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />

                {/* Character Counter */}
                <CharacterCounter
                  current={charCount}
                  max={channelConfig.maxChars}
                  channel={selectedChannel}
                />
              </div>

              {/* Warning sobre limite */}
              {isOverLimit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-red-900">
                      Mensagem muito longa
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      Você ultrapassou o limite de {channelConfig.maxChars} caracteres para {channelConfig.label}.
                      Reduza o texto em {charCount - channelConfig.maxChars} caracteres.
                    </p>
                  </div>
                </motion.div>
              )}

            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PreviewPanel
                content={currentContent}
                channel={selectedChannel}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      {(onSave || onCancel) && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-6 py-3 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          )}
          {onSave && (
            <button
              onClick={onSave}
              disabled={isLoading || isOverLimit}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
            >
              <Save size={18} />
              {isLoading ? 'Salvando...' : 'Salvar Mensagem'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}