// src/pages/Boards/components/Modals/EditBoardModal.tsx
// ✏️ MODAL EDITAR BOARD - Atualizar informações

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Palette, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { BOARD_COLORS } from '../../../../constants/boards';
import type { Board, BoardColor } from '../../../../types/boards';

// ============================================
// TYPES
// ============================================

interface EditBoardModalProps {
  isOpen: boolean;
  board: Board;
  onClose: () => void;
  onUpdate: (id: number, data: Partial<Board>) => void;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function EditBoardModal({
  isOpen,
  board,
  onClose,
  onUpdate,
}: EditBoardModalProps) {
  const [title, setTitle] = useState(board.title);
  const [description, setDescription] = useState(board.description || '');
  const [selectedColor, setSelectedColor] = useState<BoardColor>(board.color || 'blue');

  useEffect(() => {
    if (isOpen) {
      setTitle(board.title);
      setDescription(board.description || '');
      setSelectedColor(board.color || 'blue');
    }
  }, [isOpen, board]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    if (title.trim().length < 3) {
      toast.error('Título deve ter no mínimo 3 caracteres');
      return;
    }

    onUpdate(board.id, {
      title: title.trim(),
      description: description.trim(),
      color: selectedColor,
    });

    handleClose();
  };

  const handleClose = () => {
    setTitle(board.title);
    setDescription(board.description || '');
    setSelectedColor(board.color || 'blue');
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  const hasChanges = 
    title !== board.title ||
    description !== (board.description || '') ||
    selectedColor !== board.color;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        
        {/* Header */}
        <div className={`bg-gradient-to-r ${BOARD_COLORS[selectedColor].gradient} px-6 py-5 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Palette className="text-white" size={24} />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-white">Editar Board</h3>
              <p className="text-sm text-white/80">Atualize as informações do board</p>
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
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
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
              maxLength={50}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 font-semibold"
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500">
                {title.length}/50 caracteres
              </p>
              {title !== board.title && (
                <span className="text-xs text-blue-600 font-semibold">
                  ✏️ Modificado
                </span>
              )}
            </div>
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
              maxLength={200}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 resize-none"
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500">
                {description.length}/200 caracteres
              </p>
              {description !== (board.description || '') && (
                <span className="text-xs text-blue-600 font-semibold">
                  ✏️ Modificado
                </span>
              )}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Escolha uma cor
            </label>
            <div className="grid grid-cols-4 gap-3">
              {(Object.keys(BOARD_COLORS) as BoardColor[]).map((colorKey) => {
                const config = BOARD_COLORS[colorKey];
                const isSelected = selectedColor === colorKey;
                
                return (
                  <motion.button
                    key={colorKey}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedColor(colorKey)}
                    className={`group relative h-16 rounded-xl transition-all ${
                      isSelected
                        ? 'ring-4 ring-gray-900 shadow-lg'
                        : 'hover:ring-2 hover:ring-gray-400'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-xl`} />
                    
                    {isSelected && (
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
                        {colorKey}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            {selectedColor !== board.color && (
              <p className="text-xs text-blue-600 font-semibold mt-2">
                ✏️ Cor modificada
              </p>
            )}
          </div>

          {/* Changes Summary */}
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4"
            >
              <p className="text-sm text-blue-700 font-semibold">
                ✏️ Você tem alterações não salvas
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Pressione Ctrl+Enter para salvar rapidamente
              </p>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!hasChanges || !title.trim()}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Salvar Alterações
          </button>
        </div>
      </motion.div>
    </div>
  );
}