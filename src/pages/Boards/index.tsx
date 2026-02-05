// src/pages/Boards/index.tsx
// 📋 PÁGINA BOARDS REFATORADA - LISTAGEM DE BOARDS FUNCIONANDO

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Plus, 
  Star,
  Archive,
  Grid3x3,
  List as ListIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ============================================
// COMPONENTES COMUNS (REUTILIZÁVEIS)
// ============================================
import { 
  StatCard, 
  PageFilters,
  ConfirmDialog,
} from '../../components/common';

// ============================================
// COMPONENTES LOCAIS
// ============================================
import CreateBoardModal from './components/Modals/CreateBoardModal';
import BoardCard from './components/Board/BoardCard';

// Types & Constants
import type { Board, BoardColor } from '../../types/boards';

// Mock Data
import { MOCK_BOARDS } from '../../mock/boards.mock';
import PageModel from '../../components/layout/PageModel';
import { ListPageHeader } from '../../components/layout/PageHeader';

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
// VIEW MODES CONFIG
// ============================================

const VIEW_MODES = [
  { value: 'grid', icon: <Grid3x3 size={18} />, label: 'Grade' },
  { value: 'list', icon: <ListIcon size={18} />, label: 'Lista' },
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function BoardsPage() {
  const navigate = useNavigate();

  // ============================================
  // STATE
  // ============================================

  const [boards, setBoards] = useState<Board[]>(MOCK_BOARDS);
  const [starredBoards, setStarredBoards] = useState<Set<number>>(new Set([1, 2]));
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showArchived, setShowArchived] = useState(false);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [boardToDelete, setBoardToDelete] = useState<Board | null>(null);

  // ============================================
  // COMPUTED STATS
  // ============================================

  const stats = useMemo(() => {
    const active = boards.filter(b => !b.is_archived);
    const starred = active.filter(b => starredBoards.has(b.id));
    const archived = boards.filter(b => b.is_archived);
    
    return {
      total: active.length,
      starred: starred.length,
      archived: archived.length,
    };
  }, [boards, starredBoards]);

  // ============================================
  // FILTERED BOARDS
  // ============================================

  const filteredBoards = useMemo(() => {
    let filtered = boards.filter(b => 
      showArchived ? b.is_archived : !b.is_archived
    );

    if (searchTerm) {
      filtered = filtered.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [boards, searchTerm, showArchived]);

  // Verificar se há filtros ativos
  const hasActiveFilters = useMemo(() => {
    return searchTerm !== '' || showArchived;
  }, [searchTerm, showArchived]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleBoardClick = (board: Board) => {
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

  const handleEdit = (board: Board) => {
    setEditingBoard(board);
    setShowCreateModal(true);
  };

  const handleCreateBoard = (data: CreateBoardData) => {
    const newBoard: Board = {
      id: Math.max(...boards.map(b => b.id), 0) + 1,
      school: 1, // TODO: pegar da sessão
      title: data.title,
      description: data.description,
      color: data.color,
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setBoards(prev => [...prev, newBoard]);
    setShowCreateModal(false);
    toast.success('✅ Board criado com sucesso!');
  };

  const handleUpdateBoard = (updates: Partial<Board>) => {
    if (!editingBoard) return;
    
    setBoards(prev => prev.map(b =>
      b.id === editingBoard.id
        ? { ...b, ...updates, updated_at: new Date().toISOString() }
        : b
    ));
    setShowCreateModal(false);
    setEditingBoard(null);
    toast.success('✅ Board atualizado!');
  };

  const handleDelete = () => {
    if (!boardToDelete) return;
    
    setBoards(prev => prev.filter(b => b.id !== boardToDelete.id));
    setBoardToDelete(null);
    toast.success('✅ Board deletado!');
  };

  const handleRefresh = () => {
    toast.success('🔄 Boards atualizados!');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setShowArchived(false);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <PageModel>
      {/* Header */}
        <ListPageHeader
        title="Meus Boards"
        icon={<Layout size={16} />}
        subtitle="Organize seus projetos e tarefas com boards personalizados"
        onRefresh={handleRefresh}
        onNew={() => setShowCreateModal(true)}
        isRefreshing={false}
        // isRefreshing={isLoading}
        newLabel="Novo Board"
      />

      {/* ========================================== */}
      {/* STATS (USANDO STATCARD COMUM) */}
      {/* ========================================== */}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          label="Total de Boards"
          value={stats.total}
          icon={<Layout size={24} className="text-blue-600" />}
          color="blue"
          subtitle="Boards ativos"
        />

        <StatCard
          label="Favoritos"
          value={stats.starred}
          icon={<Star size={24} className="text-yellow-600" />}
          color="yellow"
          subtitle="Boards marcados"
        />

        <StatCard
          label="Arquivados"
          value={stats.archived}
          icon={<Archive size={24} className="text-gray-600" />}
          color="green"
          subtitle="Boards inativos"
        />
      </div>

      {/* ========================================== */}
      {/* FILTERS (USANDO PAGEFILTERS COMUM) */}
      {/* ========================================== */}
      
      <PageFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar boards..."
        
        viewMode={viewMode}
        viewModes={VIEW_MODES}
        onViewModeChange={(mode) => setViewMode(mode as ViewMode)}
        
        onNew={() => setShowCreateModal(true)}
        newLabel="Novo Board"
        onRefresh={handleRefresh}
        
        advancedFilters={
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              Mostrar arquivados
            </label>
          </div>
        }
        
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      {/* ========================================== */}
      {/* BOARDS GRID/LIST */}
      {/* ========================================== */}
      
      <div className="mb-6">
        {filteredBoards.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-200"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Layout className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nenhum board encontrado
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              {searchTerm
                ? 'Tente ajustar sua busca ou limpar os filtros'
                : showArchived
                ? 'Nenhum board arquivado no momento'
                : 'Crie seu primeiro board para começar a organizar suas tarefas'}
            </p>
            {!searchTerm && !showArchived && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-lg shadow-blue-500/30"
              >
                <Plus size={20} />
                Criar Primeiro Board
              </button>
            )}
          </motion.div>
        ) : (
          // Boards Grid/List
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
          }>
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

      {/* ========================================== */}
      {/* RESULTS INFO */}
      {/* ========================================== */}
      
      {filteredBoards.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center"
        >
          <p className="text-gray-700 font-semibold">
            Mostrando <span className="text-blue-600 font-bold">{filteredBoards.length}</span> de{' '}
            <span className="text-blue-600 font-bold">{showArchived ? stats.archived : stats.total}</span> boards
            {hasActiveFilters && (
              <span className="text-gray-600 text-sm ml-2">(filtrado)</span>
            )}
          </p>
        </motion.div>
      )}

      {/* ========================================== */}
      {/* MODALS */}
      {/* ========================================== */}
      
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

      {/* Delete Confirmation (USANDO CONFIRMDIALOG COMUM) */}
      {boardToDelete && (
        <ConfirmDialog
          isOpen={!!boardToDelete}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja deletar o board "${boardToDelete.title}"? Todas as listas e cards serão removidos permanentemente.`}
          confirmLabel="Deletar Board"
          cancelLabel="Cancelar"
          onConfirm={handleDelete}
          onCancel={() => setBoardToDelete(null)}
          variant="danger"
        />
      )}
      </PageModel>
    </div>
  );
}