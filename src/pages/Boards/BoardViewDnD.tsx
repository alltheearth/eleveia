// src/pages/Boards/BoardViewDnD.tsx
// 📋 VISUALIZAÇÃO DO BOARD COM DRAG & DROP - VERSÃO REFATORADA E CORRIGIDA
// 
// ✅ Layout corrigido usando PageModel
// ✅ Drag and drop funcionando corretamente
// ✅ Seguindo padrões da página Leads
// ✅ Estrutura organizada e profissional

import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  MoreVertical, 
  Star, 
  Archive,
  Settings,
  Users,
  Filter,
  Search,
  X,
  Layout as LayoutIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

// ============================================
// LAYOUT
// ============================================
import PageModel from '../../components/layout/PageModel';
import { ListPageHeader } from '../../components/layout/PageHeader';

// ============================================
// COMPONENTS
// ============================================
import BoardListDnD from './components/List/BoardListDnD';
import AddListButton from './components/List/AddListButton';
import CardModal from './components/Card/CardModal';
import DraggableCard from './components/Card/DraggableCard';

// ============================================
// TYPES & CONSTANTS
// ============================================
import type { 
  Board, 
  BoardList as List, 
  BoardCard, 
  ListFormData, 
  CardFormData 
} from '../../types/boards';
import { BOARD_COLORS } from '../../constants/boards';

// ============================================
// MOCK DATA
// ============================================
import { MOCK_BOARDS, MOCK_LISTS, MOCK_CARDS } from '../../mock/boards.mock';

// ============================================
// BOARD TOOLBAR COMPONENT
// ============================================

interface BoardToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  board: Board;
  onToggleStar: () => void;
  onArchive: () => void;
  onSettings: () => void;
}

