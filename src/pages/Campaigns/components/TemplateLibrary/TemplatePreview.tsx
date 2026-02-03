// src/pages/Campaigns/components/TemplateLibrary/TemplatePreview.tsx

import { motion } from 'framer-motion';
import { X, Check, Edit2, Copy, TrendingUp, Calendar, Tag } from 'lucide-react';
import type { MessageTemplate } from './index';

interface TemplatePreviewProps {
  template: MessageTemplate;
  onClose: () => void;
  onSelect: () => void;
  onEdit?: () => void;
}

const CATEGORY_CONFIG = {
  matricula: {
    label: 'Matrícula',
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: '🎓',
  },
  rematricula: {
    label: 'Rematrícula',
    gradient: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    text: 'text-green-700',
    icon: '🔄',
  },
  evento: {
    label: 'Evento',
    gradient: 'from-pink-500 to-pink-600',
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    icon: '🎉',
  },
  reuniao: {
    label: 'Reunião',
    gradient: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    icon: '📅',
  },
  cobranca: {
    label: 'Cobrança',
    gradient: 'from-red-500 to-red-600',
    bg: 'bg-red-50',
    text: 'text-red-700',
    icon: '💰',
  },
  comunicado: {
    label: 'Comunicado',
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    icon: '📢',
  },
  custom: {
    label: 'Personalizado',
    gradient: 'from-gray-500 to-gray-600',
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    icon: '⚙️',
  },
  all: {
    label: 'Todos',
    gradient: 'from-gray-500 to-gray-600',
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    icon: '📚',
  },
};

export default function TemplatePreview({
  template,
  onClose,
  onSelect,
  onEdit,
}: TemplatePreviewProps) {
  const config = CATEGORY_CONFIG[template.category];

  const handleCopyText = () => {
    const text = template.content.whatsapp?.text || template.content.email?.body_text || '';
    navigator.clipboard.writeText(text);
    // TODO: Mostrar toast de sucesso
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[90vh] bg-white rounded-2xl shadow-2xl z-[60] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${config.gradient} px-6 py-5 flex items-center justify-between flex-shrink-0`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">{config.icon}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{template.name}</h3>
              <p className="text-sm text-white/90">{template.description}</p>
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
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${config.bg} rounded-lg flex items-center justify-center`}>
                  <Tag className={config.text} size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Categoria</p>
                  <p className={`text-sm font-bold ${config.text}`}>
                    {config.label}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Utilizações</p>
                  <p className="text-sm font-bold text-green-600">
                    {template.usage_count} vezes
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Calendar className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Atualizado</p>
                  <p className="text-sm font-bold text-purple-600">
                    {new Date(template.updated_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview WhatsApp */}
          {template.content.whatsapp && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-xl">📱</span>
                  Preview WhatsApp
                </h4>
                <button
                  onClick={handleCopyText}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                >
                  <Copy size={16} />
                  Copiar Texto
                </button>
              </div>

              {/* WhatsApp Message Bubble */}
              <div className="bg-gradient-to-b from-green-50 to-white rounded-2xl p-6 border-2 border-green-100">
                <div className="max-w-md">
                  <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-lg border border-gray-200">
                    <pre className="text-sm text-gray-900 whitespace-pre-wrap font-sans leading-relaxed">
                      {template.content.whatsapp.text}
                    </pre>

                    {/* Buttons preview */}
                    {template.content.whatsapp.buttons && template.content.whatsapp.buttons.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                        {template.content.whatsapp.buttons.map((button, idx) => (
                          <div
                            key={idx}
                            className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-center text-sm font-semibold text-blue-600"
                          >
                            {button.text}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 text-right">
                      <span className="text-xs text-gray-400">
                        {new Date().toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Variables */}
          {template.variables.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-xl">🔤</span>
                Variáveis Disponíveis
              </h4>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs text-blue-700 mb-3">
                  Estas variáveis serão substituídas automaticamente pelos dados reais:
                </p>
                <div className="flex flex-wrap gap-2">
                  {template.variables.map((variable) => (
                    <div
                      key={variable}
                      className="px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-sm font-mono text-blue-700"
                    >
                      {`{{${variable}}}`}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          {template.tags.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-xl">🏷️</span>
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Usage Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div className="flex-1">
                <p className="font-semibold text-amber-900 mb-1 text-sm">
                  Dica de uso
                </p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Este template foi usado com sucesso {template.usage_count} vezes por outras
                  escolas. Você pode usá-lo como está ou editá-lo para personalizar ainda
                  mais sua mensagem.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer com ações */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 transition-colors"
          >
            Fechar
          </button>

          <div className="flex items-center gap-3">
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 transition-colors flex items-center gap-2"
              >
                <Edit2 size={18} />
                Editar
              </button>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSelect}
              className={`px-8 py-2.5 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2`}
            >
              <Check size={18} />
              Usar este Template
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}