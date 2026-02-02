// src/pages/Boards/components/List/ListActions.tsx
// ⚙️ AÇÕES DA LISTA - Menu de opções

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoreVertical,
  Edit2,
  Trash2,
  Archive,
  Copy,
  MoveRight,
  SortAsc,
} from 'lucide-react';
import type { BoardList } from '../../../../types/boards';

// ============================================
// TYPES
// ============================================

interface ListActionsProps {
  list: BoardList;
  onEdit: () => void;
  onDelete: () => void;
  onArchive?: () => void;
  onDuplicate?: () => void;
  onMove?: () => void;
  onSort?: () => void;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ListActions({
  list,
  onEdit,
  onDelete,
  onArchive,
  onDuplicate,
  onMove,
  onSort,
}: ListActionsProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        title="Ações da lista"
      >
        <MoreVertical size={16} className="text-gray-600" />
      </button>

      {/* Actions Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 min-w-[200px]"
            >
              {/* Edit */}
              <button
                onClick={() => {
                  onEdit();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left"
              >
                <Edit2 size={16} className="text-blue-600" />
                <div>
                  <span className="text-sm font-semibold text-gray-700 block">Renomear</span>
                  <span className="text-xs text-gray-500">Editar título da lista</span>
                </div>
              </button>

              {/* Sort Cards */}
              {onSort && (
                <button
                  onClick={() => {
                    onSort();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition-colors text-left"
                >
                  <SortAsc size={16} className="text-purple-600" />
                  <div>
                    <span className="text-sm font-semibold text-gray-700 block">Ordenar cards</span>
                    <span className="text-xs text-gray-500">Por data, prioridade...</span>
                  </div>
                </button>
              )}

              {/* Duplicate */}
              {onDuplicate && (
                <button
                  onClick={() => {
                    onDuplicate();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition-colors text-left"
                >
                  <Copy size={16} className="text-green-600" />
                  <div>
                    <span className="text-sm font-semibold text-gray-700 block">Duplicar</span>
                    <span className="text-xs text-gray-500">Copiar lista e cards</span>
                  </div>
                </button>
              )}

              {/* Move */}
              {onMove && (
                <button
                  onClick={() => {
                    onMove();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 transition-colors text-left"
                >
                  <MoveRight size={16} className="text-indigo-600" />
                  <div>
                    <span className="text-sm font-semibold text-gray-700 block">Mover</span>
                    <span className="text-xs text-gray-500">Mover para outro board</span>
                  </div>
                </button>
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 my-2" />

              {/* Archive */}
              {onArchive && (
                <button
                  onClick={() => {
                    onArchive();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors text-left"
                >
                  <Archive size={16} className="text-orange-600" />
                  <div>
                    <span className="text-sm font-semibold text-orange-600 block">Arquivar</span>
                    <span className="text-xs text-orange-500">Ocultar esta lista</span>
                  </div>
                </button>
              )}

              {/* Delete */}
              <button
                onClick={() => {
                  if (window.confirm(`Tem certeza que deseja deletar a lista "${list.title}"? Todos os cards serão removidos.`)) {
                    onDelete();
                  }
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left"
              >
                <Trash2 size={16} className="text-red-600" />
                <div>
                  <span className="text-sm font-semibold text-red-600 block">Deletar</span>
                  <span className="text-xs text-red-500">Remover permanentemente</span>
                </div>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}