// src/pages/Documents/index.tsx - ✅ REFATORADA
import { useState, useMemo } from 'react';
import { useFileSystem } from '../../hooks/useFileSystem';
import type { FileSystemItem } from '../../hooks/useFileSystem';
import { ViewToggle, type ViewMode } from '../../components/common';

// Document Components
import DocumentsBreadcrumb from '../../components/Documents/DocumentsBreadcrumb';
import DocumentsToolbar from '../../components/Documents/DocumentsToolbar';
import DocumentsContent from '../../components/Documents/DocumentsContent';
import CreateFolderModal from '../../components/Documents/CreateFolderModal';
import RenameModal from '../../components/Documents/RenameModal';
import DeleteConfirmModal from '../../components/Documents/DeleteConfirmModal';

/**
 * ============================================
 * DOCUMENTS PAGE - REFATORADA
 * ============================================
 * 
 * Página de gerenciamento de documentos
 * Toda lógica de estado está no hook useFileSystem
 * Componentes são apenas de apresentação
 */
export default function DocumentsPage() {
  
  // ============================================
  // HOOKS & STATE
  // ============================================
  
  const {
    currentItems,
    breadcrumbPath,
    selectedItems,
    navigateToFolder,
    toggleSelectItem,
    clearSelection,
    createFolder,
    uploadFile,
    deleteItems,
    renameItem,
  } = useFileSystem();

  // Local UI state
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [renamingItem, setRenamingItem] = useState<FileSystemItem | null>(null);

  // ============================================
  // COMPUTED
  // ============================================

  const filteredItems = useMemo(() => {
    if (!searchTerm) return currentItems;
    
    return currentItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentItems, searchTerm]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      uploadFile(file.name, file.size, file.type);
    });
  };

  const handleDoubleClick = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      navigateToFolder(item.id);
    }
  };

  const handleRename = (id: string, newName: string) => {
    renameItem(id, newName);
  };

  const openRenameModal = (item: FileSystemItem) => {
    setRenamingItem(item);
    setShowRename(true);
  };

  const closeRenameModal = () => {
    setRenamingItem(null);
    setShowRename(false);
  };

  const handleDelete = () => {
    deleteItems(selectedItems);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Documentos</h1>
                <p className="text-gray-600 mt-1">Gerencie seus arquivos e pastas</p>
              </div>
              
              <ViewToggle
                viewMode={viewMode}
                onToggle={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              />
            </div>

            {/* Breadcrumb */}
            <DocumentsBreadcrumb
              path={breadcrumbPath}
              onNavigate={navigateToFolder}
            />

            {/* Toolbar */}
            <DocumentsToolbar
              selectedCount={selectedItems.length}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onCreateFolder={() => setShowCreateFolder(true)}
              onUpload={handleUpload}
              onDelete={() => setShowDelete(true)}
              onClearSelection={clearSelection}
            />

            {/* Content */}
            <DocumentsContent
              items={filteredItems}
              selectedItems={selectedItems}
              viewMode={viewMode}
              searchTerm={searchTerm}
              onSelect={toggleSelectItem}
              onDoubleClick={handleDoubleClick}
              onRename={openRenameModal}
            />
          </div>
        </main>
      </div>

      {/* Modals */}
      <CreateFolderModal
        isOpen={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
        onConfirm={createFolder}
      />

      <RenameModal
        isOpen={showRename}
        item={renamingItem}
        onClose={closeRenameModal}
        onConfirm={handleRename}
      />

      <DeleteConfirmModal
        isOpen={showDelete}
        count={selectedItems.length}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}