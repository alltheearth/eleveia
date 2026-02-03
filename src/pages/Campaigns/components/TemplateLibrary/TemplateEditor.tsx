// src/pages/Campaigns/components/TemplateLibrary/TemplateEditor.tsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Plus, Trash2, Info } from 'lucide-react';
import type { MessageTemplate, TemplateCategory } from './index';

interface TemplateEditorProps {
  template: MessageTemplate;
  onClose: () => void;
  onSave: (template: MessageTemplate) => void;
}

const CATEGORY_OPTIONS: Array<{ value: TemplateCategory; label: string; icon: string }> = [
  { value: 'matricula', label: 'Matrícula', icon: '🎓' },
  { value: 'rematricula', label: 'Rematrícula', icon: '🔄' },
  { value: 'evento', label: 'Evento', icon: '🎉' },
  { value: 'reuniao', label: 'Reunião', icon: '📅' },
  { value: 'cobranca', label: 'Cobrança', icon: '💰' },
  { value: 'comunicado', label: 'Comunicado', icon: '📢' },
  { value: 'custom', label: 'Personalizado', icon: '⚙️' },
];

const COMMON_VARIABLES = [
  { value: 'nome_responsavel', label: 'Nome do Responsável' },
  { value: 'nome_aluno', label: 'Nome do Aluno' },
  { value: 'nome_escola', label: 'Nome da Escola' },
  { value: 'serie', label: 'Série/Ano' },
  { value: 'data_atual', label: 'Data Atual' },
  { value: 'hora_atual', label: 'Hora Atual' },
];

export default function TemplateEditor({
  template: initialTemplate,
  onClose,
  onSave,
}: TemplateEditorProps) {
  const [template, setTemplate] = useState<MessageTemplate>(initialTemplate);
  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email' | 'sms'>('whatsapp');

  const handleSave = () => {
    // Validações
    if (!template.name.trim()) {
      alert('Por favor, preencha o nome do template');
      return;
    }

    if (!template.content.whatsapp?.text && !template.content.email?.body_html && !template.content.sms?.text) {
      alert('Por favor, preencha o conteúdo em pelo menos um canal');
      return;
    }

    onSave({
      ...template,
      updated_at: new Date().toISOString(),
    });
  };

  const handleInsertVariable = (variable: string) => {
    const variableTag = `{{${variable}}}`;
    
    if (activeTab === 'whatsapp') {
      const textarea = document.getElementById('whatsapp-text') as HTMLTextAreaElement;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = template.content.whatsapp?.text || '';
        const newText = text.substring(0, start) + variableTag + text.substring(end);
        
        setTemplate({
          ...template,
          content: {
            ...template.content,
            whatsapp: {
              ...template.content.whatsapp,
              text: newText,
            },
          },
        });

        // Adicionar variável à lista se não existir
        if (!template.variables.includes(variable)) {
          setTemplate((prev) => ({
            ...prev,
            variables: [...prev.variables, variable],
          }));
        }

        // Refocar e posicionar cursor
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + variableTag.length, start + variableTag.length);
        }, 0);
      }
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !template.tags.includes(newTag.trim())) {
      setTemplate({
        ...template,
        tags: [...template.tags, newTag.trim().toLowerCase()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTemplate({
      ...template,
      tags: template.tags.filter((t) => t !== tag),
    });
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70]"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl shadow-2xl z-[70] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-2xl">✏️</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {template.id === 0 ? 'Criar Novo Template' : 'Editar Template'}
              </h3>
              <p className="text-purple-100 text-sm">
                Personalize seu template de mensagem
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="text-white" size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Informações básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Nome do Template *
              </label>
              <input
                type="text"
                value={template.name}
                onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                placeholder="Ex: Convite para Matrícula 2025"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Categoria *
              </label>
              <select
                value={template.category}
                onChange={(e) => setTemplate({ ...template, category: e.target.value as TemplateCategory })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Descrição
            </label>
            <textarea
              value={template.description}
              onChange={(e) => setTemplate({ ...template, description: e.target.value })}
              placeholder="Breve descrição sobre quando usar este template..."
              rows={2}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Channel tabs */}
          <div>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  activeTab === 'whatsapp'
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📱 WhatsApp
              </button>
              <button
                onClick={() => setActiveTab('email')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  activeTab === 'email'
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📧 Email
              </button>
              <button
                onClick={() => setActiveTab('sms')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  activeTab === 'sms'
                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                💬 SMS
              </button>
            </div>

            {/* WhatsApp Content */}
            {activeTab === 'whatsapp' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-gray-900">
                      Mensagem WhatsApp *
                    </label>
                    <span className="text-xs text-gray-500">
                      {template.content.whatsapp?.text?.length || 0} caracteres
                    </span>
                  </div>
                  <textarea
                    id="whatsapp-text"
                    value={template.content.whatsapp?.text || ''}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        content: {
                          ...template.content,
                          whatsapp: {
                            ...template.content.whatsapp,
                            text: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="Digite sua mensagem aqui..."
                    rows={12}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
                  />
                </div>

                {/* Variables panel */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Info size={20} className="text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">
                        Variáveis Disponíveis
                      </p>
                      <p className="text-xs text-blue-700">
                        Clique para inserir no texto
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_VARIABLES.map((variable) => (
                      <button
                        key={variable.value}
                        onClick={() => handleInsertVariable(variable.value)}
                        className="px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        {`{{${variable.value}}}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Email Content */}
            {activeTab === 'email' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Assunto do Email
                  </label>
                  <input
                    type="text"
                    value={template.content.email?.subject || ''}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        content: {
                          ...template.content,
                          email: {
                            ...template.content.email,
                            subject: e.target.value,
                            body_html: template.content.email?.body_html || '',
                            body_text: template.content.email?.body_text || '',
                          },
                        },
                      })
                    }
                    placeholder="Ex: Matrículas 2025 Abertas!"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Corpo do Email (Texto)
                  </label>
                  <textarea
                    value={template.content.email?.body_text || ''}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        content: {
                          ...template.content,
                          email: {
                            ...template.content.email,
                            subject: template.content.email?.subject || '',
                            body_html: template.content.email?.body_html || '',
                            body_text: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="Conteúdo do email em texto puro..."
                    rows={10}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            )}

            {/* SMS Content */}
            {activeTab === 'sms' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-900">
                    Mensagem SMS
                  </label>
                  <span className={`text-xs font-semibold ${
                    (template.content.sms?.text?.length || 0) > 160
                      ? 'text-red-600'
                      : 'text-gray-500'
                  }`}>
                    {template.content.sms?.text?.length || 0}/160 caracteres
                  </span>
                </div>
                <textarea
                  value={template.content.sms?.text || ''}
                  onChange={(e) =>
                    setTemplate({
                      ...template,
                      content: {
                        ...template.content,
                        sms: {
                          text: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="Mensagem curta para SMS..."
                  rows={4}
                  maxLength={160}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  ⚠️ SMS tem limite de 160 caracteres
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Digite uma tag e pressione Enter"
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-semibold hover:bg-purple-200 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Adicionar
              </button>
            </div>

            {template.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">#{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="p-0.5 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Trash2 size={14} className="text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 transition-colors"
          >
            Cancelar
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="px-8 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <Save size={18} />
            Salvar Template
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}