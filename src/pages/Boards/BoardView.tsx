// src/pages/Boards/BoardView.tsx
// 📋 VISUALIZAÇÃO INDIVIDUAL DO BOARD - KANBAN PROFISSIONAL

import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  MoreVertical, 
  Star, 
  StarOff,
  Archive,
  Settings,
  Users,
  Filter,
  Search,
  X,
  TrendingUp,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Components
import BoardList from './components/List/BoardList';
import AddListButton from './components/List/AddListButton';
import CardModal from './components/Card/CardModal';
import BoardSettingsModal from './components/Modals/BoardSettingsModal';

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
  isStarred: boolean;
}

function BoardHeader({ board, onBack, onToggleStar, onArchive, onSettings, isStarred }: BoardHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const colorConfig = BOARD_COLORS[board.color || 'blue'];

  return (
    <div className={`bg-gradient-to-r ${colorConfig.gradient} px-6 py-5 shadow-lg`}>
      <div className="flex items-center justify-between">
        
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Voltar para boards"
          >
            <ArrowLeft className="text-white" size={24} />
          </button>

          {/* Board Info */}
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {board.title}
            </h1>
            {board.description && (
              <p className="text-sm text-white/80 line-clamp-1 max-w-xl">
                {board.description}
              </p>
            )}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          
          {/* Star/Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleStar}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title={isStarred ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            {isStarred ? (
              <Star className="text-white" size={20} fill="white" />
            ) : (
              <StarOff className="text-white" size={20} />
            )}
          </motion.button>

          {/* Share Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-semibold backdrop-blur-sm">
            <Users size={18} />
            <span className="hidden sm:inline">Compartilhar</span>
          </button>

          {/* More Options Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Mais opções"
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
                
                <div className="border-t border-gray-200 my-2" />
                
                <button
                  onClick={() => {
                    onArchive();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors text-left"
                >
                  <Archive size={16} className="text-orange-600" />
                  <span className="text-sm font-semibold text-orange-600">Arquivar Board</span>
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
  stats: {
    totalCards: number;
    totalLists: number;
    completedCards: number;
  };
}

function BoardToolbar({ searchTerm, onSearchChange, showFilters, onToggleFilters, stats }: BoardToolbarProps) {
  const completionRate = stats.totalCards > 0 
    ? Math.round((stats.completedCards / stats.totalCards) * 100) 
    : 0;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        
        {/* Left: Search */}
        <div className="flex-1 min-w-[250px] max-w-md relative">
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

        {/* Right: Stats + Filters */}
        <div className="flex items-center gap-4">
          
          {/* Quick Stats */}
          <div className="hidden md:flex items-center gap-4">
            {/* Lists */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
              <TrendingUp size={16} className="text-blue-600" />
              <span className="text-sm font-bold text-blue-700">{stats.totalLists} listas</span>
            </div>
            
            {/* Cards */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-200">
              <CheckCircle2 size={16} className="text-purple-600" />
              <span className="text-sm font-bold text-purple-700">{stats.totalCards} cards</span>
            </div>

            {/* Completion */}
            {stats.totalCards > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
                <Clock size={16} className="text-green-600" />
                <span className="text-sm font-bold text-green-700">{completionRate}% concluído</span>
              </div>
            )}
          </div>

          {/* Filters Button */}
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

export default function BoardView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ============================================
  // STATE
  // ============================================

  const [board, setBoard] = useState<Board | null>(
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
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  // ============================================
  // COMPUTED
  // ============================================

  const filteredCards = useMemo(() => {
    return cards.filter(card =>
      !card.is_archived &&
      card.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cards, searchTerm]);

  const stats = useMemo(() => {
    const activeCards = cards.filter(c => !c.is_archived);
    const activeLists = lists.filter(l => !l.is_archived);
    
    // Aqui você pode adicionar lógica para marcar cards como "concluídos"
    // Por exemplo, cards em uma lista específica ou com um status
    const completedCards = 0; // TODO: implementar lógica de conclusão

    return {
      totalCards: activeCards.length,
      totalLists: activeLists.length,
      completedCards,
    };
  }, [cards, lists]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleBack = () => {
    navigate('/boards');
  };

  const handleToggleStar = () => {
    setIsStarred(!isStarred);
    toast.success(isStarred ? '⭐ Removido dos favoritos' : '⭐ Adicionado aos favoritos!');
  };

  const handleArchive = () => {
    if (window.confirm('Tem certeza que deseja arquivar este board?')) {
      toast.success('📦 Board arquivado!');
      navigate('/boards');
    }
  };

  const handleSettings = () => {
    setShowSettingsModal(true);
  };

  const handleUpdateBoard = (updates: Partial<Board>) => {
    if (board) {
      setBoard({ ...board, ...updates, updated_at: new Date().toISOString() });
      toast.success('✅ Board atualizado!');
    }
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
      <div className="flex h-screen items-center justify-center bg-gray-50">
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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <BoardHeader
        board={board}
        onBack={handleBack}
        onToggleStar={handleToggleStar}
        onArchive={handleArchive}
        onSettings={handleSettings}
        isStarred={isStarred}
      />

      {/* Toolbar */}
      <BoardToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        stats={stats}
      />

      {/* Board Content - Horizontal Scroll */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="flex gap-6 p-6 h-full min-w-max">
          {/* Lists */}
          <AnimatePresence mode="popLayout">
            {lists
              .filter(l => !l.is_archived)
              .sort((a, b) => a.position - b.position)
              .map((list, index) => (
                <motion.div
                  key={list.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <BoardList
                    list={list}
                    cards={filteredCards.filter(c => c.list === list.id)}
                    onUpdateList={handleUpdateList}
                    onDeleteList={handleDeleteList}
                    onCreateCard={handleCreateCard}
                    onUpdateCard={handleUpdateCard}
                    onDeleteCard={handleDeleteCard}
                    onCardClick={handleCardClick}
                  />
                </motion.div>
              ))}
          </AnimatePresence>

          {/* Add List Button */}
          <AddListButton onCreateList={handleCreateList} />
        </div>
      </div>

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

      {/* Settings Modal */}
      {showSettingsModal && (
        <BoardSettingsModal
          isOpen={showSettingsModal}
          board={board}
          onClose={() => setShowSettingsModal(false)}
          onUpdate={handleUpdateBoard}
          onArchive={handleArchive}
          onDelete={() => {
            toast.success('🗑️ Board deletado!');
            navigate('/boards');
          }}
        />
      )}
    </div>
  );
}