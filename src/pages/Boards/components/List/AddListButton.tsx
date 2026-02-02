// src/pages/Boards/components/List/AddListButton.tsx
// ➕ BOTÃO PARA ADICIONAR NOVA LISTA

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';

// Types
import type { ListFormData } from '../../../../types/boards';

interface AddListButtonProps {
  onCreateList: (data: ListFormData) => void;
}

export default function AddListButton({ onCreateList }: AddListButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    if (title.trim()) {
      onCreateList({
        title: title.trim(),
        board: 0, // Will be set by parent
        position: 0, // Will be set by parent
      });
      setTitle('');
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    } else if (e.key === 'Escape') {
      setTitle('');
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-80 flex-shrink-0"
      >
        <div className="bg-gray-100 rounded-xl p-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Digite o título da lista..."
            autoFocus
            className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
            >
              Adicionar lista
            </button>
            <button
              onClick={() => {
                setTitle('');
                setIsAdding(false);
              }}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="w-80 flex-shrink-0 h-fit"
    >
      <div className="bg-white/50 hover:bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all">
        <div className="flex items-center justify-center gap-2 text-gray-700 font-semibold">
          <Plus size={20} />
          <span>Adicionar lista</span>
        </div>
      </div>
    </button>
  );
}