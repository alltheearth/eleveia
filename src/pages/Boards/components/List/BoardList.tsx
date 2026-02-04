// src/pages/Boards/components/List/BoardList.tsx
// 📝 COMPONENTE DE LISTA/COLUNA DO KANBAN - VERSÃO MELHORADA

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

// Components
import BoardCardComponent from '../Board/BoardCard';

// Types
import type { BoardList as List, BoardCard, CardFormData } from '../../../../types/boards';

// ============================================
// LIST HEADER COMPONENT
// ============================================

interface ListHeaderProps {
  list: List;
  cardCount: number;
  onUpdate: (title: string) => void;
  onDelete: () => void;
}

function ListHeader({ list, cardCount, onUpdate, onDelete }: ListHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [showMenu, setShowMenu] = useState(false);

  const handleSave = () => {
    if (title.trim()) {
      onUpdate(title.trim());
      setIsEditing(false);
    } else {
      toast.error('Título não pode estar vazio');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setTitle(list.title);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center justify-between mb-4 group">
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyPress}
          autoFocus
          maxLength={50}
          className="flex-1 px-3 py-2 border-2 border-blue-500 rounded-lg font-bold text-gray-900 focus:outline-none text-sm bg-white"
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="flex-1 text-left"
        >
          <h3 className="font-bold text-gray-900 flex items-center gap-2 truncate hover:text-blue-600 transition-colors">
            <span className="flex-1 truncate">{list.title}</span>
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-semibold flex-shrink-0">
              {cardCount}
            </span>
          </h3>
        </button>
      )}

      {/* Menu de ações */}
      {!isEditing && (
        <div className="relative opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical size={16} className="text-gray-600" />
          </button>

          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 min-w-[160px]"
            >
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left text-sm"
              >
                <Edit2 size={14} className="text-gray-600" />
                <span className="font-semibold text-gray-700">Renomear</span>
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 transition-colors text-left text-sm"
              >
                <Trash2 size={14} className="text-red-600" />
                <span className="font-semibold text-red-600">Deletar</span>
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// ADD CARD BUTTON COMPONENT
// ============================================

interface AddCardButtonProps {
  onAdd: (title: string) => void;
}

function AddCardButton({ onAdd }: AddCardButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    if (title.trim()) {
      onAdd(title.trim());
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
      <div className="space-y-2">
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Digite um título para este card..."
          autoFocus
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none bg-white"
        />
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
          >
            Adicionar card
          </button>
          <button
            onClick={() => {
              setTitle('');
              setIsAdding(false);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="w-full flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors font-semibold text-sm group"
    >
      <Plus size={16} className="group-hover:scale-110 transition-transform" />
      Adicionar card
    </button>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

interface BoardListProps {
  list: List;
  cards: BoardCard[];
  onUpdateList: (listId: number, title: string) => void;
  onDeleteList: (listId: number) => void;
  onCreateCard: (data: CardFormData) => void;
  onUpdateCard: (cardId: number, data: Partial<BoardCard>) => void;
  onDeleteCard: (cardId: number) => void;
  onCardClick: (card: BoardCard) => void;
}

export default function BoardList({
  list,
  cards,
  onUpdateList,
  onDeleteList,
  onCreateCard,
  onUpdateCard,
  onDeleteCard,
  onCardClick,
}: BoardListProps) {
  
  const sortedCards = cards
    .filter(c => !c.is_archived)
    .sort((a, b) => a.position - b.position);

  const handleAddCard = (title: string) => {
    onCreateCard({
      title,
      description: '',
      list: list.id,
      board: list.board,
      position: cards.length,
    });
  };

  return (
    <div className="w-80 flex-shrink-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-100 rounded-xl p-4 h-full flex flex-col shadow-sm hover:shadow-md transition-shadow"
      >
        {/* Header */}
        <ListHeader
          list={list}
          cardCount={sortedCards.length}
          onUpdate={(title) => onUpdateList(list.id, title)}
          onDelete={() => onDeleteList(list.id)}
        />

        {/* Cards Container - Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-3 min-h-[100px] max-h-[calc(100vh-280px)]">
          {sortedCards.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-gray-500 italic border-2 border-dashed border-gray-300 rounded-lg">
              Nenhum card nesta lista
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {sortedCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.03 }}
                  layout
                >
                  <BoardCardComponent
                    card={card}
                    onClick={() => onCardClick(card)}
                    onUpdate={(data) => onUpdateCard(card.id, data)}
                    onDelete={() => onDeleteCard(card.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Add Card Button */}
        <AddCardButton onAdd={handleAddCard} />
      </motion.div>
    </div>
  );
}