// src/pages/Boards/index.tsx
// 📋 PÁGINA PRINCIPAL - LISTAGEM DE BOARDS

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layout, Plus, RefreshCw, Search, X, Grid3x3, List as ListIcon } from 'lucide-react';
import toast from 'react-hot-toast';

// Layout
import PageModel from '../../components/layout/PageModel';

// Componentes Comuns
import { LoadingState, EmptyState } from '../../components/common';

// Types & Constants
import type { Board, BoardFormData, BoardColor } from '../../types/boards';
import { BOARD_COLORS } from '../../constants/boards';

// Mock Data
import { MOCK_BOARDS } from '../../mock/boards.mock';

// ============================================
// TYPES
// ============================================

type ViewMode = 'grid' | 'list';

// ============================================
// BOARD CARD COMPONENT
// ============================================

interface BoardCardProps {
  board: Board;
  onEdit: (board: Board) => void;
  onDelete: (board: Board) => void;
  onClick: (board: Board) => void;
}

function BoardCardComponent({ board, onEdit, onDelete, onClick }: BoardCardProps) {
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
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
      {/* Header com cor */}
      <div className={`bg-gradient-to-r ${colorConfig.gradient} h-32 p-6 relative`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
              {board.title}
            </h3>
          </div>
          
          {/* Menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <Layout size={20} className="text-white" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10 min-w-[160px]">
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
                  <span className="text-sm font-semibold text-red-600">Deletar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
          {board.description || 'Sem descrição'}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Atualizado em {formatDate(board.updated_at)}</span>
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
  const [showForm, setShowForm] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [boardToDelete, setBoardToDelete] = useState<Board | null>(null);

  const [formData, setFormData] = useState<BoardFormData>({
    title: '',
    description: '',
    color: 'blue',
    school: 1,
  });

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
  };

  // ============================================
  // HANDLERS
  // ============================================

  const handleCreateBoard = () => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    if (editingBoard) {
      setBoards(prev => prev.map(b => 
        b.id === editingBoard.id 
          ? { ...b, ...formData, updated_at: new Date().toISOString() }
          : b
      ));
      toast.success('✅ Board atualizado com sucesso!');
    } else {
      const newBoard: Board = {
        id: Math.max(...boards.map(b => b.id)) + 1,
        ...formData,
        is_archived: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setBoards(prev => [newBoard, ...prev]);
      toast.success('✅ Board criado com sucesso!');
    }

    resetForm();
  };

  const handleEdit = (board: Board) => {
    setFormData({
      title: board.title,
      description: board.description || '',
      color: board.color || 'blue',
      school: board.school,
    });
    setEditingBoard(board);
    setShowForm(true);
  };

  const handleDelete = () => {
    if (!boardToDelete) return;
    setBoards(prev => prev.filter(b => b.id !== boardToDelete.id));
    toast.success('✅ Board deletado com sucesso!');
    setBoardToDelete(null);
  };

  const handleBoardClick = (board: Board) => {
    navigate(`/boards/${board.id}`);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      color: 'blue',
      school: 1,
    });
    setEditingBoard(null);
    setShowForm(false);
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) return 'Título é obrigatório';
    if (formData.title.trim().length < 3) return 'Título deve ter no mínimo 3 caracteres';
    return null;
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
      <LoadingState
        message="Carregando boards..."
        icon={<Layout size={48} className="text-blue-600" />}
      />
    );
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <PageModel>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Meus Boards
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Layout size={16} />
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
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Novo Board</span>
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
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Layout className="text-white" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider">
                Total de Boards
              </p>
              <p className="text-3xl font-bold text-gray-900">{stats.total} ativos</p>
            </div>
          </div>

          {stats.archived > 0 && (
            <div className="text-sm text-gray-600">
              {stats.archived} arquivado{stats.archived !== 1 ? 's' : ''}
            </div>
          )}
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
        <EmptyState
          icon={<Layout className="h-16 w-16 text-gray-400" />}
          title="Nenhum board encontrado"
          description={
            searchTerm
              ? 'Tente ajustar sua busca'
              : 'Crie seu primeiro board para começar a organizar suas tarefas'
          }
        />
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          <AnimatePresence mode="popLayout">
            {filteredBoards.map((board) => (
              <BoardCardComponent
                key={board.id}
                board={board}
                onEdit={handleEdit}
                onDelete={setBoardToDelete}
                onClick={handleBoardClick}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {editingBoard ? '✏️ Editar Board' : '➕ Novo Board'}
                </h3>
                <p className="text-sm text-blue-100">
                  {editingBoard ? 'Atualize as informações' : 'Crie um novo board'}
                </p>
              </div>
              <button onClick={resetForm} className="p-2 hover:bg-white/20 rounded-lg">
                <X className="text-white" size={24} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Título */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Planejamento 2024"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  placeholder="Descreva o propósito deste board..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Cor */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Cor do Board
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {(Object.keys(BOARD_COLORS) as BoardColor[]).map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.color === color
                          ? 'border-gray-900 shadow-md scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`h-8 bg-gradient-to-r ${BOARD_COLORS[color].gradient} rounded-lg`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleCreateBoard}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-md"
              >
                {editingBoard ? 'Atualizar Board' : 'Criar Board'}
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}

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
    </PageModel>
  );
}