// src/pages/Boards/components/Modals/BoardSettingsModal.tsx
// ⚙️ CONFIGURAÇÕES DO BOARD - VERSÃO CORRIGIDA

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  X, 
  Palette, 
  Archive,
  Trash2,
  Users,
  Eye,
  Lock,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BOARD_COLORS } from '../../../../constants/boards';
import type { Board, BoardColor } from '../../../../types/boards';

// ============================================
// TYPES
// ============================================

interface BoardSettingsModalProps {
  isOpen: boolean;
  board: Board;
  onClose: () => void;
  onUpdate: (updates: Partial<Board>) => void;
  onArchive: () => void;
  onDelete: () => void;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function BoardSettingsModal({
  isOpen,
  board,
  onClose,
  onUpdate,
  onArchive,
  onDelete,
}: BoardSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'members' | 'danger'>('general');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [title, setTitle] = useState(board.title);
  const [description, setDescription] = useState(board.description || '');
  const [selectedColor, setSelectedColor] = useState<BoardColor>(board.color || 'blue');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    onUpdate({
      title: title.trim(),
      description: description.trim(),
      color: selectedColor,
    });
    toast.success('✅ Configurações atualizadas!');
    onClose();
  };

  const handleArchive = () => {
    onArchive();
    toast.success('📦 Board arquivado!');
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    toast.success('🗑️ Board deletado!');
    onClose();
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
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Settings className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Configurações do Board</h3>
              <p className="text-sm text-gray-300">Personalize e gerencie seu board</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="text-white" size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all border-b-2 ${
                activeTab === 'general'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Palette size={18} />
              Geral
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all border-b-2 ${
                activeTab === 'members'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users size={18} />
              Membros
            </button>
            <button
              onClick={() => setActiveTab('danger')}
              className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all border-b-2 ${
                activeTab === 'danger'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <AlertTriangle size={18} />
              Zona de Perigo
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          
          {/* Tab: General */}
          {activeTab === 'general' && (
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Descrição
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 resize-none"
                  placeholder="Descreva o propósito deste board..."
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Cor do Board
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {(Object.keys(BOARD_COLORS) as BoardColor[]).map((key) => {
                    const config = BOARD_COLORS[key];
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedColor(key)}
                        className={`group relative h-20 rounded-xl transition-all ${
                          selectedColor === key
                            ? 'ring-4 ring-gray-900 scale-105'
                            : 'hover:scale-105'
                        }`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-xl`} />
                        {selectedColor === key && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-2xl">✓</span>
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 right-2">
                          <span className="text-xs text-white font-bold capitalize">
                            {key}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Members */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <Users size={64} className="mx-auto text-gray-300 mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Gerenciamento de Membros
                </h4>
                <p className="text-gray-600 mb-6">
                  Convide pessoas para colaborar neste board
                </p>
                
                {/* Visibility */}
                <div className="max-w-md mx-auto space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-blue-50 border-2 border-blue-500 rounded-xl text-left">
                    <div className="flex items-center gap-3">
                      <Eye size={20} className="text-blue-600" />
                      <div>
                        <p className="font-bold text-gray-900">Público</p>
                        <p className="text-sm text-gray-600">Todos na organização podem ver</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition text-left">
                    <div className="flex items-center gap-3">
                      <Lock size={20} className="text-gray-600" />
                      <div>
                        <p className="font-bold text-gray-900">Privado</p>
                        <p className="text-sm text-gray-600">Apenas membros convidados</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Danger Zone */}
          {activeTab === 'danger' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle size={24} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Atenção!</h4>
                  <p className="text-sm text-gray-700">
                    As ações abaixo são permanentes e não podem ser desfeitas. Proceda com cuidado.
                  </p>
                </div>
              </div>

              {/* Archive Board */}
              <div className="border-2 border-orange-200 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Archive size={20} className="text-orange-600" />
                      <h4 className="font-bold text-gray-900">Arquivar Board</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      O board será ocultado, mas poderá ser restaurado posteriormente.
                    </p>
                  </div>
                  <button
                    onClick={handleArchive}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold shadow-md whitespace-nowrap"
                  >
                    Arquivar
                  </button>
                </div>
              </div>

              {/* Delete Board */}
              <div className="border-2 border-red-300 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Trash2 size={20} className="text-red-600" />
                      <h4 className="font-bold text-gray-900">Deletar Board</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      O board e todos os seus dados serão permanentemente apagados. Esta ação não pode ser desfeita!
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold shadow-md whitespace-nowrap"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTab === 'general' && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-md"
            >
              Salvar Alterações
            </button>
          </div>
        )}

        {activeTab !== 'general' && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-semibold"
            >
              Fechar
            </button>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Confirmar Exclusão
              </h3>
              <p className="text-gray-600">
                Tem certeza que deseja deletar permanentemente o board "<strong>{board.title}</strong>"?
              </p>
              <p className="text-sm text-red-600 font-semibold mt-2">
                Esta ação não pode ser desfeita!
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold shadow-md"
              >
                Sim, Deletar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}