// src/pages/Campaigns/components/AudienceSelector/SegmentPreview.tsx
// 👥 PREVIEW DO SEGMENTO DE PÚBLICO

import { useEffect, useState } from 'react';
import { Users, Loader } from 'lucide-react';
import type { AudienceFilter } from '../../types/campaign.types';

interface SegmentPreviewProps {
  filters: AudienceFilter[];
  schoolId: number;
  isLoading: boolean;
  onUpdate: (count: number) => void;
}

export default function SegmentPreview({
  filters,
  schoolId,
  isLoading,
  onUpdate,
}: SegmentPreviewProps) {
  
  const [preview, setPreview] = useState<{
    count: number;
    sample: Array<{ id: number; name: string; email?: string }>;
  }>({ count: 0, sample: [] });

  useEffect(() => {
    // Simular busca de preview
    // Em produção, fazer requisição real à API
    const mockPreview = {
      count: Math.floor(Math.random() * 200) + 50,
      sample: [
        { id: 1, name: 'Maria Silva', email: 'maria@email.com' },
        { id: 2, name: 'João Santos', email: 'joao@email.com' },
        { id: 3, name: 'Ana Costa', email: 'ana@email.com' },
      ],
    };
    
    setPreview(mockPreview);
    onUpdate(mockPreview.count);
  }, [filters, schoolId, onUpdate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin text-purple-600" size={32} />
        <span className="ml-3 text-gray-600">Carregando preview...</span>
      </div>
    );
  }

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Users className="text-purple-600" size={24} />
          <div>
            <h4 className="font-bold text-gray-900">Preview do Público</h4>
            <p className="text-sm text-gray-600">{preview.count} contatos encontrados</p>
          </div>
        </div>
      </div>

      {/* Sample Contacts */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
          Amostra (primeiros 3):
        </p>
        {preview.sample.map((contact) => (
          <div key={contact.id} className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-purple-600">
                {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{contact.name}</p>
              {contact.email && (
                <p className="text-xs text-gray-500">{contact.email}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}