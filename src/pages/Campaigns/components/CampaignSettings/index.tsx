// =============================================================================
// src/pages/Campaigns/components/CampaignSettings/index.tsx
// =============================================================================

// ⚙️ CONFIGURAÇÕES DA CAMPANHA
// Editar informações e configurações da campanha

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Save, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Campaign } from '../../types/campaign.types';
import { CAMPAIGN_TYPE_CONFIG } from '../../utils/campaignConfig';

interface CampaignSettingsProps {
  campaign: Campaign;
  onUpdate: (updates: Partial<Campaign>) => void;
}

export default function CampaignSettings({ campaign, onUpdate }: CampaignSettingsProps) {
  const [formData, setFormData] = useState({
    name: campaign.name,
    description: campaign.description || '',
    type: campaign.type,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    toast.success('✅ Configurações atualizadas!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          ⚙️ Configurações da Campanha
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Edite as informações básicas da campanha
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Nome */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nome da Campanha
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
          />
        </div>

        {/* Tipo (read-only) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tipo de Campanha
          </label>
          <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{CAMPAIGN_TYPE_CONFIG[campaign.type].icon}</span>
              <div>
                <p className="font-semibold text-gray-900">
                  {CAMPAIGN_TYPE_CONFIG[campaign.type].label}
                </p>
                <p className="text-xs text-gray-600">
                  O tipo da campanha não pode ser alterado após a criação
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-100">
          <div className="flex gap-3">
            <Info className="text-blue-600 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-blue-800 font-semibold mb-1">
                Limitações de Edição
              </p>
              <p className="text-sm text-blue-700">
                Algumas configurações avançadas (público-alvo, canais, agendamento) devem ser editadas em suas seções específicas.
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all"
          >
            <Save size={18} />
            Salvar Alterações
          </button>
        </div>
      </form>
    </motion.div>
  );
}