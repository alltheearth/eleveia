// src/pages/Campaigns/components/CreateCampaignModal.tsx
// 🎯 MODAL DE CRIAÇÃO DE CAMPANHA
// Modal seguindo o padrão dos outros modais da aplicação

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Megaphone, Mail, MessageSquare, Smartphone, Bell } from 'lucide-react';
import type { Campaign, CampaignType } from '../types/campaign.types';

// ============================================
// TYPES
// ============================================

interface CreateCampaignModalProps {
  onClose: () => void;
  onSuccess: (campaign: Partial<Campaign>) => void;
}

// ============================================
// COMPONENT
// ============================================

export default function CreateCampaignModal({
  onClose,
  onSuccess,
}: CreateCampaignModalProps) {
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'marketing' as CampaignType,
    channels: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ============================================
  // OPTIONS
  // ============================================

  const typeOptions = [
    { value: 'marketing', label: 'Marketing', icon: '📢', description: 'Campanhas promocionais' },
    { value: 'transactional', label: 'Transacional', icon: '💰', description: 'Confirmações e notificações' },
    { value: 'notification', label: 'Notificação', icon: '🔔', description: 'Alertas e avisos' },
    { value: 'educational', label: 'Educacional', icon: '📚', description: 'Conteúdo educativo' },
  ];

  const channelOptions = [
    { value: 'email', label: 'Email', icon: <Mail size={20} /> },
    { value: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare size={20} /> },
    { value: 'sms', label: 'SMS', icon: <Smartphone size={20} /> },
    { value: 'push', label: 'Push', icon: <Bell size={20} /> },
  ];

  // ============================================
  // HANDLERS
  // ============================================

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (formData.channels.length === 0) {
      newErrors.channels = 'Selecione pelo menos um canal';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Criar campanha
    const newCampaign: Partial<Campaign> = {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      channels: formData.channels,
      status: 'draft',
      audience_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSuccess(newCampaign);
  };

  const handleChannelToggle = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
    
    // Limpar erro de canais se houver
    if (errors.channels) {
      setErrors(prev => ({ ...prev, channels: '' }));
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative z-10"
        >
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Megaphone className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Nova Campanha</h2>
                  <p className="text-blue-100 text-sm">Crie uma nova campanha de comunicação</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="text-white" size={20} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
            
            {/* Nome */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome da Campanha *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                placeholder="Ex: Promoção de Volta às Aulas"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Descrição */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o objetivo e conteúdo da campanha..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
              />
            </div>

            {/* Tipo de Campanha */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tipo de Campanha
              </label>
              <div className="grid grid-cols-2 gap-3">
                {typeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: option.value as CampaignType }))}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.type === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{option.icon}</span>
                      <span className="font-semibold text-gray-900">{option.label}</span>
                    </div>
                    <p className="text-xs text-gray-600">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Canais */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Canais de Envio *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {channelOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChannelToggle(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.channels.includes(option.value)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        formData.channels.includes(option.value)
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {option.icon}
                      </div>
                      <span className="font-semibold text-gray-900">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
              {errors.channels && (
                <p className="mt-2 text-sm text-red-600">{errors.channels}</p>
              )}
            </div>

            {/* Info */}
            <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-100">
              <p className="text-sm text-blue-800">
                <strong>💡 Dica:</strong> Você poderá configurar o público-alvo, conteúdo e agendamento após criar a campanha.
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all"
            >
              Criar Campanha
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}