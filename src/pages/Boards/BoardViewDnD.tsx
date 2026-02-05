// src/pages/Boards/BoardViewDnD.tsx
// 📋 VISUALIZAÇÃO DO BOARD COM DRAG & DROP COMPLETO - VERSÃO CORRIGIDA

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
import PageModel from '../../components/layout/PageModel';
import BoardFilters, { type FilterOptions } from './components/Board/BoardFilters';
import BoardHeader from './components/Board/BoardHeader';
import BoardStats from './components/Board/BoardStats';


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
  // DND SETUP - CONFIGURAÇÃO CORRIGIDA
  // ============================================

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Menor distância = mais sensível
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
  // DND HANDLERS - CORRIGIDOS
  // ============================================

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;

    console.log('🚀 Drag Start:', activeData);

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

    console.log('🔄 Drag Over:', { activeData, overData });

    // Handle card dragging over lists
    if (activeData?.type === 'card' && overData?.type === 'list') {
      const activeCard = activeData.card as BoardCard;
      const overList = overData.list as List;

      if (activeCard.list !== overList.id) {
        console.log('📦 Moving card to new list');
        
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
    
    console.log('✅ Drag End:', { active: active.id, over: over?.id });
    
    setActiveCard(null);
    setActiveList(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle card reordering
    if (activeData?.type === 'card' && overData?.type === 'card') {
      const activeCard = activeData.card as BoardCard;
      const overCard = overData.card as BoardCard;

      console.log('🔀 Reordering cards');

      if (activeCard.id !== overCard.id) {
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
        
        toast.success('✅ Card reordenado!');
      }
    }

    // Handle list reordering
    if (activeData?.type === 'list' && overData?.type === 'list') {
      const activeList = activeData.list as List;
      const overList = overData.list as List;

      console.log('🔀 Reordering lists');

      if (activeList.id !== overList.id) {
        setLists(prev => {
          const oldIndex = prev.findIndex(l => l.id === activeList.id);
          const newIndex = prev.findIndex(l => l.id === overList.id);
          
          const reordered = arrayMove(prev, oldIndex, newIndex);
          return reordered.map((list, index) => ({ ...list, position: index }));
        });
        
        toast.success('✅ Lista reordenada!');
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
    toast.success('⭐ Board favoritado!');
  };

  const handleArchive = () => {
    if (window.confirm('Tem certeza que deseja arquivar este board?')) {
      toast.success('📦 Board arquivado!');
      navigate('/boards');
    }
  };

  const handleSettings = () => {
    toast.success('⚙️ Configurações do board');
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
    <div className="h-screen bg-gray-50">
        <BoardHeader
          board={board}
          onBack={handleBack}
          onToggleStar={handleToggleStar}
          onArchive={handleArchive}
          onSettings={handleSettings}
        />
      <PageModel>
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen bg-gray-50">

        {/* Header */}
        <BoardStats cards={[]} />

        {/* Toolbar */}
        <BoardFilters filters={{
              "search": "string",
              "labels": ['teste'],
              "priorities": ['low'],
              "dueDateFilter": "all",
              "members": [],
              "showCompleted": false
            }} onFiltersChange={function (filters: FilterOptions): void {
              throw new Error('Function not implemented.');
            } } onClearFilters={function (): void {
              throw new Error('Function not implemented.');
            } } totalCards={0} filteredCount={0} />
        

        {/* Board Content */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-6 h-full min-w-max">
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
            <div className="rotate-3 opacity-90 cursor-grabbing">
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
    </PageModel>
    </div>
  );
}