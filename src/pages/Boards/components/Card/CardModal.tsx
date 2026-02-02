// src/pages/Boards/components/Card/CardModal.tsx
// 🎴 MODAL DE DETALHES E EDIÇÃO DO CARD

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  AlignLeft, 
  Calendar, 
  Tag, 
  AlertCircle,
  Trash2,
  Save,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Types & Constants
import type { BoardCard, CardPriority } from '../../../../types/boards';
import { PRIORITY_CONFIG, PREDEFINED_LABELS } from '../../../../constants/boards';

// ============================================
// MAIN COMPONENT
// ============================================

interface CardModalProps {
  card: BoardCard;
  onClose: () => void;
  onUpdate: (data: Partial<BoardCard>) => void;
  onDelete: () => void;
}

export default function CardModal({ card, onClose, onUpdate, onDelete }: CardModalProps) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [dueDate, setDueDate] = useState(card.due_date || '');
  const [priority, setPriority] = useState<CardPriority | undefined>(card.priority);
  const [labels, setLabels] = useState<string[]>(card.labels || []);
  const [showLabelPicker, setShowLabelPicker] = useState(false);

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    onUpdate({
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate || undefined,
      priority,
      labels,
    });

    toast.success('✅ Card atualizado!');
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja deletar este card?')) {
      onDelete();
      onClose();
    }
  };

  const toggleLabel = (label: string) => {
    if (labels.includes(label)) {
      setLabels(labels.filter(l => l !== label));
    } else {
      setLabels([...labels, label]);
    }
  };

  const priorityConfig = priority ? PRIORITY_CONFIG[priority] : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5 flex items-start justify-between">
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/20 backdrop-blur-sm text-white text-xl font-bold px-3 py-2 rounded-lg focus:outline-none focus:bg-white/30 placeholder:text-white/60"
              placeholder="Título do card"
            />
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition ml-3"
          >
            <X className="text-white" size={24} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Description */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlignLeft size={20} className="text-gray-600" />
              <h3 className="font-bold text-gray-900">Descrição</h3>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione uma descrição mais detalhada..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            />
          </div>

          {/* Due Date */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={20} className="text-gray-600" />
              <h3 className="font-bold text-gray-900">Data de Vencimento</h3>
            </div>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Priority */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={20} className="text-gray-600" />
              <h3 className="font-bold text-gray-900">Prioridade</h3>
            </div>
            <div className="flex gap-3">
              {(Object.keys(PRIORITY_CONFIG) as CardPriority[]).map((p) => {
                const config = PRIORITY_CONFIG[p];
                return (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                      priority === p
                        ? 'border-gray-900 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <span className="text-2xl block mb-1">{config.icon}</span>
                      <span className="text-sm font-semibold text-gray-700">{config.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {priority && (
              <button
                onClick={() => setPriority(undefined)}
                className="mt-2 text-sm text-gray-600 hover:text-gray-800 font-semibold"
              >
                Remover prioridade
              </button>
            )}
          </div>

          {/* Labels */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag size={20} className="text-gray-600" />
              <h3 className="font-bold text-gray-900">Labels</h3>
            </div>

            {/* Selected Labels */}
            {labels.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {labels.map((label, index) => {
                  const predefined = PREDEFINED_LABELS.find(l => l.name === label);
                  return (
                    <span
                      key={index}
                      className={`${predefined?.color || 'bg-gray-500'} text-white text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-2`}
                    >
                      {label}
                      <button
                        onClick={() => toggleLabel(label)}
                        className="hover:bg-white/20 rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Label Picker */}
            <div className="relative">
              <button
                onClick={() => setShowLabelPicker(!showLabelPicker)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition"
              >
                {showLabelPicker ? 'Fechar' : 'Adicionar label'}
              </button>

              {showLabelPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-10 min-w-[250px]"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {PREDEFINED_LABELS.map((label) => (
                      <button
                        key={label.name}
                        onClick={() => toggleLabel(label.name)}
                        className={`${label.color} text-white text-xs px-3 py-2 rounded-lg font-semibold hover:opacity-90 transition ${
                          labels.includes(label.name) ? 'ring-2 ring-gray-900' : ''
                        }`}
                      >
                        {label.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Created/Updated Info */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <p>Criado em {new Date(card.created_at).toLocaleString('pt-BR')}</p>
              <p>Última atualização em {new Date(card.updated_at).toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </div>

        {/* Footer - Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold transition text-sm"
          >
            <Trash2 size={16} />
            Deletar card
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition text-sm"
            >
              <Save size={16} />
              Salvar alterações
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}