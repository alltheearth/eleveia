// src/pages/Campaigns/components/AudienceSelector/index.tsx
// 🎯 SELETOR AVANÇADO DE PÚBLICO-ALVO

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Filter, 
  Upload, 
  UserCheck,
  Bookmark,
  Info,
  AlertCircle
} from 'lucide-react';
import FilterBuilder from './FilterBuilder';
import SegmentPreview from './SegmentPreview';
import ManualSelection from './ManualSelection';
import ImportList from './ImportList';
import SavedSegments from './SavedSegments';
import type { AudienceFilter } from '../../../../types/campaigns/campaign.types';

// ============================================
// TYPES
// ============================================

interface AudienceSelectorProps {
  value: {
    filters: AudienceFilter[];
    manual_contacts?: number[];
  };
  onChange: (value: {
    filters: AudienceFilter[];
    manual_contacts?: number[];
  }) => void;
  schoolId: number;
  onSave?: () => void;
  onCancel?: () => void;
}

type SelectionMode = 'filters' | 'manual' | 'import' | 'saved';

// ============================================
// COMPONENT
// ============================================

export default function AudienceSelector({
  value,
  onChange,
  schoolId,
  onSave,
  onCancel,
}: AudienceSelectorProps) {
  
  // ============================================
  // STATE
  // ============================================
  
  const [mode, setMode] = useState<SelectionMode>('filters');
  const [audienceCount, setAudienceCount] = useState(0);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // ============================================
  // HANDLERS
  // ============================================
  
  const handleFiltersChange = useCallback((filters: AudienceFilter[]) => {
    onChange({
      ...value,
      filters,
    });
  }, [value, onChange]);

  const handleManualContactsChange = useCallback((contacts: number[]) => {
    onChange({
      ...value,
      manual_contacts: contacts,
    });
  }, [value, onChange]);

  const handleImportComplete = useCallback((contacts: number[]) => {
    onChange({
      ...value,
      manual_contacts: [...(value.manual_contacts || []), ...contacts],
    });
    setMode('manual');
  }, [value, onChange]);

  const handleSegmentLoad = useCallback((segment: {
    filters: AudienceFilter[];
    manual_contacts?: number[];
  }) => {
    onChange(segment);
  }, [onChange]);

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
              <Users className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Seleção de Público</h3>
              <p className="text-white/80 text-sm">
                Defina quem receberá esta campanha
              </p>
            </div>
          </div>

          {/* Audience Count */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
            <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">
              Destinatários
            </p>
            <p className="text-white text-2xl font-bold">
              {audienceCount}
            </p>
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setMode('filters')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
              mode === 'filters'
                ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            <Filter size={18} />
            <span>Filtros Avançados</span>
          </button>

          <button
            onClick={() => setMode('manual')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
              mode === 'manual'
                ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            <UserCheck size={18} />
            <span>Seleção Manual</span>
            {(value.manual_contacts?.length || 0) > 0 && (
              <span className="px-2 py-0.5 bg-purple-600 text-white rounded-full text-xs font-bold">
                {value.manual_contacts?.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setMode('import')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
              mode === 'import'
                ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            <Upload size={18} />
            <span>Importar Lista</span>
          </button>

          <button
            onClick={() => setMode('saved')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
              mode === 'saved'
                ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            <Bookmark size={18} />
            <span>Segmentos Salvos</span>
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-blue-900">
              {mode === 'filters' && (
                <span>
                  <strong>Filtros:</strong> Crie regras para selecionar automaticamente os destinatários com base em critérios como série, idade, status, etc.
                </span>
              )}
              {mode === 'manual' && (
                <span>
                  <strong>Manual:</strong> Selecione contatos específicos um por um para incluir na campanha.
                </span>
              )}
              {mode === 'import' && (
                <span>
                  <strong>Importar:</strong> Faça upload de uma planilha CSV com a lista de emails ou telefones dos destinatários.
                </span>
              )}
              {mode === 'saved' && (
                <span>
                  <strong>Segmentos:</strong> Use segmentos de público pré-configurados e salvos anteriormente.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {mode === 'filters' && (
            <motion.div
              key="filters"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <FilterBuilder
                filters={value.filters}
                onChange={handleFiltersChange}
                schoolId={schoolId}
                onPreviewUpdate={setAudienceCount}
              />
            </motion.div>
          )}

          {mode === 'manual' && (
            <motion.div
              key="manual"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <ManualSelection
                selectedContacts={value.manual_contacts || []}
                onChange={handleManualContactsChange}
                schoolId={schoolId}
              />
            </motion.div>
          )}

          {mode === 'import' && (
            <motion.div
              key="import"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <ImportList
                onImportComplete={handleImportComplete}
                schoolId={schoolId}
              />
            </motion.div>
          )}

          {mode === 'saved' && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <SavedSegments
                onLoad={handleSegmentLoad}
                schoolId={schoolId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Preview Section */}
      {mode === 'filters' && value.filters.length > 0 && (
        <div className="px-6 pb-6">
          <SegmentPreview
            filters={value.filters}
            schoolId={schoolId}
            isLoading={isLoadingPreview}
            onUpdate={setAudienceCount}
          />
        </div>
      )}

      {/* Warning quando não há destinatários */}
      {audienceCount === 0 && value.filters.length > 0 && (
        <div className="px-6 pb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
          >
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-semibold text-yellow-900">
                Nenhum destinatário encontrado
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Os filtros atuais não correspondem a nenhum contato. Ajuste os critérios ou selecione contatos manualmente.
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer Actions */}
      {(onSave || onCancel) && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <strong>{audienceCount}</strong> destinatário{audienceCount !== 1 ? 's' : ''} selecionado{audienceCount !== 1 ? 's' : ''}
          </div>
          
          <div className="flex items-center gap-3">
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-6 py-3 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Cancelar
              </button>
            )}
            {onSave && (
              <button
                onClick={onSave}
                disabled={audienceCount === 0}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Público
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}