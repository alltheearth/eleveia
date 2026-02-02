// src/pages/Boards/BoardViewDnD.tsx
// 📋 VISUALIZAÇÃO DO BOARD COM DRAG & DROP COMPLETO

import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  MoreVertical, 
  Star, 
  Archive,
  Settings,
  Users,
  Filter,
  Search,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';

import type {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';

import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

// Components
import BoardListDnD from './components/List/BoardListDnD';
import AddListButton from './components/List/AddListButton';
import CardModal from './components/Card/CardModal';
import DraggableCard from './components/Card/DraggableCard';

// Types & Constants
import type { Board, BoardList as List, BoardCard, ListFormData, CardFormData } from '../../types/boards';
import { BOARD_COLORS } from '../../constants/boards';

// Mock Data
import { MOCK_BOARDS, MOCK_LISTS, MOCK_CARDS } from '../../mock/boards.mock';

// ============================================
// BOARD HEADER COMPONENT
// ============================================

interface BoardHeaderProps {
  board: Board;
  onBack: () => void;
  onToggleStar: () => void;
  onArchive: () => void;
  onSettings: () => void;
}

function BoardHeader({ board, onBack, onToggleStar, onArchive, onSettings }: BoardHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const colorConfig = BOARD_COLORS[board.color || 'blue'];

  return (
    <div className={`bg-gradient-to-r ${colorConfig.gradient} px-6 py-5 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="text-white" size={24} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {board.title}
            </h1>
            {board.description && (
              <p className="text-sm text-white/80 line-clamp-1">
                {board.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleStar}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Favoritar"
          >
            <Star className="text-white" size={20} />
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-semibold backdrop-blur-sm">
            <Users size={18} />
            <span className="hidden sm:inline">Compartilhar</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <MoreVertical className="text-white" size={20} />
            </button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 min-w-[200px]"
              >
                <button
                  onClick={() => {
                    onSettings();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <Settings size={16} className="text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">Configurações</span>
                </button>
                <button
                  onClick={() => {
                    onArchive();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <Archive size={16} className="text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">Arquivar Board</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// BOARD TOOLBAR COMPONENT
// ============================================

interface BoardToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

function BoardToolbar({ searchTerm, onSearchChange, showFilters, onToggleFilters }: BoardToolbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar cards..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          onClick={onToggleFilters}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all font-semibold text-sm ${
            showFilters
              ? 'bg-blue-50 border-blue-600 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
          }`}
        >
          <Filter size={16} />
          <span className="hidden sm:inline">Filtros</span>
        </button>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function BoardViewDnD() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ============================================
  // STATE
  // ============================================

  const [board] = useState<Board | null>(
    MOCK_BOARDS.find(b => b.id === parseInt(id || '0')) || null
  );

  const [lists, setLists] = useState<List[]>(
    MOCK_LISTS.filter(l => l.board === parseInt(id || '0'))
  );

  const [cards, setCards] = useState<BoardCard[]>(
    MOCK_CARDS.filter(c => c.board === parseInt(id || '0'))
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCard, setSelectedCard] = useState<BoardCard | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);

  // Drag & Drop state
  const [activeCard, setActiveCard] = useState<BoardCard | null>(null);
  const [activeList, setActiveList] = useState<List | null>(null);

  // ============================================
  // DND SETUP
  // ============================================

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    })
  );

  // ============================================
  // COMPUTED
  // ============================================

  const filteredCards = useMemo(() => {
    return cards.filter(card =>
      !card.is_archived &&
      card.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cards, searchTerm]);

  // ============================================
  // DND HANDLERS
  // ============================================

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;

    if (activeData?.type === 'card') {
      setActiveCard(activeData.card);
    } else if (activeData?.type === 'list') {
      setActiveList(activeData.list);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Only handle card dragging over lists
    if (activeData?.type === 'card' && overData?.type === 'list') {
      const activeCard = activeData.card as BoardCard;
      const overList = overData.list as List;

      if (activeCard.list !== overList.id) {
        setCards(prev => prev.map(card =>
          card.id === activeCard.id
            ? { ...card, list: overList.id }
            : card
        ));
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveCard(null);
    setActiveList(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle card reordering
    if (activeData?.type === 'card' && overData?.type === 'card') {
      const activeCard = activeData.card as BoardCard;
      const overCard = overData.card as BoardCard;

      if (activeCard.id !== overCard.id && activeCard.list === overCard.list) {
        setCards(prev => {
          const listCards = prev.filter(c => c.list === activeCard.list);
          const oldIndex = listCards.findIndex(c => c.id === activeCard.id);
          const newIndex = listCards.findIndex(c => c.id === overCard.id);
          
          const reordered = arrayMove(listCards, oldIndex, newIndex);
          const otherCards = prev.filter(c => c.list !== activeCard.list);
          
          return [
            ...otherCards,
            ...reordered.map((card, index) => ({ ...card, position: index }))
          ];
        });
        
        toast.success('Card reordenado!');
      }
    }

    // Handle list reordering
    if (activeData?.type === 'list' && overData?.type === 'list') {
      const activeList = activeData.list as List;
      const overList = overData.list as List;

      if (activeList.id !== overList.id) {
        setLists(prev => {
          const oldIndex = prev.findIndex(l => l.id === activeList.id);
          const newIndex = prev.findIndex(l => l.id === overList.id);
          
          const reordered = arrayMove(prev, oldIndex, newIndex);
          return reordered.map((list, index) => ({ ...list, position: index }));
        });
        
        toast.success('Lista reordenada!');
      }
    }
  };

  // ============================================
  // REGULAR HANDLERS
  // ============================================

  const handleBack = () => {
    navigate('/boards');
  };

  const handleToggleStar = () => {
    toast.success('Board favoritado!');
  };

  const handleArchive = () => {
    if (window.confirm('Tem certeza que deseja arquivar este board?')) {
      toast.success('Board arquivado!');
      navigate('/boards');
    }
  };

  const handleSettings = () => {
    toast.success('Configurações do board');
  };

  const handleCreateList = (data: ListFormData) => {
    const newList: List = {
      id: Math.max(...lists.map(l => l.id), 0) + 1,
      board: parseInt(id || '0'),
      title: data.title,
      position: lists.length,
      is_archived: false,
      created_at: new Date().toISOString(),
    };
    setLists(prev => [...prev, newList]);
    toast.success('✅ Lista criada com sucesso!');
  };

  const handleUpdateList = (listId: number, title: string) => {
    setLists(prev => prev.map(l => 
      l.id === listId ? { ...l, title } : l
    ));
    toast.success('✅ Lista atualizada!');
  };

  const handleDeleteList = (listId: number) => {
    if (window.confirm('Deletar esta lista e todos os seus cards?')) {
      setLists(prev => prev.filter(l => l.id !== listId));
      setCards(prev => prev.filter(c => c.list !== listId));
      toast.success('✅ Lista deletada!');
    }
  };

  const handleCreateCard = (data: CardFormData) => {
    const newCard: BoardCard = {
      id: Math.max(...cards.map(c => c.id), 0) + 1,
      list: data.list,
      board: parseInt(id || '0'),
      title: data.title,
      description: data.description,
      position: cards.filter(c => c.list === data.list).length,
      due_date: data.due_date,
      priority: data.priority,
      labels: data.labels,
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setCards(prev => [...prev, newCard]);
    toast.success('✅ Card criado com sucesso!');
  };

  const handleUpdateCard = (cardId: number, data: Partial<BoardCard>) => {
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, ...data, updated_at: new Date().toISOString() } : c
    ));
    toast.success('✅ Card atualizado!');
  };

  const handleDeleteCard = (cardId: number) => {
    setCards(prev => prev.filter(c => c.id !== cardId));
    toast.success('✅ Card deletado!');
  };

  const handleCardClick = (card: BoardCard) => {
    setSelectedCard(card);
    setShowCardModal(true);
  };

  // ============================================
  // RENDER
  // ============================================

  if (!board) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Board não encontrado</h2>
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Voltar para boards
          </button>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <BoardHeader
          board={board}
          onBack={handleBack}
          onToggleStar={handleToggleStar}
          onArchive={handleArchive}
          onSettings={handleSettings}
        />

        {/* Toolbar */}
        <BoardToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {/* Board Content */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-6 p-6 h-full min-w-max">
            <SortableContext
              items={lists.map(l => `list-${l.id}`)}
              strategy={horizontalListSortingStrategy}
            >
              <AnimatePresence mode="popLayout">
                {lists
                  .filter(l => !l.is_archived)
                  .sort((a, b) => a.position - b.position)
                  .map((list) => (
                    <motion.div
                      key={list.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <BoardListDnD
                        list={list}
                        cards={filteredCards.filter(c => c.list === list.id)}
                        onUpdateList={handleUpdateList}
                        onDeleteList={handleDeleteList}
                        onCreateCard={handleCreateCard}
                        onUpdateCard={handleUpdateCard}
                        onDeleteCard={handleDeleteCard}
                        onCardClick={handleCardClick}
                        isDragging={activeList?.id === list.id}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </SortableContext>

            <AddListButton onCreateList={handleCreateList} />
          </div>
        </div>

        {/* Drag Overlays */}
        <DragOverlay>
          {activeCard && (
            <div className="rotate-3 opacity-90">
              <DraggableCard
                card={activeCard}
                onClick={() => {}}
                onUpdate={() => {}}
                onDelete={() => {}}
              />
            </div>
          )}
        </DragOverlay>

        {/* Card Modal */}
        {showCardModal && selectedCard && (
          <CardModal
            card={selectedCard}
            onClose={() => {
              setShowCardModal(false);
              setSelectedCard(null);
            }}
            onUpdate={(data) => {
              handleUpdateCard(selectedCard.id, data);
              setSelectedCard({ ...selectedCard, ...data });
            }}
            onDelete={() => {
              handleDeleteCard(selectedCard.id);
              setShowCardModal(false);
              setSelectedCard(null);
            }}
          />
        )}
      </div>
    </DndContext>
  );
}