function BoardToolbar({ 
  searchTerm, 
  onSearchChange, 
  showFilters, 
  onToggleFilters,
  board,
  onToggleStar,
  onArchive,
  onSettings,
}: BoardToolbarProps) {
  const [showMenu, setShowMenu] = useState(false);
  const colorConfig = BOARD_COLORS[board.color || 'blue'];

  return (
    <div className="bg-white border-b border-gray-200 rounded-xl shadow-sm mb-6">
      {/* Header com gradiente */}
      <div className={`bg-gradient-to-r ${colorConfig.gradient} px-6 py-4 rounded-t-xl`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {board.title}
            </h2>
            {board.description && (
              <p className="text-sm text-white/80 line-clamp-1">
                {board.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleStar}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Favoritar"
            >
              <Star 
                className={`text-white ${board.is_starred ? 'fill-current' : ''}`} 
                size={20} 
              />
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

              <AnimatePresence>
                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20"
                    >
                      <button
                        onClick={() => {
                          onSettings();
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                      >
                        <Settings size={16} className="text-gray-500" />
                        <span className="text-sm font-semibold text-gray-700">
                          Configurações
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          onArchive();
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                      >
                        <Archive size={16} className="text-gray-500" />
                        <span className="text-sm font-semibold text-gray-700">
                          Arquivar
                        </span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de ferramentas */}
      <div className="px-6 py-4">
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
  // DND SETUP - CORRIGIDO
  // ============================================

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Distância mínima para ativar drag
        tolerance: 5,
        delay: 0,
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
  // HANDLERS
  // ============================================

  const handleBack = () => {
    navigate('/boards');
  };

  const handleToggleStar = () => {
    toast.success(board?.is_starred ? '⭐ Removido dos favoritos' : '⭐ Adicionado aos favoritos');
  };

  const handleArchive = () => {
    toast.success('📦 Board arquivado com sucesso!');
    navigate('/boards');
  };

  const handleSettings = () => {
    toast.info('⚙️ Configurações do board');
  };

  // ============================================
  // LIST OPERATIONS
  // ============================================

  const handleCreateList = (data: ListFormData) => {
    const newList: List = {
      id: Math.max(...lists.map(l => l.id), 0) + 1,
      board: parseInt(id || '0'),
      title: data.title,
      position: lists.length,
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setLists(prev => [...prev, newList]);
    toast.success('✅ Lista criada!');
  };

  const handleUpdateList = (listId: number, title: string) => {
    setLists(prev => prev.map(l =>
      l.id === listId ? { ...l, title, updated_at: new Date().toISOString() } : l
    ));
    toast.success('✅ Lista atualizada!');
  };

  const handleDeleteList = (listId: number) => {
    setLists(prev => prev.filter(l => l.id !== listId));
    setCards(prev => prev.filter(c => c.list !== listId));
    toast.success('✅ Lista deletada!');
  };

  // ============================================
  // CARD OPERATIONS
  // ============================================

  const handleCreateCard = (data: CardFormData) => {
    const newCard: BoardCard = {
      id: Math.max(...cards.map(c => c.id), 0) + 1,
      board: data.board,
      list: data.list,
      title: data.title,
      description: data.description,
      position: cards.filter(c => c.list === data.list).length,
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setCards(prev => [...prev, newCard]);
    toast.success('✅ Card criado!');
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
  // DND HANDLERS - CORRIGIDOS E COMPLETOS
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

    // Card sendo arrastado sobre outra lista
    if (activeData?.type === 'card' && overData?.type === 'list') {
      const activeCard = activeData.card as BoardCard;
      const overList = overData.list as List;

      // Se o card está mudando de lista
      if (activeCard.list !== overList.id) {
        setCards(prev => {
          const activeIndex = prev.findIndex(c => c.id === activeCard.id);
          const newCards = [...prev];
          
          // Atualiza a lista do card
          newCards[activeIndex] = {
            ...newCards[activeIndex],
            list: overList.id,
            position: prev.filter(c => c.list === overList.id).length,
          };

          return newCards;
        });
      }
    }

    // Card sendo arrastado sobre outro card
    if (activeData?.type === 'card' && overData?.type === 'card') {
      const activeCard = activeData.card as BoardCard;
      const overCard = overData.card as BoardCard;

      if (activeCard.id !== overCard.id) {
        setCards(prev => {
          const oldIndex = prev.findIndex(c => c.id === activeCard.id);
          const newIndex = prev.findIndex(c => c.id === overCard.id);

          const newCards = arrayMove(prev, oldIndex, newIndex);
          
          // Recalcula as posições dos cards
          return newCards.map((card, index) => ({
            ...card,
            position: index,
            list: card.id === activeCard.id ? overCard.list : card.list,
          }));
        });
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

    // Reorganizar listas
    if (activeData?.type === 'list' && overData?.type === 'list') {
      const oldIndex = lists.findIndex(l => l.id === activeData.list.id);
      const newIndex = lists.findIndex(l => l.id === overData.list.id);

      if (oldIndex !== newIndex) {
        const newLists = arrayMove(lists, oldIndex, newIndex);
        setLists(newLists.map((list, index) => ({
          ...list,
          position: index,
        })));
        toast.success('✅ Lista movida!');
      }
    }

    // Card drop final
    if (activeData?.type === 'card') {
      // Recalcula posições finais de todos os cards
      setCards(prev => {
        const grouped = prev.reduce((acc, card) => {
          if (!acc[card.list]) acc[card.list] = [];
          acc[card.list].push(card);
          return acc;
        }, {} as Record<number, BoardCard[]>);

        const reordered: BoardCard[] = [];
        Object.values(grouped).forEach(listCards => {
          listCards.sort((a, b) => a.position - b.position);
          listCards.forEach((card, index) => {
            reordered.push({ ...card, position: index });
          });
        });

        return reordered;
      });

      toast.success('✅ Card movido!');
    }
  };

  // ============================================
  // RENDER
  // ============================================

  if (!board) {
    return (
      <PageModel>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="text-center">
            <LayoutIcon className="mx-auto mb-4 text-gray-400" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Board não encontrado
            </h2>
            <p className="text-gray-600 mb-6">
              O board que você está procurando não existe ou foi removido.
            </p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-blue-600/30"
            >
              Voltar para Boards
            </button>
          </div>
        </div>
      </PageModel>
    );
  }

  return (
    <PageModel>
      {/* Header da Página */}
      <ListPageHeader
        title="Boards"
        subtitle="Organize suas tarefas e projetos"
        icon={<LayoutIcon size={16} />}
        onRefresh={() => toast.success('🔄 Atualizado!')}
      />

      {/* Botão Voltar */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold mb-4 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Voltar para Boards</span>
      </motion.button>

      {/* Toolbar do Board */}
      <BoardToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        board={board}
        onToggleStar={handleToggleStar}
        onArchive={handleArchive}
        onSettings={handleSettings}
      />

      {/* DnD Context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Board Content - Container com scroll horizontal */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto overflow-y-hidden">
            <div className="flex gap-6 p-6 min-w-max" style={{ minHeight: '600px' }}>
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
                        transition={{ duration: 0.2 }}
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

              {/* Botão Adicionar Lista */}
              <AddListButton onCreateList={handleCreateList} />
            </div>
          </div>
        </div>

        {/* Drag Overlay - Mostra o card sendo arrastado */}
        <DragOverlay>
          {activeCard && (
            <div className="rotate-2 opacity-90 cursor-grabbing">
              <div className="w-80">
                <DraggableCard
                  card={activeCard}
                  onClick={() => {}}
                  onUpdate={() => {}}
                  onDelete={() => {}}
                />
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Card Modal */}
      <AnimatePresence>
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
      </AnimatePresence>
    </PageModel>
  );
}