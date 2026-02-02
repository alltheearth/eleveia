// src/pages/Boards/index.tsx
// 📋 PÁGINA PRINCIPAL - LISTAGEM DE BOARDS KANBAN

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Plus, 
  RefreshCw, 
  Search, 
  X, 
  Grid3x3, 
  List as ListIcon,
  Star,
  StarOff,
  Archive,
  TrendingUp,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Modals
import CreateBoardModal from './components/Modals/CreateBoardModal';

// Types & Constants
import type { Board, BoardColor } from '../../types/boards';
import { BOARD_COLORS } from '../../constants/boards';

// Mock Data (depois será substituído pela API)
import { MOCK_BOARDS } from '../../mock/boards.mock';

// ============================================
// TYPES
// ============================================

type ViewMode = 'grid' | 'list';

interface CreateBoardData {
  title: string;
  description?: string;
  color: BoardColor;
}

// ============================================
// BOARD CARD COMPONENT
// ============================================

interface BoardCardProps {
  board: Board;
  onEdit: (board: Board) => void;
  onDelete: (board: Board) => void;
  onClick: (board: Board) => void;
  onToggleStar?: (board: Board) => void;
  isStarred?: boolean;
}

function BoardCard({ board, onEdit, onDelete, onClick, onToggleStar, isStarred }: BoardCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const colorConfig = BOARD_COLORS[board.color || 'blue'];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15)' }}
      onClick={() => onClick(board)}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
    >
      {/* Star Button (top-right) */}
      {onToggleStar && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(board);
          }}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {isStarred ? (
            <Star size={18} className="text-yellow-500" fill="currentColor" />
          ) : (
            <StarOff size={18} className="text-gray-400" />
          )}
        </button>
      )}

      {/* Header com gradiente */}
      <div className={`bg-gradient-to-r ${colorConfig.gradient} h-32 p-6 relative`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-12">
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
              {board.title}
            </h3>
          </div>
          
          {/* Menu de ações */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical size={20} className="text-white" />
            </button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10 min-w-[160px]"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick(board);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <Layout size={16} className="text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">Abrir Board</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(board);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <Edit2 size={16} className="text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">Editar</span>
                </button>
                <div className="border-t border-gray-200 my-2" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(board);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left"
                >
                  <Trash2 size={16} className="text-red-600" />
                  <span className="text-sm font-semibold text-red-600">Deletar</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
          {board.description || 'Sem descrição'}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(board.updated_at)}
          </span>
          <span className={`px-2 py-1 rounded-full ${colorConfig.light} ${colorConfig.text} font-semibold`}>
            {board.color}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function BoardsPage() {
  const navigate = useNavigate();

  // ============================================
  // STATE
  // ============================================

  const [boards, setBoards] = useState<Board[]>(MOCK_BOARDS);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [boardToDelete, setBoardToDelete] = useState<Board | null>(null);
  const [starredBoards, setStarredBoards] = useState<Set<number>>(new Set());

  // ============================================
  // COMPUTED
  // ============================================

  const filteredBoards = useMemo(() => {
    return boards.filter(b => 
      !b.is_archived && 
      b.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [boards, searchTerm]);

  const stats = {
    total: boards.filter(b => !b.is_archived).length,
    archived: boards.filter(b => b.is_archived).length,
    starred: starredBoards.size,
  };

  // ============================================
  // HANDLERS
  // ============================================

  const handleCreateBoard = (data: CreateBoardData) => {
    const newBoard: Board = {
      id: Math.max(...boards.map(b => b.id), 0) + 1,
      school: 1, // Será pego do contexto depois
      title: data.title,
      description: data.description,
      color: data.color,
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setBoards(prev => [newBoard, ...prev]);
    toast.success('✅ Board criado com sucesso!');
    setShowCreateModal(false);
  };

  const handleUpdateBoard = (id: number, data: Partial<Board>) => {
    setBoards(prev => prev.map(b => 
      b.id === id 
        ? { ...b, ...data, updated_at: new Date().toISOString() }
        : b
    ));
    toast.success('✅ Board atualizado com sucesso!');
    setEditingBoard(null);
  };

  const handleEdit = (board: Board) => {
    setEditingBoard(board);
    setShowCreateModal(true);
  };

  const handleDelete = () => {
    if (!boardToDelete) return;
    setBoards(prev => prev.filter(b => b.id !== boardToDelete.id));
    toast.success('✅ Board deletado com sucesso!');
    setBoardToDelete(null);
  };

  const handleBoardClick = (board: Board) => {
    // Navegar para a visualização do board
    navigate(`/boards/${board.id}`);
  };

  const handleToggleStar = (board: Board) => {
    setStarredBoards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(board.id)) {
        newSet.delete(board.id);
        toast.success('⭐ Removido dos favoritos');
      } else {
        newSet.add(board.id);
        toast.success('⭐ Adicionado aos favoritos!');
      }
      return newSet;
    });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('🔄 Dados atualizados!');
    }, 1000);
  };

  // ============================================
  // LOADING STATE
  // ============================================

  if (isLoading && boards.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Layout size={48} className="text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600 font-semibold">Carregando boards...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Layout className="text-blue-600" size={40} />
                Meus Boards
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                Organize seus projetos e tarefas com boards personalizados
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50"
              >
                <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Atualizar</span>
              </button>

              <button
                onClick={() => {
                  setEditingBoard(null);
                  setShowCreateModal(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
              >
                <Plus size={20} />
                <span>Novo Board</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-blue-200 shadow-sm mb-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              {/* Total */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Layout className="text-white" size={28} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider">
                    Total de Boards
                  </p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>

              {/* Starred */}
              {stats.starred > 0 && (
                <div className="flex items-center gap-3 px-4 py-2 bg-yellow-100 rounded-xl border border-yellow-300">
                  <Star className="text-yellow-600" size={20} fill="currentColor" />
                  <span className="font-bold text-yellow-700">{stats.starred} favoritos</span>
                </div>
              )}

              {/* Archived */}
              {stats.archived > 0 && (
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-xl border border-gray-300">
                  <Archive className="text-gray-600" size={20} />
                  <span className="font-bold text-gray-700">{stats.archived} arquivados</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp size={20} />
              <span className="font-bold">+12% este mês</span>
            </div>
          </div>
        </motion.div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar boards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* View Mode */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                }`}
                title="Grade"
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                }`}
                title="Lista"
              >
                <ListIcon size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Boards Grid/List */}
        {filteredBoards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Layout className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nenhum board encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Tente ajustar sua busca'
                : 'Crie seu primeiro board para começar a organizar suas tarefas'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
              >
                <Plus size={20} />
                Criar Primeiro Board
              </button>
            )}
          </motion.div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            <AnimatePresence mode="popLayout">
              {filteredBoards.map((board, index) => (
                <motion.div
                  key={board.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <BoardCard
                    board={board}
                    onEdit={handleEdit}
                    onDelete={setBoardToDelete}
                    onClick={handleBoardClick}
                    onToggleStar={handleToggleStar}
                    isStarred={starredBoards.has(board.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create/Edit Board Modal */}
      <CreateBoardModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingBoard(null);
        }}
        onCreate={handleCreateBoard}
        editingBoard={editingBoard}
        onUpdate={handleUpdateBoard}
      />

      {/* Delete Confirmation */}
      {boardToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja deletar o board "<strong>{boardToDelete.title}</strong>"? 
              Todas as listas e cards serão removidos permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold"
              >
                Deletar
              </button>
              <button
                onClick={() => setBoardToDelete(null)}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}