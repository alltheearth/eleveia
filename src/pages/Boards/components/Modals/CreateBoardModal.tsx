// src/pages/Boards/components/Modals/CreateBoardModal.tsx
// ➕ MODAL CRIAR/EDITAR BOARD

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  X, 
  Palette,
  Check,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BOARD_COLORS } from '../../../../constants/boards';
import type { Board } from '../../../../types/boards';

// ============================================
// TYPES
// ============================================

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { title: string; description?: string; color: string }) => void;
  editingBoard?: Board | null;
  onUpdate?: (id: number, data: Partial<Board>) => void;
}

// ============================================
// SUGGESTED BOARDS (Templates)
// ============================================

const BOARD_TEMPLATES = [
  {
    title: 'Planejamento Semanal',
    description: 'Organize suas tarefas da semana',
    color: 'blue',
    icon: '📅',
  },
  {
    title: 'Projeto Escolar',
    description: 'Gerencie projetos e trabalhos',
    color: 'purple',
    icon: '🎓',
  },
  {
    title: 'Eventos e Atividades',
    description: 'Calendário de eventos escolares',
    color: 'orange',
    icon: '🎉',
  },
  {
    title: 'Captação de Alunos',
    description: 'Funil de leads e matrículas',
    color: 'green',
    icon: '💼',
  },
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function CreateBoardModal({
  isOpen,
  onClose,
  onCreate,
  editingBoard,
  onUpdate,
}: CreateBoardModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [showTemplates, setShowTemplates] = useState(!editingBoard);

  useEffect(() => {
    if (editingBoard) {
      setTitle(editingBoard.title);
      setDescription(editingBoard.description || '');
      setSelectedColor(editingBoard.color || 'blue');
      setShowTemplates(false);
    } else {
      setTitle('');
      setDescription('');
      setSelectedColor('blue');
      setShowTemplates(true);
    }
  }, [editingBoard, isOpen]);

  if (!isOpen) return null;

  const isEditing = !!editingBoard;

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    if (title.trim().length < 3) {
      toast.error('Título deve ter no mínimo 3 caracteres');
      return;
    }

    if (isEditing && editingBoard && onUpdate) {
      onUpdate(editingBoard.id, {
        title: title.trim(),
        description: description.trim(),
        color: selectedColor,
      });
      toast.success('✅ Board atualizado com sucesso!');
    } else {
      onCreate({
        title: title.trim(),
        description: description.trim(),
        color: selectedColor,
      });
      toast.success('✅ Board criado com sucesso!');
    }
    
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setSelectedColor('blue');
    setShowTemplates(true);
    onClose();
  };

  const handleSelectTemplate = (template: typeof BOARD_TEMPLATES[0]) => {
    setTitle(template.title);
    setDescription(template.description);
    setSelectedColor(template.color);
    setShowTemplates(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        
        {/* Header */}
        <div className={`bg-gradient-to-r ${BOARD_COLORS[selectedColor as keyof typeof BOARD_COLORS]?.gradient || 'from-blue-500 to-blue-600'} px-6 py-5 flex items-center justify-between transition-all`}>
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
            >
              {isEditing ? (
                <Palette className="text-white" size={24} />
              ) : (
                <Plus className="text-white" size={24} />
              )}
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {isEditing ? 'Editar Board' : 'Criar Novo Board'}
              </h3>
              <p className="text-sm text-white/80">
                {isEditing ? 'Atualize as informações do board' : 'Organize suas tarefas de forma visual'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="text-white" size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          
          {/* Templates (apenas ao criar) */}
          {!isEditing && showTemplates && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={20} className="text-blue-600" />
                  <h4 className="font-bold text-gray-900">Templates Sugeridos</h4>
                </div>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="text-sm text-gray-600 hover:text-gray-900 font-semibold hover:underline"
                >
                  Criar do zero
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {BOARD_TEMPLATES.map((template, index) => (
                  <motion.button
                    key={template.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSelectTemplate(template)}
                    className="group text-left p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${BOARD_COLORS[template.color as keyof typeof BOARD_COLORS].gradient} rounded-lg flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                        {template.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-gray-900 mb-1">{template.title}</h5>
                        <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  💡 Você pode personalizar qualquer template depois
                </p>
              </div>
            </motion.div>
          )}

          {/* Form */}
          {(!showTemplates || isEditing) && (
            <div className="space-y-6">
              
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Título do Board *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ex: Planejamento do Semestre 2024"
                  autoFocus
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 font-semibold"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {title.length}/50 caracteres
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Descrição (opcional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Descreva o propósito deste board..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 resize-none"
                />
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Escolha uma cor
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(BOARD_COLORS).map(([key, config]) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedColor(key)}
                      className={`group relative h-16 rounded-xl transition-all ${
                        selectedColor === key
                          ? 'ring-4 ring-gray-900'
                          : 'hover:ring-2 hover:ring-gray-400'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-xl`} />
                      
                      {selectedColor === key && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <Check size={20} className="text-gray-900" />
                          </div>
                        </motion.div>
                      )}
                      
                      <div className="absolute bottom-1.5 left-2 right-2">
                        <span className="text-xs text-white font-bold capitalize drop-shadow-md">
                          {key}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Keyboard Shortcuts Hint */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3">
                <p className="text-xs text-blue-700 flex items-center gap-2">
                  <Sparkles size={14} />
                  <span>
                    💡 Dica: Pressione{' '}
                    <kbd className="px-1.5 py-0.5 bg-white border border-blue-300 rounded text-xs">
                      Ctrl
                    </kbd>{' '}
                    +{' '}
                    <kbd className="px-1.5 py-0.5 bg-white border border-blue-300 rounded text-xs">
                      Enter
                    </kbd>{' '}
                    para salvar rapidamente
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {(!showTemplates || isEditing) && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? 'Salvar Alterações' : 'Criar Board'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}